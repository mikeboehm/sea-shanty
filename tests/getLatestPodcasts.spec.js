/* global describe, it, expect */
const getLatestPodcasts = require('getLatestPodcasts')

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
})
