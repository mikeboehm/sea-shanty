'use strict'
const moment = require('moment')
// const STREAM_URL = 'http://9bs.svexican.me/'

// const playlist = `
// #EXTM3U
// #EXTINF:0,9BeetStretch
// http://9bs.svexican.me/
// #EXTINF:0,9BeetStretch
// http://9bs.svexican.me/
// `

// const TIMER_MINUTES = 0.5
const TIMER_MINUTES = 20
const TIMER_MS = TIMER_MINUTES * 60 * 1000
const VOLUME_INCREMENT = 2

class SeaShanty {
  constructor ({ mpvPlayer, phatbeat, playlist }) {
    this.volume = 30
    this.timeoutId = undefined
    this.mpvPlayer = mpvPlayer
    this.phatbeat = phatbeat
    this.playlist = playlist
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
    const red = 255
    const green = 0
    const blue = 0
    const redraw = true
    const brightness = 0.1
    this.phatbeat.changeAllLEDs(red, green, blue, redraw, brightness)

    this.loadHandlers()

    this.log('READY!')
  }

  togglePause () {
    this.log('PLAY/PAUSE')
    this.isPlaying() ? this.pause() : this.play()
  }

  play () {
    this.log('PLAY ' + this.filename)
    // this.timeoutId = setTimeout(() => {
    //   this.log('TIMES UP! PAUSING')
    //   this.pause()
    // }, TIMER_MS)

    this._startTimer(
      [
        this.pause.bind(this),
        this.phatbeat.turnOffAllLEDs.bind(this.phatbeat),
        this.phatbeat.redraw.bind(this.phatbeat)
      ],
      this.phatbeat.changeAllLEDs.bind(this.phatbeat)
    )

    // This is supposed to load the next song if it ran out of things to play
    if (this.mpvState['playlist-pos'] === null) {
      this._playNext()
    } else {
      this.mpvPlayer.play()
    }
  }

  pause () {
    this.log('PAUSE')
    clearTimeout(this.timeoutId)
    this.mpvPlayer.pause()
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
    this.mpvPlayer.on('statuschange', function (status) {
      status = { ...status }
      // this.log('MPV STATUSCHANGE', new Date(), status);

      this._filterEvents(status, ['duration'])
        .forEach((key) => this._logIfDifferent(key, status[key]))

      // const diff = this._diffObject(this.mpvState, status)
      // this.log('STATUS DIFF')
      // this.log(JSON.stringify(diff, null, 2))

      this.mpvState = status
    }.bind(this))

    // This occurs when it runs out of music
    // Presumably this doesn't happen when
    this.mpvPlayer.on('stopped', function () {
      this.log('STOPPED')
    }.bind(this))

    this.playPauseStream = this.phatbeat.buttonStream(31).on('pinChange', function (pin, pinState) {
      if (pinState === 1) {
        this.togglePause()
      }
    }.bind(this))

    this.phatbeat.buttonStream(36).on('pinChange', function (pin, pinState) {
      if (pinState === 1) {
        this.volumeUp()
      }
    }.bind(this))

    this.phatbeat.buttonStream(37).on('pinChange', function (pin, pinState) {
      if (pinState === 1) {
        this.volumeDown()
      }
    }.bind(this))

    // Power button
    this.phatbeat.buttonStream(32).on('pinChange', function (pin, pinState) {
      if (pinState === 1) {
        // this.phatbeat.init_led(0.8)

        // const red = Math.floor(Math.random() * 256)
        // const green = Math.floor(Math.random() * 256)
        // const blue = Math.floor(Math.random() * 256)
        // // const channel = Math.floor(Math.random() * 2)
        // const redraw = true
        // const changeBrightness = 0.8
        // console.error(red, green, blue)
        // this.phatbeat.changeAllLEDs(red, green, blue, redraw, changeBrightness)

        // this.cycleLeds()
      }
    })
  }

  // cycleLeds () {
  //   // let maxLoops = 5
  //   // let currentLoop = 0
  //   // must be between 0.1 and 1.0
  //   // let brightness = 1.0
  //   // let delay = 100

  //   this.phatbeat.init_led()
  //   this._setLEDColourRecursive(15)
  // }

  // _setLEDColourRecursive (ledInt, delay) {
  //   this.phatbeat.changeSingleLED(ledInt, ledInt % 2 === 0 ? 255 : 0, 0, ledInt % 2 > 0 ? 255 : 0, brightness, true)
  //   setTimeout(function () {
  //     this.phatbeat.turnOffAllLEDs(true)
  //     let newLed
  //     if (ledInt === 0 || ledInt === 15) {
  //       currentLoop++
  //     }
  //     if (currentLoop <= maxLoops) {
  //       newLed = currentLoop % 2 === 0 ? ++ledInt : --ledInt

  //       this._setLEDColourRecursive(newLed, delay)
  //     } else {
  //       this.phatbeat.teardown(false)
  //     }
  //   }, delay)
  // }

  log (...args) {
    const now = moment().format('H:M:ss')
    console.log(now, ...args)
  }

  get filename () {
    return this.mpvState.filename
  }

  prev () {
    this.log('PREV')
    this.mpvPlayer.prev()
  }

  _playNext () {
    const url = this.playlist.shift().url
    console.error('url', url)
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

  _startTimer (timeoutCallbacks = [], setLeds) {
    let startedAt = null
    let brightness = 1
    const red = 255
    const green = 0
    const blue = 0
    const redraw = true

    setLeds(red, green, blue, redraw, brightness)

    // const duration = 5 * 1000
    const duration = TIMER_MS

    setTimeout(() => {
      console.error('timeout finished')
      startedAt = false
      timeoutCallbacks.forEach(callback => {
        callback()
      })
    }, duration)

    startedAt = moment()

    setInterval(() => {
      if (startedAt) {
        const diff = moment().diff(startedAt)
        const brightness = ((duration - diff) / duration * 1).toFixed(2)

        if (brightness >= 0.1) {
          setLeds(red, green, blue, redraw, brightness)
          console.error(brightness)
        }
      }
    }, duration / 200)
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
