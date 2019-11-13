var winston = require('winston')
var { Loggly } = require('winston-loggly-bulk')
const stack = require('callsite')
const { loggly: { token, subdomain } } = require('config')


  // Log to console
  winston.add(new winston.transports.Console({
    format: winston.format.simple()
  }))

  if (token) {
    winston.add(new Loggly({
      token,
      subdomain,
      tags: ['Winston-NodeJS'],
      json: true
    }))
  }

  const types = [
    'emerg',
    'alert',
    'crit',
    'error', 
    'warning',
    'noticev',
    'info',
    'debug'
  ]
  const logger = types.reduce((logger, type) => {
    logger[type] = (message) => {
      const callSite = stack()[1]
      const caller = callSite.getFileName().slice(0, callSite.getFileName().length -3).split('/').pop()
      const func = callSite.getFunctionName()
      const line = callSite.getLineNumber()

      winston.log(type, message, {caller, func, line})
    }

    return logger
  }, {})

module.exports = logger
