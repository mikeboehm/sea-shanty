'use strict'
const podcastParser = require('node-podcast-parser')
const rp = require('request-promise-native')

const addNewEpisodes = require('./addNewEpisodes')
const sortByOldestFirst = require('./sortByOldestFirst.js')

function parseEpisode (episode, podcastName) {
  try {
    const { guid, enclosure: { url }, published, duration, title } = episode

    // Valid important fields are set
    // For some reason, it didn't work when I was trying to declare the array as a literal eg: [url, published]
    const valuesToCheck = [url, published]
    valuesToCheck.forEach(field => {
      if (typeof field === 'undefined') {
        throw new Error('Field exists but value is undefined')
      }
    })

    return {
      guid, url, published: published.toISOString(), duration, podcastName, title
    }
  } catch (error) {
    // console.log('Episode missing a necessary field: '.toUpperCase(), error.message)
    // console.log(episode)
    return false
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
    .then(data => data.episodes.map(episode => parseEpisode(episode, data.title)))
}

const processFetchResults = (xmlResponse) => {
  return parseFeed(xmlResponse)
    .then(episodes => episodes.filter(Boolean))
}

const fetchFeed = (feed) => {
  return rp(feed.feed)
    .then(processFetchResults)
    .catch(e => {
      // console.error('VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
      console.error('FAILED FETCHING A FEED FFS', feed.name, e.message)
      // console.error('ERROR', e.message)
      // console.error('ΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛΛ')
      return false
    })
}

const getLatestPodcasts = async (feeds, playlist = []) => {
  const requests = feeds.map(
    feed => fetchFeed(feed)
  )

  const episodes = await Promise.all(requests)
    .then(feedResponses => feedResponses.filter(Boolean))
    .then(parsedFeeds => [].concat.apply([], parsedFeeds))

  console.error('PODCAST NAMES', episodes.map(episode => episode.podcastName).reduce((names, name) => {
    if (!names.includes(name)) names.push(name)
    return names
  }, [])).join(', ')

  return addNewEpisodes(playlist, episodes.sort(sortByOldestFirst))
}

module.exports = {
  getLatestPodcasts,
  fetchFeed
}
