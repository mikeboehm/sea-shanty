'use strict'
console.log('starting js app')
const Playlist = require('./src/Playlist')
const SeaShanty = require('./src/SeaShanty')
const Timer = require('./src/Timer')
const MPV = require('node-mpv')
const feeds = require('./etc/feeds')
const getLatestPodcasts = require('./src/feed/getLatestPodcasts')

const moment = require('moment')
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
  // const newEpisodes = await getLatestPodcasts(feeds)
  const playlist = new Playlist()
  // playlist.update(newEpisodes)
  const playTimer = new Timer()
  const ss = new SeaShanty({ phatbeat, mpvPlayer, playlist, playTimer })

  const UPDATE_HOUR = 18 // 18:00
  const feedUpdateTimer = new Timer()

  feedUpdateTimer.start(0)

  feedUpdateTimer.on('time-up', () => {
    console.error('UPDATING FEEDS')
    getLatestPodcasts(feeds).then(newEpisodes => {
      console.error('PALYLIST LENGTH: ', newEpisodes.length)
      playlist.update(newEpisodes)
      const updateAt = moment()
        .add(14, 'days')
        .hour(UPDATE_HOUR)        
      
      feedUpdateTimer.start(updateAt.diff(moment()))
    })    
  })

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
    const {podcastName, title} = ss.playlist.currentEpisode

    const listItems = ss.playlist.episodes
      .map(item => `<li>${item.published.slice(0, 10)} - ${item.podcastName} - ${item.title}</li>`)
      .join('')

    const response = `<h1>Currently: ${podcastName} - ${title}</h1><ul>${listItems}</ul>`
    res.send(response)
  })

  app.listen(port, () => console.log(`Sea Shanty app listening on port ${port}!`))
}

boot()
