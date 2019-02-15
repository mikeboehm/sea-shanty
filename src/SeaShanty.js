'use strict'
const moment = require('moment')

// const TIMER_MINUTES = 0.5
const TIMER_MINUTES = 20
const TIMER_MS = TIMER_MINUTES * 60 * 1000
const VOLUME_INCREMENT = 2

class SeaShanty {
  constructor ({ mpvPlayer, phatbeat, playlist, playTimer }) {
    this.volume = 30
    this.timeoutId = undefined
    this.mpvPlayer = mpvPlayer
    this.phatbeat = phatbeat
    this.playlist = playlist
    this.playTimer = playTimer
    this.mpvState = {
      mute: false,
      pause: null,
      duration: null,
      volume: null,
      filename: null,
      path: null,
      'media-title': null,
      'playlist-pos': null,
      'playlist-count': null,
      loop: null
    }

    this.setVolume(this.volume)

    // the init_led function sets up the appropriate GPIO pins
    // optional parameter of brightness of leds, this is a decimal between 0.1 and 1.0
    this.phatbeat.init_led(0.1)
    this.phatbeat.turnOffAllLEDs(true)

    this.loadHandlers()

    this.log('READY!')
  }

  togglePause () {
    this.log('PLAY/PAUSE')
    this.isPlaying() ? this.pause() : this.play()
  }

  play () {
    this.log('PLAY ' + this.filename)

    this.playTimer.start(TIMER_MS)

    // This is supposed to load the next song if it ran out of things to play
    if (this.mpvState['playlist-pos'] === null) {
      this._playNext()
    } else {
      this.mpvPlayer.play()
    }
  }

  pause () {
    this.log('PAUSE')

    // Clear timers
    clearTimeout(this.timeoutId)
    this.timeoutId = false
    clearInterval(this.intervalId)
    this.intervalId = false

    this.mpvPlayer.pause()
    this.playTimer.stop()
  }

  _logIfDifferent (key, value) {
    const existingValue = this.mpvState[key]
    const paddingValue = '              '
    if (typeof existingValue !== 'undefined' && existingValue !== value) {
      this.log(`${String(key + paddingValue).slice(0, paddingValue.length)} from: ${existingValue} to: ${value}`)
    }
  }

  _filterEvents (status, excludes = []) {
    return Object.keys(status).filter((key) => {
      return !excludes.includes(key)
    })
  }

  loadHandlers () {
    this.mpvPlayer.on('statuschange', status => {
      status = { ...status }
      // this.log('MPV STATUSCHANGE', new Date(), status);

      this._filterEvents(status, ['duration'])
        .forEach((key) => this._logIfDifferent(key, status[key]))

      this.mpvState = status
    })

    // This occurs when it runs out of music
    // Presumably this doesn't happen when
    this.mpvPlayer.on('stopped', () => {
      this.log('STOPPED')
    })

    this.playTimer.on('time-up', () => {
      this.pause()
      this.phatbeat.turnOffAllLEDs(true)
    })

    this.playTimer.on('stopped', () => {
      this.phatbeat.turnOffAllLEDs(true)
    })

    this.playTimer.on('started', () => {
      let brightness = 1
      const red = 255
      const green = 0
      const blue = 0
      const redraw = true
      const ledIndex = 0

      this.phatbeat.changeSingleLED(ledIndex, red, green, blue, redraw, brightness)
    })

    const setup = [
      {
        name: 'Toggle Pause',
        pin: 31,
        handler: this.togglePause.bind(this)
      },
      {
        name: 'Volume Up',
        pin: 36,
        handler: this.volumeUp.bind(this)
      },
      {
        name: 'Volume Down',
        pin: 37,
        handler: this.volumeDown.bind(this)
      },
      {
        name: 'Fast Forward',
        pin: 29,
        handler: this.next.bind(this)
      },
      {
        name: 'Rewind',
        pin: 33,
        handler: this.prev.bind(this)
      },
      {
        name: 'Power',
        pin: 32,
        handler: this.power.bind(this)
      }
    ]

    setup.forEach(buttonStreamConfig => {
      const { pin, handler } = buttonStreamConfig
      this.phatbeat.buttonStream(pin).on('pinChange', (pin, pinState) => {
        if (pinState === 1) {
          handler()
        }
      })
    })
  }

  log (...args) {
    const now = moment().format('H:M:ss')
    console.log(now, ...args)
  }

  get filename () {
    return this.mpvState.filename
  }

  power () {
    this.log('POWER BUTTON')
  }

  prev () {
    this.log('PREV')
    this.mpvPlayer.prev()
  }

  _playNext () {
    const url = this.playlist.shift().url
    this.mpvPlayer.load(url)
  }

  next () {
    this.log('NEXT')
    this._playNext()
  }

  volumeUp () {
    const newVolume = this.getVolume() + VOLUME_INCREMENT
    this.log(`VOLUME UP  : ${newVolume}`)
    this.setVolume(newVolume)
  }

  volumeDown () {
    const newVolume = this.getVolume() - VOLUME_INCREMENT
    this.log(`VOLUME DOWN: ${newVolume}`)
    this.setVolume(newVolume)
  }

  isPlaying () {
    if (this.mpvState.pause === null) {
      return false
    }

    return this.mpvState.pause === false
  }

  setVolume (volume) {
    volume = (volume < 0) ? 0 : volume
    volume = (volume > 100) ? 100 : volume

    this.volume = volume
    this.mpvPlayer.volume(this.volume)
  }

  getVolume () {
    return this.volume
  }

  _diffObject (oldObj, newObj) {
    return Object.keys(oldObj)
      .map(key => newObj[key] === oldObj[key] ? false : key)
      .filter(Boolean)
      .reduce((accumulator, key) => {
        accumulator[key] = {
          from: oldObj[key],
          to: newObj[key]
        }

        return accumulator
      }, {})
  }
}

module.exports = SeaShanty

// Play/Pause
// Volume
// Timer
