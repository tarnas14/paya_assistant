import languagePacks from './languagePacks'
import {speak, defaultCommand} from './environment'
import {wait} from './utils'

export default async (settings, setPack, speaking = () => {}, listening = () => {}, notListening = () => {}, debug = () => {}) => {
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
  const {lines} = languagePack

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
