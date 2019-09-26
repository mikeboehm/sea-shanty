'use strict'
const podcastParser = require('node-podcast-parser')
const rp = require('request-promise-native')

const sortByOldestFirst = require('./sortByOldestFirst.js')

function parseEpisode (episode, podcastName) {
  // console.error(Object.keys(episode))
  const { guid, enclosure: { url }, published, duration } = episode

  return {
    guid, url, published: published.toISOString(), duration, podcastName
  }
}

function podcastParserAsync (feedXml) {
  return new Promise(function (resolve, reject) {
    podcastParser(feedXml, function (err, data) {
      if (err !== null) reject(err)
      else resolve(data)
    })
  })
}

function parseFeed (feedXml) {
  return podcastParserAsync(feedXml)
    .then(data => {
      const podcastEpisodes = data.episodes.slice(0, 5)
      return podcastEpisodes.map(episode => parseEpisode(episode, data.title))
    })
}



const getLatestPodcasts = async (feeds) => {
  const requests = feeds.map(feed => rp(feed.feed))

  const episodes = await Promise.all(requests)
    .then(responses => {
      return Promise.all(responses.map(feedXml => parseFeed(feedXml)))
    }).then(parsedFeeds => [].concat.apply([], parsedFeeds))

  return episodes.sort(sortByOldestFirst)
}

module.exports = getLatestPodcasts
