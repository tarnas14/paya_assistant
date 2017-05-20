import React, {Component} from 'react'
import {getPendingPayments} from '../api'

const defaultCommand = -1
const speak = true

const wait = async (delay) => new Promise(resolve => {
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
      finished: () => console.log('stopped speaking', text),
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
      started: () => console.log('waiting for command'),
      finished: () => console.log('stopped waiting'),
      result: (h, c) => console.log(h, c),
      nomatch: (e) => console.log('no match', e),
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
    // doesnt work, for some reason
    addCommandsGrammar(recognition, commands)
    recognition.lang = settings.lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    return new Promise((resolve, reject) => {
      recognition.onaudiostart = () => {
        callbacks.started()
      }
      recognition.onnomatch = e => {
        callbacks.nomatch(e)
        reject('no match', e)
      }
      recognition.onerror = e => {
        callbacks.error(e)
        reject('error', e)
      }
      recognition.onspeechend = () => {
        callbacks.finished()
        recognition.stop()
      }
      recognition.onresult = (event) => {
        const hit = event.results[event.results.length - 1][0].transcript
        const confidence = event.results[0][0].confidence

        const command = commands.find(c => c.waitFor === hit)
        if (!command) {
          callbacks.nomatch('not matching the grammar')
          reject('not matching the grammar')
          return
        }

        callbacks.result(hit, confidence)
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
      speech: speech(settings),
      opacity: 0.7,
    }
  }

  async componentDidMount () {
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
    ], {
      started: () => console.log('listening'),
      result: (r, c) => console.log('results', r, c),
      nomatch: e => console.log('nomatch', e),
      error: e => console.log('error', e),
      finished: () => console.log('finished listening'),
    })
    await command()
  }

  listening = l => this.setState({opacity: l ? 1 : 0.7})

  async payments () {
    const getPaymentsString = number => {
      const map = ['jedną zaległą płatność', 'dwie zaległe płatności', 'trzy zaległe płatności',
        'cztery zaległe płatności', 'pięć zaległych płatności', 'sześć zaległych płatności', 'siedem zaległych płatności', 'osiem zaległych płatności', 'dziewięć zaległych płatności', 'dziesięć zaległych płatności']

      return map[number - 1]
    }

    const s = await this.state.speech
    const pendingPayments = await getPendingPayments()

    await s.say(`Twoje płatności. Masz ${getPaymentsString(pendingPayments.length)}. Chcesz się nimi teraz zająć?`)
    const listPayments = async (payments) => {
      let skipped = 0
      for(let i = 0; i < payments.length; ++i) {
        const payment = payments[i]
        await s.say(`${payment.name}, ${payment.amount}zł`)
        const command = await s.waitForCommand([
          {
            waitFor: 'zapłać',
            command: async () => {
              await s.say(`opłacam. ${payment.name}`)
              await wait(800)
              await s.say(`chwilka. ${payment.name}`)
              await wait(800)
              await s.say('załatwione')
            }
          },
          {
            waitFor: 'dalej',
            command: async () => {
              skipped++
              await s.say(`pomijam. ${payment.name}`)
            }
          },
        ])
        await command()
      }
      await s.say(`Uregulowane płatności: ${payments.length - skipped}`)
      await s.say(`Płatności pominięte: ${skipped}`)
      await s.say('To by było na tyle')
    }

    const command = await s.waitForCommand([{waitFor: 'tak', command: listPayments.bind(null, pendingPayments)}])
    await command()
  }

  render () {
    const {opacity} = this.state
    return <div style={{paddingTop: '2em'}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png" style={{opacity}}/>
    </div>
  }
}
