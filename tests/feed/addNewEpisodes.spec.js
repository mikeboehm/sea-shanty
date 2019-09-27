/* global describe, it, expect */
const addNewEpisodes = require('../../src/feed/addNewEpisodes')

const playlist = require('./assets/examplePlaylist.js')
const assertSorted = require('./helpers/assertSorted')

describe('Add New Episodes', () => {
  const newEpisodes = [{ 
    guid: 'prx_195_8af3f271-0d99-487c-959b-b41cfdp82b92',
    url:
    'https://new.mp3',
    published: '2019-01-02T12:00:00.000Z',
    duration: 10,
    podcastName: 'New' 
  }]

  const now = new Date('2019-01-03T00:00:00.000Z')

  it('adds new episodes', () => {
    const newPlayList = addNewEpisodes( playlist, newEpisodes, now )

    expect(newPlayList.length).toBeGreaterThan(playlist.length)
  })

  it('keeps it chronological', () => {    
    const newPlayList = addNewEpisodes( playlist, newEpisodes, now )

    assertSorted(newPlayList)
  })

  it('does not contain duplicates', () => {
    const newEpisodes = [{ 
      guid: 'b9a91b52-98c9-4f8a-a071-9b082478c8e7',
      url:
      'https://first.mp3',
      published: '2019-01-01T00:00:00.000Z',
      duration: 10,
      podcastName: 'First' 
    },{ 
      guid: '6dcc2ca0-d7da-47df-8c62-86306d2dd0fb',
      url:
      'https://new.mp3',
      published: '2019-01-02T12:00:00.000Z',
      duration: 10,
      podcastName: 'New' 
    }]

    const newPlayList = addNewEpisodes( playlist, newEpisodes, now )

    expect(newPlayList.length).toBe(playlist.length + 1)
  })

  it('discards old episodes', () => {
    const [ oldest, ...others] = playlist
    oldest.published = '2001-01-02T00:00:00.000Z'

    

    const newPlayList = addNewEpisodes( [oldest, ...others], newEpisodes, now)

    expect(newPlayList.length).toBe(playlist.length)
  })
})