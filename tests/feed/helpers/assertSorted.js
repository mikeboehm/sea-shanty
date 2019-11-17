/* global expect */
module.exports = (playlist) => {
  let prev
  playlist.map(episode => episode.published).forEach((published) => {
    if (typeof prev === 'undefined') {
      prev = new Date(published)
      return
    }

    const last = new Date(prev)
    const now = new Date(published)

    expect(last.getTime()).toBeLessThan(now.getTime())
    prev = now
  })
}
