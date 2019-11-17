const { EventEmitter } = require('events')
const logger = require('./Logger')
const fetchFeed = require('../src/feed/getLatestPodcasts')

const TWENTYFOUR_HOURS = 24 * 60 * 60 * 1000
const FORTYEIGHT_HOURS = 48 * 60 * 60 * 1000

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

class Feed extends EventEmitter {
  constructor (podcast) {
    super()

    this.podcast = podcast

    // Delay initial fetch
    setTimeout(() => {
      this.refresh()
    }, getRandomInt(10, 1000))

    this.startTimer()
  }

  get name () {
    return this.podcast.name
  }

  startTimer () {
    const duration = getRandomInt(TWENTYFOUR_HOURS, FORTYEIGHT_HOURS)
    logger.info(`${this.name} will be updated every ${Math.round(duration / 1000 / 60 / 60)} hours`)
    setInterval(() => {
      this.refresh()
    }, duration)
  }

  refresh () {
    logger.debug(`Updating: ${this.name}`)
    fetchFeed(this.podcast).then(episodes => {
      this.emit('updated', episodes)
    })
  }

  async episodes () {
    return fetchFeed(this.podcast)
  }
}

module.exports = Feed
