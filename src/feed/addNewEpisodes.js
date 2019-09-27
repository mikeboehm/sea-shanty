'use strict'

const sortByOldestFirst = require('./sortByOldestFirst.js')

/**
 * It adds new episodes
 * it keeps it chronological
 * it doesn't have duplicates
 */
const addNewEpisodes = (playlist, newEpisodes) => {
  
  return playlist
    .concat(newEpisodes)
    .sort(sortByOldestFirst)
    .reduce((episodes, current) => {
      if(!episodes.length) return [current]
      
      const prev = episodes.slice(-1).pop()
      
      if(prev.guid != current.guid) episodes.push(current)
      
      return episodes
    }, [])
}

module.exports = addNewEpisodes