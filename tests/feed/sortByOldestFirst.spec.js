const moment = require('moment')

const sortByOldestFirst = require('../../src/feed/sortByOldestFirst')
const assertSorted = require('./helpers/assertSorted')
const playlist = require('./assets/examplePlaylist')(moment())

describe('it sorts by oldest first', () => {
  it('it sorts by oldest first', () => {
    const sorted = playlist.reverse().sort(sortByOldestFirst)

    assertSorted(sorted)
  })
})