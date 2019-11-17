'use strict'

// const path = require('path');
const fs = require('fs')

const createDataRecorder = (path) => {
  const reader = () => {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, function (err, data) {
        if (err) {
          resolve(false)
        } else {
          try {
            resolve(JSON.parse(data.toString()))
          } catch (error) {
            resolve(false)
          }
        }
      })
    })
  }

  const writeFilePromise = (data) => {
    data = JSON.stringify(data)
    return new Promise(function (resolve, reject) {
      fs.writeFile(path, data, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  return {
    read: reader,
    update: writeFilePromise
  }
}

module.exports = createDataRecorder
