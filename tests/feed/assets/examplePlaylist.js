const moment = require('moment')

const now = moment()

module.exports = (now) => {
  return [ 
  { guid: 'b9a91b52-98c9-4f8a-a071-9b082478c8e7',
    url:
    'https://first.mp3',
    published: now.clone().subtract(3, 'days'),
    duration: 10,
    podcastName: 'First' 
  },{ 
    guid: '2c4fbe55-4d24-495c-835b-a47b58c59bd4',
    url:
    'https://second.mp3',
    published: now.clone().subtract(2, 'days'),
    duration: 10,
    podcastName: 'Second' 
  },{ 
    guid: 'prx_195_8af3f271-0d99-487c-959b-b41cfd782b92',
    url:
    'https://third.mp3',
    published: now.clone().subtract(1, 'days'),
    duration: 10,
    podcastName: 'Third' 
  },
]
}