import React, {Component} from 'react'
import {getPendingPayments} from '../api'
import assistentImage from '../images/paya.png'
import './Home.css'
import Paper from 'material-ui/Paper'
import Loading from '../components/Loading'
import {cyan300} from 'material-ui/styles/colors'
import logo from '../images/logo.png'

const defaultCommand = process.env.REACT_APP_SKIP_COMMANDS ? 0 : -1
const speak = !Boolean(process.env.REACT_APP_SKIP_SPEECH)

const wait = async (delay = 100) => new Promise(resolve => {
  window.setTimeout(() => resolve(), delay)
})

const speech = async (settings) => {
  const synthesis = window.speechSynthesis

  const voice = await new Promise(resolve => {
    synthesis.onvoiceschanged = () => resolve(
      synthesis.getVoices().find(v => v.lang === settings.lang)
    )
  })

  const utt = new SpeechSynthesisUtterance()
  utt.pitch = settings.pitch
  utt.rate = settings.rate
  utt.voice = voice
  utt.onboundary = () => console.log('boundary')
  utt.onmark = () => console.log('mark')
  utt.onpause = () => console.log('pause')

  const say = async (text, c) => {
    const callbacks = {
      started: () => console.log('speaking', text),
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
      utt.onstart = callbacks.started

      utt.onerror = () => {
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
      started: () => {},//console.log('waiting for command'),
      finished: () => {},//console.log('stopped waiting'),
      result: (h, c) => console.log(h, c),
      error: (e) => console.log('error', e),
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
    recognition.lang = settings.lang
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
      await say('Dostępne komendy to.')
      const availableCommands = commands.map(c => c.waitFor)
      for(let i = 0; i < availableCommands.length; ++i) {
        const availableCommand = availableCommands[i]
        await say(availableCommand)
        if (i + 2 === availableCommands.length) {
          await say('oraz') 
        } else {
          await wait(200)
        }
      }
      await say('Spróbuj jeszcze raz.')
    }

    return new Promise((resolve, reject) => {
      recognition.onaudiostart = () => {
        callbacks.started()
      }

      recognition.onerror = async (e) => {
        if (e.error === 'no-speech') {
          bounce()
          await say('Nie dosłyszałam. Sprawdź czy masz włączony mikrofon.')
          recognition.stop()
          recognition.start()
          return
        }
        callbacks.error(e)
        reject('error', e)
      }

      recognition.onresult = async (event) => {
        const hit = event.results[event.results.length - 1][0].transcript
        const confidence = event.results[0][0].confidence
        callbacks.result(hit, confidence)

        const command = commands.find(c => c.waitFor === hit)
        if (!command) {
          bounce()
          await say(`Nie rozpoznałam komendy.`)
          await listCommands()

          recognition.stop()
          recognition.start()
          return
        }

        recognition.stop()
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

const settings = {
  lang: 'pl-PL',
  pitch: 1,
  rate: 1
}

export default class extends Component {

  constructor () {
    super()
    this.state = {
      speech: speech(settings)
    }
  }

  async componentDidMount () {
    this.setState({pendingPayments: getPendingPayments()})
    await this.greet(await this.props.user)
    await this.next()
  }

  async greet (user) {
    const s = await this.state.speech
    await s.say(`witaj, ${user.name}`, {started: () => console.log('speaking'), finished: () => console.log('stopped speaking')})
    await s.say('w czym moge Ci pomóc?', {started: () => console.log('speaking'), finished: () => console.log('stopped speaking')}) 
  }

  async next () {
    const s = await this.state.speech
    const command = await s.waitForCommand([
      { waitFor: 'płatności', command: this.payments.bind(this) }
    ])
    await command()
  }

  listening = l => this.setState({opacity: l ? 1 : 0.7})

  // setPayment = () => {}
  setPayment = payment => this.setState({currentPayment: payment})
  // clearPayment = () => {}
  clearPayment = () => this.setState({currentPayment: undefined, showProgressIndicator: false, success: false})
  progress = () => this.setState({showProgressIndicator: true})
  success = () => this.setState({showProgressIndicator: false, success: true})

  async payments () {
    const getPaymentsString = number => {
      const map = ['jedną zaległą płatność', 'dwie zaległe płatności', 'trzy zaległe płatności',
        'cztery zaległe płatności', 'pięć zaległych płatności', 'sześć zaległych płatności', 'siedem zaległych płatności', 'osiem zaległych płatności', 'dziewięć zaległych płatności', 'dziesięć zaległych płatności']

      return map[number - 1]
    }

    const s = await this.state.speech
    const pendingPayments = await this.state.pendingPayments

    await s.say('Twoje płatności.')
    await s.say(`Masz ${getPaymentsString(pendingPayments.length)}. Chcesz się nimi teraz zająć?`)
    const listPayments = async (payments) => {
      let skipped = 0
      for(let i = 0; i < payments.length; ++i) {
        const payment = payments[i]
        this.setPayment(payment)
        await s.say(`${payment.name}. ${payment.amount}zł`)
        const command = await s.waitForCommand([
          {
            waitFor: 'zapłać',
            command: async () => {
              this.progress()
              await s.say(`opłacam. ${payment.name}`)
              await wait(800)
              await s.say('chwilka')
              await wait(800)
              this.success()
              await s.say('załatwione')
              await wait(500)
              this.clearPayment()
            }
          },
          {
            waitFor: 'dalej',
            command: async () => {
              skipped++
              await s.say(`pomijam. ${payment.name}`)
              this.clearPayment()
            }
          },
        ])
        await command()
      }
      await s.say(`Uregulowane płatności: ${payments.length - skipped}`)
      await s.say(`Płatności pominięte: ${skipped}`)
      await s.say(`To by było na tyle, ${this.props.user.name}`)
    }

    const command = await s.waitForCommand([{waitFor: 'tak', command: listPayments.bind(null, pendingPayments)}])
    await command()
  }

  render () {
    const hal = false
    const {opacity, currentPayment, showProgressIndicator, success} = this.state
    return <div className='Home'>
      <img src={assistentImage} className='assistentImage'/>
      {currentPayment && <div style={{position: 'absolute', top: '57%', right: '47%'}}>
        <Paper circle={true} style={{padding: '7%', position: 'relative'}}>
          {success && <p style={{color: cyan300, fontSize: '2.3em'}}>Załatwione!<br/></p>}
          {!success && <p>{currentPayment.name} <b>{currentPayment.amount.toFixed(2)}zł</b>{showProgressIndicator && <span className='progressIndicatorContainer'><Loading top={20}/></span>}</p>}
          <div className='triangle'/>
        </Paper>
      </div>}
      { hal && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png" style={{opacity}}/>}
    </div>
  }
}
