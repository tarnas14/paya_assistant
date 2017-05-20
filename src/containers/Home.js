import React, {Component} from 'react'

const speech = async (settings) => {
  const synthesis = window.speechSynthesis

  const voice = await new Promise(resolve => {
    synthesis.onvoiceschanged = () => resolve(
      synthesis.getVoices().find(v => v.lang === settings.lang)
    )
  })

  const say = async (text) => {
    const utt = new SpeechSynthesisUtterance(text)
    utt.pitch = settings.pitch
    utt.rate = settings.rate
    utt.voice = voice

    synthesis.speak(utt)

    return new Promise((resolve, reject) => {
      utt.onend = resolve
      utt.onerror = reject
    })
  }

  const speechRecognition = window.webkitSpeechRecognition
  const speechGrammarList = window.webkitSpeechGrammarList
  const speechRecognitionEvent = window.webkitSpeechRecognitionEvent

  const waitForCommand = async (commands, {started, finished, result, nomatch, error}) => {
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
    started()

    return new Promise((resolve, reject) => {
      recognition.onnomatch = e => {
        nomatch(e)
        reject('no match', e)
      }
      recognition.onerror = e => {
        error(e)
        reject('error', e)
      }
      recognition.onresult = (event) => {
        const hit = event.results[event.results.length - 1][0].transcript
        const confidence = event.results[0][0].confidence

        const {command} = commands.find(c => c.waitFor === hit)
        if (!command) {
          nomatch('not matching the grammar')
          reject('not matching the grammar')
          return
        }

        result(hit, confidence)
        command()
        resolve()
      }
      recognition.onspeechend = () => {
        finished()
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
      speech: speech(settings)
    }
  }

  async componentDidMount () {
    await this.greet(await this.props.user)
    this.next().catch(a => console.log(a))
  }

  async greet (user) {
    const s = await this.state.speech
    await s.say(`witaj, ${user.name}`)
    await s.say('w czym moge Ci pomóc?') 
  }

  async next () {
    const s = await this.state.speech
    await s.waitForCommand([
      { waitFor: 'płatności', command: this.payments }, 
      { waitFor: 'kurwa', command: () => console.log('woohoo') }
    ], {
      started: () => console.log('speak'),
      result: (r, c) => console.log('results', r, c),
      nomatch: e => console.log('nomatch', e),
      error: e => console.log('error', e),
      finished: () => console.log('not listening'),
    })
  }

  async payments () {
    console.log('płatności kurwa')
  }

  render () {
    return <div style={{paddingTop: '2em'}}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png"/></div>
  }
}
