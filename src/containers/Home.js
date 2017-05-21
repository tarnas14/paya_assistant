import React, {Component} from 'react'
import {getPendingPayments} from '../api'
import assistentImage from '../images/paya.png'
import './Home.css'
import Paper from 'material-ui/Paper'
import Loading from '../components/Loading'
import {cyan300} from 'material-ui/styles/colors'
import logo from '../images/logo.png'
import {CardText, CardTitle, CardHeader, Card} from 'material-ui/Card'
import LinearProgress from 'material-ui/LinearProgress'

const defaultCommand = process.env.REACT_APP_SKIP_COMMANDS ? 0 : -1
const speak = !Boolean(process.env.REACT_APP_SKIP_SPEECH)

const wait = async (delay = 100) => new Promise(resolve => {
  window.setTimeout(() => resolve(), delay)
})

const languagePacks = [
  {
    predicate: () => true,
    commands: {
    
    },
    lines: {
      availableCommands: () => 'Dostępne komendy to:',
      and: () => 'oraz',
      tryAgain: () => 'Spróbuj ponownie',
      greeting: name => `Witaj, ${name}`,
      howCanIHelpYou: () => 'W czym mogę Ci pomóc?',
      couldNotCatchThat: () => 'Nie dosłyszałam. Sprawdź czy masz włączony mikrofon.',
      unknownCommand: () => 'Nie rozpoznałam komendy.',
      howElseCanIHelpYou: () => 'W czym jeszcze mogę Ci pomóc?',
      ifYouReallyMustKnow: () => 'Jeśli już koniecznie chcesz wiedzieć.',
      noProblem: () => 'Nie ma za co ;)',
      yourPendingPayments: () => 'Twoje płatności.',
      youHavePayments: pending => `Masz ${pending}. Chcesz się nimi teraz zająć?`,
      paymentDescription: payment => `${payment.name}. ${payment.amount}zł`,
      paying: name => `Opłacam ${name}`,
      oneMoment: () => 'Chwilka',
      considerItDone: () => 'Załatwione',
      skipping: name => `Pomijam ${name}`,
      thatWasTheLastOne: () => 'To była ostatnia płatność na liście',
      paid: count => `Uregulowane płatności: ${count}`,
      skipped: count => `Płatności pominięte: ${count}`,
      thatsAll: name => `To by było na tyle, ${name}`
    }
  }
]

const nullStarted = {started: () => {}}

