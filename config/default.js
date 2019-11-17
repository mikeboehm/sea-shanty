'use strict'
const env = process.env
const path = require('path')

module.exports = {
  hostname: env.BALENA_APP_ID ? env.BALENA_DEVICE_NAME_AT_INIT : 'development',
  loggly: {
    token: env.LOGGLY_TOKEN,
    subdomain: env.LOGGLY_SUBDOMAIN
  },
  data: {
    currentEpisodePath: env.BALENA_APP_ID ? '/data/datafile.json' : path.join(__dirname, '/../data/datafile.json'),
    episodesPath: env.BALENA_APP_ID ? '/data/episodes.json' : path.join(__dirname, '/../data/episodes.json')
  },
  express: {
    port: env.BALENA_APP_ID ? 80 : 3000
  }
}
