import React, {Component} from 'react'
import {getPendingPayments, pay} from '../api'
import assistentImage from '../images/paya.png'
import './Home.css'
import Paper from 'material-ui/Paper'
import Loading from '../components/Loading'
import {cyan300} from 'material-ui/styles/colors'
import logo from '../images/logo.png'
import {CardText, CardTitle, CardHeader, Card} from 'material-ui/Card'
import LinearProgress from 'material-ui/LinearProgress'
import Content from '../components/Content'

const settings = {
  langs: ['pl-PL'],
  defaultLangs: ['en-GB', 'en_GB'],
  pitch: 1,
  rate: 1
}

const defaultCommand = process.env.REACT_APP_SKIP_COMMANDS ? 0 : -1
const speak = !Boolean(process.env.REACT_APP_SKIP_SPEECH)

const wait = async (delay = 100) => new Promise(resolve => {
  window.setTimeout(() => resolve(), delay)
})

const languagePacks = [
  {
    predicate: lang => settings.langs.includes(lang),
    commands: {
      payments: 'płatności',
      whatIsTheMeaningOfLife: 'jaki jest sens życia',
      pay: 'zapłać',
      skip: 'dalej',
      yes: 'tak proszę',
      onlyList: 'tylko wylistuj',
      noThankYou: 'nie dziękuję',
    },
    lines: {
      toSummarize: () => 'Podsumowując',
      theMeaningOfLife: () => 'Czasem nie włączą wam prezentacji, ale nie ma co się przejmować jeśli dobrze się bawiliście',
      noIsNo: () => 'Nie to nie',
      listingPayments: () => 'Listuję płatności.',
      noPendingPayments: () => 'Nie masz żadnych zaległych płatności.',
      availableCommands: () => 'Dostępne komendy to:',
      and: () => 'oraz',
      tryAgain: () => 'Spróbuj ponownie',
      greeting: name => `Witaj, ${name}`,
      howCanIHelpYou: () => 'W czym mogę Ci pomóc?',
      couldNotCatchThat: () => 'Nie dosłyszałam. Sprawdź czy masz włączony mikrofon.',
      unknownCommand: hit => `Nie rozpoznałam komendy '${hit}'.`,
      howElseCanIHelpYou: () => 'W czym jeszcze mogę Ci pomóc?',
      ifYouReallyMustKnow: () => 'Jeśli już koniecznie chcesz wiedzieć.',
      noProblem: () => 'Dzięki za hakaton, było super. ;)',
      pendingPaymentsNumeral: count => {
        const map = ['jedną zaległą płatność', 'dwie zaległe płatności', 'trzy zaległe płatności',
            'cztery zaległe płatności', 'pięć zaległych płatności', 'sześć zaległych płatności', 'siedem zaległych płatności', 'osiem zaległych płatności', 'dziewięć zaległych płatności', 'dziesięć zaległych płatności']

        return map[count - 1]
      },
      youHavePayments: pending => `Masz ${pending}. Chcesz się nimi teraz zająć?`,
      paymentDescription: payment => `${payment.name}. ${payment.amount}zł`,
      paying: name => `Opłacam ${name}`,
      considerItDone: () => 'Załatwione',
      skipping: name => `Pomijam ${name}`,
      thatWasTheLastOne: () => 'To była ostatnia płatność na liście',
      paid: count => `Uregulowane płatności: ${count}`,
      skipped: count => `Płatności pominięte: ${count}`,
      thatsAll: name => 'To by było na tyle'
    }
  },
  {
    predicate: () => true,
    commands: {
      payments: 'payments',
      whatIsTheMeaningOfLife: 'what is the meaning of life',
      pay: 'payment',
      skip: 'skip please',
      yes: 'yes please',
      onlyList: 'just list',
      noThankYou: 'no thank you',
    },
    lines: {
      toSummarize: () => 'Summarizing,',
      theMeaningOfLife: () => 'The meaning of life is: 42',
      noIsNo: () => 'Whatever, then',
      listingPayments: () => 'Listing payments.',
      noPendingPayments: () => 'You have no pending payments.',
      availableCommands: () => 'Available commands are:',
      and: () => 'and',
      tryAgain: () => 'Try again',
      greeting: name => `Hello, ${name}`,
      howCanIHelpYou: () => 'How may I help you?',
      couldNotCatchThat: () => 'I did not catch that. Check if your mic is plugged in.',
      unknownCommand: hit => `Unknown command '${hit}'`,
      howElseCanIHelpYou: () => 'How else may I help you?',
      ifYouReallyMustKnow: () => 'If you really insist.',
      noProblem: () => 'You are welcome ;)',
      pendingPaymentsNumeral: count => {
        if (count === 1) {
          return '1 pending payment'
        }

        return `${count} pending payments`
      },
      youHavePayments: pending => `You have ${pending}. Do you want to take care of them now?`,
      paymentDescription: payment => `${payment.name}. ${payment.amount}zł`,
      paying: name => `Paying ${name}`,
      considerItDone: () => 'Done and done',
      skipping: name => `Skipping ${name}`,
      thatWasTheLastOne: () => 'That was the last one',
      paid: count => `We took care of ${count} payments`,
      skipped: count => `${count} left for the next time`,
      thatsAll: name => `That is all, folks`
    }
  },
]