const speech = async (settings, setPack, speaking = () => {}, listening = () => {}, notListening = () => {}, debug = () => {}) => {
  const synthesis = window.speechSynthesis

  const voice = await new Promise(resolve => {
    synthesis.onvoiceschanged = () => resolve(
      synthesis.getVoices().map(v => {
        debug(`/${v.lang.trim()}/`)
        return v
      }).find(v => settings.langs.includes(v.lang)))
  })

  const languagePack = languagePacks.find(pack => pack.predicate(voice.lang))
  setPack(languagePack)
  const {lines, commands} = languagePack

  const utt = new SpeechSynthesisUtterance()
  utt.pitch = settings.pitch
  utt.rate = settings.rate
  utt.voice = voice
  debug('///')
  debug(JSON.stringify(utt.voice.lang))
  debug(JSON.stringify(utt.voice.default))
  debug(JSON.stringify(utt.voice.localService))
  debug(JSON.stringify(utt.voice.name))
  debug(JSON.stringify(utt.voice.voiceURI))
  debug('///')
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
        debug(`start of ${text}`)
        callbacks.started()
      }

      utt.onerror = (e) => {
        debug(JSON.stringify(e))
        callbacks.onerror()
        reject()
      }

      utt.onend = () => {
        debug(`end of ${text}`)
        callbacks.finished()
        resolve()
      }
      
      debug('<==>')
      synthesis.speak(utt)
      debug('<==>')
    })
  }

  const speechRecognition = window.webkitSpeechRecognition
  const speechGrammarList = window.webkitSpeechGrammarList
  const speechRecognitionEvent = window.webkitSpeechRecognitionEvent

  const waitForCommand = async (commands, cbs) => {
    const callbacks = {
      started: () => listening(),// || console.log('waiting for command'),
      finished: () => notListening(),//console.log('stopped waiting'),
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

    return new Promise((resolve, reject) => {
      recognition.onaudiostart = () => {
        callbacks.started()
      }

      recognition.onerror = async (e) => {
        if (e.error === 'no-speech') {
          bounce()
          await say(lines.couldNotCatchThat())
          recognition.stop()
          recognition.start()
          return
        }
        callbacks.error(e)
        callbacks.finished()
        reject('error', e)
      }

      recognition.onresult = async (event) => {
        const hit = event.results[event.results.length - 1][0].transcript
        const confidence = event.results[0][0].confidence
        callbacks.result(hit, confidence)

        const command = commands.find(c => c.waitFor.toLowerCase() === hit.toLowerCase())
        if (!command) {
          bounce()
          await say(lines.unknownCommand())
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

const settings = {
  lang: 'pl-PL',
  langs: ['pl-PL', 'pl_PL', 'en_GB'],
  pitch: 1,
  rate: 1
}

export default class extends Component {

  constructor () {
    super()
    this.state = {
      debug: [],
      langPack: {lines: {}, commands: {}},
      speech: speech(
        settings,
        langPack => console.log(langPack) || this.setState({langPack}),
        text => this.setState({speaking: text}),
        () => this.setState({listening: true}),
        () => this.setState({listening: false}),
        // a => this.setState(s => ({debug: [a, ...s.debug]}))
      )
    }
  }

  async componentDidMount () {
    this.setState({pendingPayments: getPendingPayments()})
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
    const {langPack: {lines}} = this.state
    while(true) {
      const command = await s.waitForCommand([
        { waitFor: 'płatności', command: this.payments.bind(this) },
        { waitFor: 'jaki jest sens życia', command: this.meaningOfLife.bind(this)}
      ])
      await command()
      await s.say(lines.howElseCanIHelpYou())
    }
  }

  async meaningOfLife () {
    const s = await this.state.speech
    const {langPack: {lines}} = this.state
    await s.say(lines.ifYouReallyMustKnow())
    await s.say('42')
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
    const {langPack: {lines}} = this.state
    const getPaymentsString = number => {
      const map = ['jedną zaległą płatność', 'dwie zaległe płatności', 'trzy zaległe płatności',
        'cztery zaległe płatności', 'pięć zaległych płatności', 'sześć zaległych płatności', 'siedem zaległych płatności', 'osiem zaległych płatności', 'dziewięć zaległych płatności', 'dziesięć zaległych płatności']

      return map[number - 1]
    }

    const s = await this.state.speech
    const pendingPayments = await this.state.pendingPayments

    await s.say(lines.yourPendingPayments())
    await s.say(lines.youHavePayments(getPaymentsString(pendingPayments.length)))
    const listPayments = async (payments) => {
      let skipped = 0
      for(let i = 0; i < payments.length; ++i) {
        const payment = payments[i]
        this.setPayment(payment)
        await s.say(lines.paymentDescription(payment))
        const command = await s.waitForCommand([
          {
            waitFor: 'zapłać',
            command: async () => {
              this.progress()
              await s.say(lines.paying(payment.name))
              await wait(800)
              await s.say(lines.oneMoment())
              await wait(800)
              this.success()
              await s.say(lines.considerItDone())
              await wait(800)
              this.clearPayment()
            }
          },
          {
            waitFor: 'dalej',
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
      await s.say(lines.paid(payments.length - skipped))
      await s.say(lines.skipped(skipped))
      await s.say(lines.thatsAll(this.props.user.name))
    }

    const command = await s.waitForCommand([{waitFor: 'tak', command: listPayments.bind(null, pendingPayments)}])
    await command()
  }

  render () {
    const hal = process.env.REACT_APP_HAL
    const assistent = hal ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png' : assistentImage
    const {debug, opacity, listening, currentPayment, showProgressIndicator, success, speaking} = this.state
    return <div className='Home' style={{backgroundImage: `url(${assistent})`}}>
      <Card>
        {!currentPayment && speaking && <CardTitle title={speaking}/>}
        {currentPayment && <CardTitle
          subtitle={currentPayment.name}
          title={`${currentPayment.amount}zł`}
        />}
        {currentPayment && showProgressIndicator && <CardText><Loading top={-15}/></CardText>}
        {currentPayment && success && <CardText><span style={{color: cyan300, fontSize: '2em'}}>Załatwione!</span></CardText>}
      </Card>
      {listening && <LinearProgress mode="indeterminate"/>}
      {debug && <div>{debug.map(d => <p>{d}</p>)}</div>}
    </div>
  }
}
