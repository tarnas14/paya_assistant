import React, {Component} from 'react'
import {getPendingPayments} from '../api'

const defaultCommand = 0
const speak = false

const speech = async (settings) => {
  const synthesis = window.speechSynthesis

  const voice = await new Promise(resolve => {
    synthesis.onvoiceschanged = () => resolve(
      synthesis.getVoices().find(v => v.lang === settings.lang)
    )
  })

  const say = async (text, c) => {
    const callbacks = {
      started: () => console.log('speaking'),
      finished: () => console.log('stopped speaking'),
      ...c
    }
    if (!speak) {
      console.log('speaking', text)
      callbacks.finished()
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const utt = new SpeechSynthesisUtterance(text)
      utt.pitch = settings.pitch
      utt.rate = settings.rate
      utt.voice = voice
      utt.onstart = callbacks.started
      utt.onend = callbacks.finished

      synthesis.speak(utt)

      utt.onend = () => {
        callbacks.finished()
        resolve()
      }
      utt.onerror = reject
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
    if (defaultCommand !== -1) {
      console.log('waiting for commands', commands)
      console.log('choosing', commands[defaultCommand])
      callbacks.finished()
      commands[defaultCommand].command()
      return Promise.resolve()
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

    recognition.start()
    callbacks.started()

    return new Promise((resolve, reject) => {
      recognition.onnomatch = e => {
        callbacks.nomatch(e)
        reject('no match', e)
      }
      recognition.onerror = e => {
        callbacks.error(e)
        reject('error', e)
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
        command.command()
        resolve()
      }

      recognition.onspeechend = () => {
        callbacks.finished()
        recognition.stop()
      }
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
    await s.waitForCommand([
      { waitFor: 'płatności', command: () => this.payments() }, 
      { waitFor: 'kurwa', command: () => console.log('woohoo') }
    ], {
      started: () => console.log('listening'),
      result: (r, c) => console.log('results', r, c),
      nomatch: e => console.log('nomatch', e),
      error: e => console.log('error', e),
      finished: () => console.log('finished listening'),
    })
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

    await s.say('Twoje płatności.')
    await s.say(`Masz ${getPaymentsString(pendingPayments.length)}`)
    await s.say('czy chcesz się nimi teraz zająć?')
    await s.waitForCommand([{waitFor: 'tak', command: () => this.listPayments(pendingPayments)}])
  }

  async listPayments (pendingPayments) {
    const s = await this.state.speech

    for(let i = 0; i < pendingPayments.length; ++i) {
      const payment = pendingPayments[i]
      await s.say(payment.name)
      await s.say(`${payment.amount}zł`)
      await s.waitForCommand([
        {
          waitFor: 'dalej',
          command: () => console.log('skipping', payment)
        },
        {
          waitFor: 'zapłać',
          command: () => console.log('płacimy', payment)
        },
      ])
    }
  }

  render () {
    const {opacity} = this.state
    return <div style={{paddingTop: '2em'}}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png" style={{opacity}}/>
    </div>
  }
}