const nullStarted = {started: () => {}}

const speech = async (settings, setPack, speaking = () => {}, listening = () => {}, notListening = () => {}, debug = () => {}) => {
  debug('test test')
  const synthesis = window.speechSynthesis

  const voice = await new Promise(resolve => {
    synthesis.onvoiceschanged = () => resolve(
      synthesis.getVoices().find(v => settings.langs.includes(v.lang)) ||
      synthesis.getVoices().find(v => settings.defaultLangs.includes(v.lang))
    )
  })

  const languagePack = languagePacks.find(pack => pack.predicate(voice && voice.lang))
  debug(JSON.stringify(languagePack))
  setPack(languagePack)
  const {lines, commands} = languagePack

  const utt = new SpeechSynthesisUtterance()
  utt.pitch = settings.pitch
  utt.rate = settings.rate
  utt.voice = voice
  utt.onboundary = () => console.log('boundary')
  utt.onmark = () => console.log('mark')
  utt.onpause = () => console.log('pause')

  const say = async (text, c) => {
    debug(`volume ${utt.volume}`)
    debug(`saying ${text}`)
    const callbacks = {
      started: () => speaking(text) || console.log('speaking', text),
      finished: () => {},//console.log('stopped speaking', text),
      onerror: e => console.log('error', e),
      ...c
    }

    if (!speak) {
      callbacks.started()
      callbacks.finished()
      return Promise.resolve()
    }

    utt.text = text
    return new Promise((resolve, reject) => {
      utt.onstart = () => {
        callbacks.started()
      }

      utt.onerror = (e) => {
        debug(JSON.stringify(e))
        callbacks.onerror()
        reject()
      }

      utt.onend = () => {
        callbacks.finished()
        resolve()
      }
      
      synthesis.speak(utt)
    })
  }

  const speechRecognition = window.webkitSpeechRecognition
  const speechGrammarList = window.webkitSpeechGrammarList
  const speechRecognitionEvent = window.webkitSpeechRecognitionEvent

  const waitForCommand = async (commands, cbs) => {
    const callbacks = {
      started: () => listening(),// || console.log('waiting for command'),
      finished: () => notListening(),//console.log('stopped waiting'),
      result: (h, c) => {},// console.log(h, c),
      error: (e) => console.log('error', e),
      tryAgain: () => {},
      ...cbs
    }

    console.log('waiting for commands', commands.map(c => `"${c.waitFor}"`).join())
    if (defaultCommand !== -1) {
      console.log('choosing', commands[defaultCommand])
      callbacks.finished()
      return Promise.resolve(commands[defaultCommand].command)
    }

    const addCommandsGrammar = (rec, comms) => {
      const speechRecognitionList = new speechGrammarList()
      const grammar = `#JSGF V1.0; grammar commands; public <command> = ${comms.map(c => c.waitFor).join(' | ')} ;` 
      speechRecognitionList.addFromString(grammar, 1)
      rec.grammars = speechRecognitionList
    }

    const recognition = new speechRecognition()
    // doesnt work for some reason
    addCommandsGrammar(recognition, commands)
    recognition.lang = voice.lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    let bounceCounter = 0
    const bounce = () => {
      bounceCounter++
    }

    const listCommands = async () => {
      if (bounceCounter % 3 === 0) {
        return
      }
      await say(lines.availableCommands())
      const availableCommands = commands.map(c => c.waitFor)
      for(let i = 0; i < availableCommands.length; ++i) {
        const availableCommand = availableCommands[i]
        await say(availableCommand)
        if (i + 2 === availableCommands.length) {
          await say(lines.and()) 
        } else {
          await wait(200)
        }
      }
      await say(lines.tryAgain())
    }

    let hit = false

    return new Promise((resolve, reject) => {
      recognition.onaudiostart = () => {
        console.log('audio start')
        debug('AUDIO START')
        callbacks.started()
      }
      
      recognition.onsoundend = () => {
        debug('SOUND END')
      }

      recognition.onsoundstart = () => {
        debug('SOUND START')
      }

      recognition.onerror = async (e) => {
        debug(JSON.stringify(e))
        if (e.error === 'no-speech') {
          bounce()
          await say(lines.couldNotCatchThat())
          recognition.stop()
          recognition.start()
          return
        }
        callbacks.error(e)
        callbacks.finished()
        recognition.stop()
        reject('error', e)
      }

      recognition.onstart = () => {
        debug('START')
      }

      recognition.onend = async () => {
        debug('END')
      }

      recognition.onaudioend = () => {
        debug('AUDIO END')
      }

      recognition.onnomatch = async () => {
        debug('NO MATCH')
        recognition.stop()
        await wait(300)
        recognition.start(0)
      }

      recognition.onresult = async (event) => {
        hit = event.results[event.results.length - 1][0].transcript
        debug('HIT')
        debug(hit)
        const confidence = event.results[0][0].confidence
        callbacks.result(hit, confidence)

        const command = commands.find(c => c.waitFor.toLowerCase() === hit.toLowerCase())
        if (!command) {
          bounce()
          await say(lines.unknownCommand(hit))
          await listCommands()

          recognition.stop()
          recognition.start()
          return
        }

        recognition.stop()
        callbacks.finished()
        resolve(command.command)
      }

      recognition.start()
    })
  }
  
  return {
    say,
    waitForCommand,
  }
}

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

  async next () {
    const s = await this.state.speech
    const {langPack: {lines, commands}} = this.state
    do {
      const command = await s.waitForCommand([
        { waitFor: commands.payments, command: this.payments.bind(this) },
        { waitFor: commands.whatIsTheMeaningOfLife, command: this.meaningOfLife.bind(this)}
      ])
      await command()
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

  // setPayment = () => {}
  setPayment = payment => this.setState({currentPayment: payment})
  // clearPayment = () => {}
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
          const command = await s.waitForCommand([
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
          await command()
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

      const command = await s.waitForCommand([
        {waitFor: commands.yes, command: listPayments.bind(null, pendingPayments)},
        {waitFor: commands.onlyList, command: onlyList.bind(null, pendingPayments)},
        {waitFor: commands.noThankYou, command: async () => await s.say(lines.noIsNo()) }
      ])
      await command()
      return
    }

    await s.say(lines.noPendingPayments())
  }

  render () {
    const {langPack: {lines}} = this.state
    const hal = process.env.REACT_APP_HAL
    const assistent = hal ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png' : assistentImage
    const {debug, opacity, listening, currentPayment, showProgressIndicator, success, speaking} = this.state
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
    </Content></div>
  }
}
