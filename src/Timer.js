'use strict'

const moment = require('moment')

const { EventEmitter } = require('events')

class Timer extends EventEmitter {
  constructor (duration) {
    super()
    this.duration = duration
    this.timeoutId = null
    this.intervalId = null
  }

  start () {
    let startedAt = moment()
    this.emit('started', {
      startedAt,
      duration: this.duration
    })

    this.timeoutId = setTimeout(() => {
      this.emit('time-up', {})
    }, this.duration)

    let count = 1
    this.intervalId = setInterval(() => {
      this.emit('tick', {
        startedAt,
        duration: this.duration,
        count
      })
      count++
    }, this.duration / 200)
  }

  stop () {
    if (this.timeoutId) clearTimeout(this.timeoutId)
    this.timeoutId = null

    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null

    this.emit('stopped', {})
  }
}

module.exports = Timer
