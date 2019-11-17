'use strict'
const path = require('path')

module.exports = {
  data: {
    currentEpisodePath: path.join(__dirname, '/../tests/assets/currentEpisode.json'),
    episodesPath: path.join(__dirname, '/../tests/assets/episodes.json')
  }
}
