/* global describe, it, expect */
const delay = require('./helpers/delay')

const Playlist = require('../src/Playlist')

const feeds = [{
  name: 'Reply All',
  feed: 'http://feeds.gimletmedia.com/hearreplyall'
}]

describe('Playlist', () => {
  it('gets the current position', async () => {
    expect.assertions(2)
    const playlist = new Playlist(feeds)
    await delay(10)
    expect(typeof playlist.currentEpisode === 'object').toBe(true)

    // Wait for episodes to load
    while (playlist.episodes.length === 0) {
      console.log('Waiting...')
      await delay(100)
    }

    const next = playlist.next()

    // Create a new instance to use previously updated
    const newPlaylist = new Playlist(feeds)
    await delay(10)
    expect(newPlaylist.currentEpisode).toEqual(next)
  })
})
