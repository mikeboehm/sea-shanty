'use strict'
const moment = require('moment')
const sortByOldestFirst = require('./sortByOldestFirst.js')

const ONE_MONTH_AGO = 30 * 24 * 60 * 60 * 1000

/**
 * It adds new episodes
 * it keeps it chronological
 * it doesn't have duplicates
 * it drops older episodes
 */
const addNewEpisodes = (playlist, newEpisodes) => {
  const now = moment()

  return playlist
    .concat(newEpisodes)
    .sort(sortByOldestFirst)
    .reduce((episodes, current) => {
      if(!episodes.length) return [current]
      
      const prev = episodes.slice(-1).pop()
      
      if(prev.guid != current.guid) episodes.push(current)
      
      return episodes
    }, [])
    .reduce((playlist, episode) => {
      const published = moment.utc(episode.published)      
      if(now.diff(published) <= ONE_MONTH_AGO) playlist.push(episode)
      
      return playlist
    }, [])
}

module.exports = addNewEpisodes