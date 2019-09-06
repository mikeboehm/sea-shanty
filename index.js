'use strict'
console.log('starting js app')
const SeaShanty = require('./src/SeaShanty')
const Timer = require('./src/Timer')
const MPV = require('node-mpv')
const feeds = require('./etc/feeds')
const getLatestPodcasts = require('./src/getLatestPodcasts')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const port = 3000

let phatbeat = require('phatbeat')

const boot = async () => {
  const mpvPlayer = new MPV({
    'audio_only': true
    // 'ipc_command': '--input-ipc-server',
    // "verbose": true,
  })
  mpvPlayer.volume(30)
  const playlist = await getLatestPodcasts(feeds)
  const playTimer = new Timer()
  const ss = new SeaShanty({ phatbeat, mpvPlayer, playlist, playTimer })

  app.get('/', (req, res) => res.json(ss.mpvState))
  app.post('/playpause', (req, res) => {
    console.log('API: play/pause')
    ss.togglePause()
    res.send(ss.mpvState)
  })

  app.post('/volup', (req, res) => {
    console.log('API: volume up')
    ss.volumeUp()
    res.send(ss.mpvState)
  })

  app.post('/voldown', (req, res) => {
    console.log('API: volume down')
    ss.volumeDown()
    res.send(ss.mpvState)
  })

  app.post('/next', (req, res) => {
    console.log('API: next')
    ss.next()
    res.send(ss.mpvState)
  })

  app.post('/prev', (req, res) => {
    console.log('API: prev')
    ss.prev()
    res.send(ss.mpvState)
  })

  app.post('/power', (req, res) => {
    console.log('API: power')
    ss.power()
    res.send(ss.mpvState)
  })

  app.post('/leds', (req, res) => {
    console.log(req.body)
    const response = ss.ledsApi(req.body)
    res.send(response)
  })

  app.get('/playlist', (req, res) => {
    const listItems = ss.playlist
      .map(item => `<li>${item.published.slice(0,10)} - ${item.podcastName}</li>`)

    const response = `<ul>${listItems.join('')}</ul>`
    res.send(response)
  })

  app.listen(port, () => console.log(`Sea Shanty app listening on port ${port}!`))
}

boot()
