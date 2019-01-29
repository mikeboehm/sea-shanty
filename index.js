'use strict'
const SeaShanty = require('./src/SeaShanty')
console.log('starting js app')
let mpv = require('node-mpv');
const express = require('express')
const app = express()
const port = 3000

const mpvPlayer = new mpv({
  "audio_only": true,
  // 'ipc_command': '--input-ipc-server',
  // "verbose": true,
});
mpvPlayer.volume(30)

let phatbeat = require('phatbeat');

const ss = new SeaShanty({phatbeat, mpvPlayer})

app.get('/', (req, res) => res.json(ss.mpvState))
app.get('/playpause', (req, res) => {
  console.error('API: playpause')
  ss.togglePause()
  res.send(ss.mpvState)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
