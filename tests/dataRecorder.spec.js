/* global describe, it, expect */
const createDataRecorder = require('../src/dataRecorder')

const path = require('path')

describe('Reading', () => {
  it('throws an Error if the file does not exist', async () => {
    expect.assertions(1)
    const nonExistantFile = path.join(__dirname, '/assets/nonExistantFile.json')

    const { read } = createDataRecorder(nonExistantFile)

    try {
      await read()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
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
