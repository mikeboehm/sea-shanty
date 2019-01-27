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
// let buttons = phatbeat.getButtonPins();
// /*
// [ { pin: 29, name: 'FAST_FORWARD' },
//   { pin: 31, name: 'PLAY_PAUSE' },
//   { pin: 33, name: 'REWIND' },
//   { pin: 36, name: 'VOL_UP' },
//   { pin: 37, name: 'VOL_DOWN' },
//   { pin: 32, name: 'POWER' } ]
// */

// //this attaches the monitoring to the underlying GPIO pin
let fastForwardStream = phatbeat.buttonStream(29);
let playPauseStream = phatbeat.buttonStream(31);
let rewindStream = phatbeat.buttonStream(33);
let volUpStream = phatbeat.buttonStream(36);
let volDownStream = phatbeat.buttonStream(37);
let powerStream = phatbeat.buttonStream(32);

fastForwardStream.on("pinChange", function(pin, pinState){
  console.log('fastForwardStream', pin, pinState)
  //pin is the pin number that has triggered the event
  //pin state is either 1 (pressed) or 0 (released)
});

playPauseStream.on("pinChange", function(pin, pinState){
  console.log('playPauseStream', pin, pinState)
  if(pinState === 1) {
    console.log('PLAYING!')
    mpvPlayer.append('http://9bs.svexican.me/')
  }

  //pin is the pin number that has triggered the event
  //pin state is either 1 (pressed) or 0 (released)
});

rewindStream.on("pinChange", function(pin, pinState){
  console.log('rewindStream', pin, pinState)
  //pin is the pin number that has triggered the event
  //pin state is either 1 (pressed) or 0 (released)
});

volUpStream.on("pinChange", function(pin, pinState){
  console.log('volUpStream', pin, pinState)
  //pin is the pin number that has triggered the event
  //pin state is either 1 (pressed) or 0 (released)
});

volDownStream.on("pinChange", function(pin, pinState){
  console.log('volDownStream', pin, pinState)
  //pin is the pin number that has triggered the event
  //pin state is either 1 (pressed) or 0 (released)
});

powerStream.on("pinChange", function(pin, pinState){
  console.log('powerStream', pin, pinState)
  //pin is the pin number that has triggered the event
  //pin state is either 1 (pressed) or 0 (released)
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
