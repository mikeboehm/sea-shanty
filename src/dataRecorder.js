'use strict'

const fs = require('fs')
const readFile = require('util').promisify(fs.readFile)
const writeFile = require('util').promisify(fs.writeFile)

const createDataRecorder = (path) => {
  const read = () => readFile(path)
    .then(data => JSON.parse(data.toString()))
    .catch(error => { throw new Error(error.message) })

  const update = (data) => writeFile(path, JSON.stringify(data))

  return {
    read,
    update
  }
}

module.exports = createDataRecorder
