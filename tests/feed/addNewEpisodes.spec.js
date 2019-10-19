/* global describe, it, expect */
const moment = require('moment')

const addNewEpisodes = require('../../src/feed/addNewEpisodes')

const now = moment()

const playlist = require('./assets/examplePlaylist.js')(now)
const assertSorted = require('./helpers/assertSorted')

describe('Add New Episodes', () => {
  
  const newEpisodes = [{ 
    guid: 'prx_195_8af3f271-0d99-487c-959b-b41cfdp82b92',
    url:
    'https://new.mp3',
    published: now.clone().subtract(12, 'hours'),
    duration: 10,
    podcastName: 'New' 
  }]

  it('adds new episodes', () => {
    const newPlayList = addNewEpisodes( playlist, newEpisodes)

    expect(newPlayList.length).toBeGreaterThan(playlist.length)
  })

  it('keeps it chronological', () => {    
    const newPlayList = addNewEpisodes( playlist, newEpisodes)

    assertSorted(newPlayList)
  })

  it('does not contain duplicates', () => {
    const newEpisodes = [
      playlist[0],
    { 
      guid: '6dcc2ca0-d7da-47df-8c62-86306d2dd0fb',
      url:
      'https://new.mp3',
      published: now.clone().subtract(2, 'days'),
      duration: 10,
      podcastName: 'New' 
    }]

    const newPlayList = addNewEpisodes( playlist, newEpisodes)

    expect(newPlayList.length).toBe(playlist.length + 1)
  })

  it('discards old episodes', () => {
    const [ oldest, ...others] = playlist
    oldest.published = '2001-01-02T00:00:00.000Z'

    

    const newPlayList = addNewEpisodes( [oldest, ...others], newEpisodes)

    expect(newPlayList.length).toBe(playlist.length)
  })
})