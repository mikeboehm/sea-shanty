'use strict'

const Playlist = require('./src/Playlist')
const SeaShanty = require('./src/SeaShanty')
const Timer = require('./src/Timer')
const MPV = require('node-mpv')
const feeds = require('./etc/feeds')
const logger = require('./src/Logger')

logger.info('starting js app')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const { express: { port } } = require('config')

let phatbeat = require('phatbeat')

const boot = async () => {
  const mpvPlayer = new MPV({
    'audio_only': true,
    'debug': false
    // 'ipc_command': '--input-ipc-server',
    // "verbose": true,
  })
  mpvPlayer.volume(25)

  const playlist = new Playlist(feeds)
  const playTimer = new Timer()
  const ss = new SeaShanty({ phatbeat, mpvPlayer, playlist, playTimer })

  process.on('SIGINT', (value) => {
    logger.error('SIGINT DETECTED')
    ss.quit()
    process.exit()
  })

  app.get('/', (req, res) => {
    logger.info('/ (root)')
    res.json(ss.currentEpisode)
  })
  
  app.post('/playpause', (req, res) => {
    logger.info('API: play/pause')
    ss.togglePause()
    res.send(ss.playlist.currentEpisode)
  })

  app.post('/volup', (req, res) => {
    logger.info('API: volume up')
    ss.volumeUp()
    res.send(ss.mpvState)
  })

  app.post('/voldown', (req, res) => {
    logger.info('API: volume down')
    ss.volumeDown()
    res.send(ss.mpvState)
  })

  app.post('/next', (req, res) => {
    logger.info('API: next')
    ss.next()
    res.send(ss.playlist.currentEpisode)
  })

  app.post('/prev', (req, res) => {
    logger.info('API: prev')
    ss.prev()
    res.send(ss.playlist.currentEpisode)
  })

  app.post('/power', (req, res) => {
    logger.info('API: power')
    ss.power()
    res.send(ss.mpvState)
  })

  app.post('/leds', (req, res) => {
    logger.info(req.body)
    const response = ss.ledsApi(req.body)
    res.send(response)
  })

  app.get('/playlist', (req, res) => {
    logger.info('/playlist')
    const { podcastName, title } = ss.playlist.currentEpisode

    const index = ss.playlist.currentPosition

    const listItems = ss.playlist.episodes.slice(index + 1)
      .map(item => `<li>${item.published.slice(0, 10)} - ${item.podcastName} - ${item.title}</li>`)
      .join('')

    const response = `<h1>Currently: ${podcastName} - ${title}</h1><ul>${listItems}</ul>`
    res.send(response)
  })

  app.listen(port, () => logger.info(`Sea Shanty app listening on port ${port}!`))
}

boot()
