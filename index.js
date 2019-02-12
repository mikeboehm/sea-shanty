'use strict'
const SeaShanty = require('./src/SeaShanty')
console.log('starting js app')
let MPV = require('node-mpv')
const feeds = require('./etc/feeds')
const getLatestPodcasts = require('./src/getLatestPodcasts')
const express = require('express')
const app = express()
const port = 3000
const Timer = require('./src/Timer')

const TIMER_MINUTES = 20
const TIMER_MS = TIMER_MINUTES * 60 * 1000

const mpvPlayer = new MPV({
  'audio_only': true
  // 'ipc_command': '--input-ipc-server',
  // "verbose": true,
})
mpvPlayer.volume(30)

let phatbeat = require('phatbeat')

const boot = async () => {
  const playlist = await getLatestPodcasts(feeds)
  const playTimer = new Timer(TIMER_MS)
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

  app.listen(port, () => console.log(`Sea Shanty app listening on port ${port}!`))
}

boot()
