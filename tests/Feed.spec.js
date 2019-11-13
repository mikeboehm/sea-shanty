const Feed = require('../src/Feed')

describe('It can get new episodes', () => {
  const podcast = {
    name: 'Planet Money',
    feed: 'https://www.npr.org/rss/podcast.php?id=510289'
  }
  it('can get a feed', async () => {
    const feed = new Feed(podcast)

    const episodes = await feed.episodes()
    expect(episodes.length).toBeGreaterThan(0)
  })
})
