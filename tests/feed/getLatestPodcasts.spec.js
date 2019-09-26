/* global describe, it, expect */
const getLatestPodcasts = require('../../src/feed/getLatestPodcasts')

describe('It can get latest podcasts', () => {
  it('can get latest podcasts', async (done) => {
    const feeds = [{
      name: 'Reply All',
      feed: 'http://feeds.gimletmedia.com/hearreplyall'
    }]

    const response = await getLatestPodcasts(feeds)

    expect(response.length).toBe(5)

    done()
  })

  it('can gets the latest 5 episodes for each podcasts', async (done) => {
    const feeds = [{
      name: 'Reply All',
      feed: 'http://feeds.gimletmedia.com/hearreplyall'
    },
    {
      name: 'Radiolab',
      feed: 'http://feeds.wnyc.org/radiolab'
    }]

    const response = await getLatestPodcasts(feeds)

    expect(response.length).toBe(10)

    done()
  })

  it('sorts in chronological order', async () => {
    const feeds = [{
      name: 'Reply All',
      feed: 'http://feeds.gimletmedia.com/hearreplyall'
    },
    {
      name: 'Radiolab',
      feed: 'http://feeds.wnyc.org/radiolab'
    }]

    const playlist = await getLatestPodcasts(feeds)

    let prev
    playlist.map(episode => episode.published).forEach((published) => {      
      if (typeof prev === 'undefined') {
        prev = new Date(published)
        return
      }

      const last = new Date(prev)
      const now = new Date(published)
      
      expect(last.getTime()).toBeLessThan(now.getTime())
      prev = now
    })
  })

  it.skip('appends new episodes to the end', async() => {
    
  })
})
