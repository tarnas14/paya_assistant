import React, {Component} from 'react'
import {getPendingPayments, pay} from '../api'
import assistentImage from '../images/paya.png'
import './Home.css'
import Loading from '../components/Loading'
import {cyan300} from 'material-ui/styles/colors'
import {CardText, CardTitle, Card} from 'material-ui/Card'
import LinearProgress from 'material-ui/LinearProgress'
import Content from '../components/Content'
import MySnackbar from '../components/MySnackbar'

import speech from '../speechApi'
import languagePacks from '../languagePacks'
import {speak} from '../environment'
import {wait} from '../utils'

const settings = {
  langs: ['pl-PL'],
  defaultLangs: ['en-GB', 'en_GB'],
  pitch: 1,
  rate: 1
}

const nullStarted = {started: () => {}}

export default class extends Component {

  constructor () {
    super()
    this.state = {
      debug: [],
      langPack: languagePacks.find(p => p.predicate()),
      speech: speech(
        settings,
        langPack => this.setState({langPack}),
        text => this.setState({speaking: text}),
        () => this.setState({listening: true}),
        () => this.setState({listening: false}),
        // a => console.log(a) && this.debug(a)
      )
    }
  }

  debug = a => this.setState(s => ({debug: [a, ...s.debug]}))

  getPayments = () => this.setState({pendingPayments: getPendingPayments()})
  async componentDidMount () {
    this.getPayments()
    await this.greet(await this.props.user)
    await this.next()
  }

  async greet (user) {
    const s = await this.state.speech
    const {langPack: {lines}} = this.state
    await s.say(lines.greeting(user.name))
    await s.say(lines.howCanIHelpYou()) 
  }

  async waitForCommand (commands) {
    const s = await this.state.speech
    this.setState({waitingForCommands: `Dostępne komendy: ${commands.map(c => `"${c.waitFor}"`).join(', ')}`})
    const command = await s.waitForCommand(commands)
    this.setState({waitingForCommands: ''})
    await command()
  }

  async next () {
    const s = await this.state.speech
    const {langPack: {lines, commands}} = this.state
    do {
      await this.waitForCommand([
        { waitFor: commands.payments, command: this.payments.bind(this) },
        { waitFor: commands.whatIsTheMeaningOfLife, command: this.meaningOfLife.bind(this)}
      ])
      this.getPayments()
      await s.say(lines.howElseCanIHelpYou())
    } while(Boolean(speak))
  }

  async meaningOfLife () {
    const s = await this.state.speech
    const {langPack: {lines}} = this.state
    await s.say(lines.ifYouReallyMustKnow())
    await s.say(lines.theMeaningOfLife())
    await s.say(lines.noProblem())
  }

  listening = l => this.setState({opacity: l ? 1 : 0.7})

  setPayment = payment => this.setState({currentPayment: payment})
  clearPayment = () => this.setState({speaking: '', currentPayment: undefined, showProgressIndicator: false, success: false})
  progress = () => this.setState({showProgressIndicator: true})
  success = () => this.setState({showProgressIndicator: false, success: true})

  async payments () {
    const {langPack: {lines, commands}} = this.state

    const s = await this.state.speech
    const pendingPayments = await this.state.pendingPayments


    if (pendingPayments.length) {
      await s.say(lines.youHavePayments(lines.pendingPaymentsNumeral(pendingPayments.length)))
      const listPayments = async (payments) => {
        let skipped = 0
        for(let i = 0; i < payments.length; ++i) {
          const payment = payments[i]
          this.setPayment(payment)
          await s.say(lines.paymentDescription(payment))
          await this.waitForCommand([
            {
              waitFor: commands.pay,
              command: async () => {
                this.progress()
                await s.say(lines.paying(payment.name))
                await wait(800)
                await pay(payment.id)
                this.success()
                await s.say(lines.considerItDone())
                await wait(800)
                this.clearPayment()
              }
            },
            {
              waitFor: commands.skip,
              command: async () => {
                skipped++
                await s.say(lines.skipping(payment.name), nullStarted)
                this.clearPayment()
              }
            },
          ])
        }
        await s.say(lines.thatWasTheLastOne())
        await s.say(lines.toSummarize())
        await s.say(lines.paid(payments.length - skipped))
        await s.say(lines.skipped(skipped))
        await s.say(lines.thatsAll(this.props.user.name))
      }

      const onlyList = async (payments) => {
        await s.say(lines.listingPayments())
        for(let i = 0; i < payments.length; ++i) {
          const payment = payments[i]
          this.setPayment(payment)
          await s.say(lines.paymentDescription(payment))
          await wait(200)
          if (i < payments.length - 1) {
            await s.say(lines.and())
          }
        }
      }

      await this.waitForCommand([
        {waitFor: commands.yes, command: listPayments.bind(null, pendingPayments)},
        {waitFor: commands.onlyList, command: onlyList.bind(null, pendingPayments)},
        {waitFor: commands.noThankYou, command: async () => await s.say(lines.noIsNo()) }
      ])
      return
    }

    await s.say(lines.noPendingPayments())
  }

  render () {
    const {langPack: {lines}} = this.state
    const hal = process.env.REACT_APP_HAL
    const assistent = hal ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png' : assistentImage
    const {debug, listening, currentPayment, showProgressIndicator, success, speaking} = this.state
    return <div className='Home' style={{backgroundImage: `url(${assistent})`}}> <Content>
      <Card>
        {!currentPayment && speaking && <CardTitle title={speaking}/>}
        {currentPayment && <CardTitle
          subtitle={currentPayment.name}
          title={`${currentPayment.amount}zł`}
        />}
        {currentPayment && showProgressIndicator && <CardText><Loading top={-15}/></CardText>}
        {currentPayment && success && <CardText><span style={{color: cyan300, fontSize: '2em'}}>{lines.considerItDone()}</span></CardText>}
      </Card>
      {listening && <LinearProgress mode="indeterminate"/>}
      {debug && <div>{debug.map(d => <p>{d}</p>)}</div>}
      <MySnackbar
        open={Boolean(this.state.waitingForCommands)}
        message={this.state.waitingForCommands}
      />
    </Content></div>
  }
}
