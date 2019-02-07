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
})
