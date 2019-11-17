const addNewEpisodes = require('./feed/addNewEpisodes')
const Feed = require('./Feed')
const logger = require('./Logger')
const { data: { currentEpisodePath, episodesPath } } = require('config')

const createDataRecorder = require('./dataRecorder')
const { read, update } = createDataRecorder(currentEpisodePath)
const { read: readEpisodes, update: updateEpisodes } = createDataRecorder(episodesPath)
class Playlist {
  constructor (feeds) {
    feeds.map(feed => new Feed(feed))
      .map(feed => feed.on('updated', episodes => {
        logger.info(`Updated: ${feed.name}. Fetched ${episodes.length} episodes`)
        this.update(episodes)
      }))

    this.episodes = []
    this.currentPosition = 0
    this.currentEpisode = undefined

    read()
      .then(data => {
        this.currentEpisode = data
      }).catch(error => {
        logger.error(error.message)
        this.currentEpisode = {
          title: '',
          podcastName: '',
          guid: undefined
        }
      })

    readEpisodes()
      .then(episodes => {
        this.episodes = episodes
      }).catch(error => {
        logger.error(error.message)
        this.episodes = []
      })
  }

  get currentGuid () {
    return this.currentEpisode.guid
  }

  update (newEpisodes) {
    const episodes = addNewEpisodes(this.episodes, newEpisodes)

    const index = episodes.findIndex(episode => episode.guid === this.currentGuid)

    updateEpisodes(episodes)
    this.episodes = episodes
    this.currentPosition = index > -1 ? index : 0
    logger.info('currentPosition', { position: this.currentPosition })
  }

  next () {
    const newIndex = this.currentPosition + 1

    const nextEpisode = this.episodes[newIndex]
    this.currentPosition = newIndex

    update(nextEpisode)
    this.currentEpisode = nextEpisode

    return nextEpisode
  }
}

module.exports = Playlist
