'use strict'

const moment = require('moment')

const { EventEmitter } = require('events')

class Timer extends EventEmitter {
  constructor () {
    super()
    this.timeoutId = null
    this.intervalId = null
  }

  start (duration) {
    let startedAt = moment()
    this.emit('started', {
      startedAt,
      duration
    })

    this.timeoutId = setTimeout(() => {
      this.emit('time-up', {})
    }, duration)

    let count = 1
    this.intervalId = setInterval(() => {
      this.emit('tick', {
        startedAt,
        duration: duration,
        count
      })
      count++
    }, duration / 200)
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
