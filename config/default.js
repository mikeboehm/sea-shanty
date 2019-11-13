'use strict'
const env = process.env

module.exports = {
  loggly: {
    token: env.LOGGLY_TOKEN,
    subdomain: env.LOGGLY_SUBDOMAIN
  }, 
  data: {
    file: env.BALENA_APP_ID ? '/data/datafile.json' : __dirname + '/../datafile.json'
  },
  express: {
    port: env.BALENA_APP_ID ? 80: 3000
  }
}
