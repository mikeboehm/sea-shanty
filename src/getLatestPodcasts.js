'use strict'
const podcastParser = require('node-podcast-parser')
const rp = require('request-promise-native')

const getLatestPodcasts = async (feeds) => {
  // console.error(feeds)
  // rp(feeds[0].feed).then(result => console.log(result))

  const requests = feeds.map(feed => rp(feed.feed))

  const addToEpisodes = (episode, episodes) => {
    const guid = parsed.guid

    return episodes[guid] = episode
  }

  function parseEpisode(episode, podcastName) {
    // console.error(Object.keys(episode))
    const { guid, enclosure: { url }, published, duration } = episode

    return {
      guid, url, published, duration, podcastName
    }
  }

  // const singleResponse = requests[0].then(feedXml => parseFeed(feedXml))
  // singleResponse.then(response => console.log(response))


  function podcastParserAsync(feedXml) {
    return new Promise(function(resolve, reject) {
      podcastParser(feedXml, function(err, data) {
            if (err !== null) reject(err);
            else resolve(data);
        });
    });
  }

  function parseFeed(feedXml) {
    return podcastParserAsync(feedXml)
    .then(data => {
      const podcastEpisodes = data.episodes.slice(0, 5)
      return podcastEpisodes.map(episode => parseEpisode(episode, data.title))
    })
  }

  function sortByNewestFirst(a,b) {
    const aTime = new Date(a.published)
    const bTime = new Date(b.published)

    if (aTime < bTime)
      return 1;
    if (aTime > bTime)
      return -1;
    return 0;
  }

  const episodes = await Promise.all(requests)
  .then(responses => {
    return Promise.all(responses.map(feedXml => parseFeed(feedXml)))
    responses.forEach(feedXml => parseFeed(feedXml))
  }).then(parsedFeeds => [].concat.apply([], parsedFeeds))

  
  return episodes.sort(sortByNewestFirst)
}

module.exports = getLatestPodcasts
