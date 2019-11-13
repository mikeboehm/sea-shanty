const addNewEpisodes = require('./feed/addNewEpisodes')
const Feed = require('./Feed')
const logger = require('./Logger')
class Playlist {
  constructor (feeds) {
    feeds.map(feed => new Feed(feed))
      .map(feed => feed.on('updated', episodes => {        
        logger.info(`Updated: ${feed.name}. Fetched ${episodes.length} episodes`)
        this.update(episodes)
      }))

    this.episodes = []
    this.currentGuid = undefined
    this.currentEpisode = {
      title: '',
      podcastName: ''
    }
  }

  update (newEpisodes) {
    const episodes = addNewEpisodes(newEpisodes, this.episodes)

    const index = episodes.findIndex(episode => episode.guid === this.currentGuid)
    const remaining = episodes.slice(index + 1)

    this.episodes = index > -1 && remaining.length ? remaining : episodes
  }

  next () {
    const nextEpisode = this.episodes.shift()

    this.currentEpisode = nextEpisode
    this.currentGuid = nextEpisode.guid

    return nextEpisode
  }
}

module.exports = Playlist
