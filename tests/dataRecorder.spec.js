/* global describe, it, expect */
const createDataRecorder = require('../src/dataRecorder')

const path = require('path')

describe('Reading', () => {
  it('returns false if the file does not exit', async () => {
    const nonExistantFile = path.join(__dirname, '/assets/nonExistantFile.json')

    const { read } = createDataRecorder(nonExistantFile)

    const initialState = await read()

    expect(initialState).toBe(false)
  })

  it('returns the contents of the file', async () => {
    const existingFile = path.join(__dirname, '/assets/existingFile.json')

    const { read } = createDataRecorder(existingFile)

    const initialState = await read()

    expect(initialState).toEqual({ test: { nested: true } })
  })
})

describe('Writing', () => {
  it('can write', async () => {
    const writeableFile = path.join(__dirname, '/assets/writeableFile.json')

    const { update } = createDataRecorder(writeableFile)

    const data = {
      randomInt: Math.floor(Math.random() * 10000000000)
    }

    update(data)

    const { read } = createDataRecorder(writeableFile)
    const initialState = await read()

    expect(initialState).toEqual(data)
  })
})
