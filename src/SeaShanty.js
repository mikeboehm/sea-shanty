'use strict'
const moment = require('moment')
const STREAM_URL = 'http://9bs.svexican.me/'

const playlist = `
#EXTM3U
#EXTINF:0,9BeetStretch
http://9bs.svexican.me/
#EXTINF:0,9BeetStretch
http://9bs.svexican.me/
`

const TIMER_MS = 1800000
const VOLUME_INCREMENT = 2

class SeaShanty{
  constructor({mpvPlayer, phatbeat}) {
    this.volume = 30
    this.timeoutId = undefined
    this.mpvPlayer = mpvPlayer
    this.phatbeat = phatbeat
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
    
    this.mpvPlayer.append('http://9bs.svexican.me/')

    // this.mpvPlayer.pause()
    // this.mpvPlayer.play()
    this.loadHandlers()

    this.log('READY!')
  }


  togglePause() {
    this.log("PLAY/PAUSE")
    this.isPlaying() ? this.pause() : this.play()
  }

  play() {
    this.log('PLAY ' + this.filename)
    this.timeoutId = setTimeout(function () {
      this.pause()
    }.bind(this), TIMER_MS)
    this.mpvPlayer.play()
  }

  pause() {
    this.log('PAUSE')
    clearTimeout(this.timeoutId)
    this.mpvPlayer.pause()
  }

  _logIfDifferent(key, value) {
    const existingValue = this.mpvState[key]
    const paddingValue = '              '
    if(existingValue !== value) this.log(`${String(key + paddingValue).slice(0, paddingValue.length)} from: ${existingValue} to: ${value}`)
  }

  _filterEvents(status, excludes = []) {
    return Object.keys(status).filter((key) => {
      return !excludes.includes(key)
    })
  }


  loadHandlers() {
       this.mpvPlayer.on('statuschange', function(status){
        status = {...status}
        // this.log('MPV STATUSCHANGE', new Date(), status);
  
        this._filterEvents(status, ['duration'])
        .forEach((key) => this._logIfDifferent(key, status[key]))
        
        // const diff = this._diffObject(this.mpvState, status)
        // this.log('STATUS DIFF')
        // this.log(JSON.stringify(diff, null, 2))

        this.mpvState = status
      }.bind(this));
      
      // This occurs when it runs out of music
      // Presumably this doesn't happen when 
      this.mpvPlayer.on('stopped', function() {
        this.log("STOPPED");
      }.bind(this));
  
      this.playPauseStream = this.phatbeat.buttonStream(31).on("pinChange", function(pin, pinState){
        if(pinState === 1) {
          this.togglePause()
        }
      }.bind(this))
  
      // this.volumeUpStream = phatbeat.buttonStream(36);
      // this.volumeUpStream.on("pinChange", function(pin, pinState){    
        this.phatbeat.buttonStream(36).on("pinChange", function(pin, pinState){
        if(pinState === 1) {
          this.volumeUp()
        }
      }.bind(this))
  
      this.phatbeat.buttonStream(37).on("pinChange", function(pin, pinState){
        if(pinState === 1) {
          this.volumeDown()
        }
      }.bind(this))
  }


  log(string) {
    const now = moment().format('H:M:ss')
    console.log(now, string)
  }
  
  get filename() {
    return this.mpvState.filename
  }

  prev() {
    this.log('PREV')
    this.mpvPlayer.prev()
  }

  next() {
    this.log('NEXT')
    this.mpvPlayer.next()
  }

  volumeUp() {
    const newVolume = this.getVolume() + VOLUME_INCREMENT
    this.log(`VOLUME UP  : ${newVolume}`)
    this.setVolume(newVolume)
  }

  volumeDown() {
    const newVolume = this.getVolume() - VOLUME_INCREMENT
    this.log(`VOLUME DOWN: ${newVolume}`)
    this.setVolume(newVolume)
  }

  isPlaying() {
    return this.mpvState.pause === false
  }

  setVolume(volume) {
    volume = (volume < 0) ? 0 : volume
    volume = (volume > 100) ? 100 : volume
    
    this.volume = volume
    this.mpvPlayer.volume(this.volume)
  }

  getVolume() {
    return this.volume
  }

  _diffObject(oldObj, newObj) {
    return Object.keys(oldObj)
      .map(key => newObj[key] == oldObj[key] ? false : key)
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