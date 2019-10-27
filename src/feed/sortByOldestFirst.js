'use strict'

const sortByOldestFirst = (a, b) => {
  const aTime = new Date(a.published)
  const bTime = new Date(b.published)

  if (aTime < bTime) { return -1 }
  if (aTime > bTime) { return 1 }
  return 0
}

module.exports = sortByOldestFirst
