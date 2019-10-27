const addNewEpisodes = require('./feed/addNewEpisodes')
class Playlist {
  constructor () {
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
