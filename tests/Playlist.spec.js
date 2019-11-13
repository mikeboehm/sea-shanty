const Playlist = require('../src/Playlist')
const Feed = require('../src/Feed')

const feeds = [{
  name: 'Reply All',
  feed: 'http://feeds.gimletmedia.com/hearreplyall'
}]

const playlist = new Playlist(feeds)
console.error(playlist)

// describe('Playlist', () => {
//   it('does a thing', () => {
//     const playlist = new Playlist(feeds)
//     expect(true).toBe(false)
//   })
// })
