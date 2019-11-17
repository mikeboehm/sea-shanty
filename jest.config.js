'use strict'

process.env.NODE_PATH = 'src:tests'
module.exports = {
  verbose: false,
  watchPathIgnorePatterns: [
    '<rootDir>/tests/assets/'
  ]
}
