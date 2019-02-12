'use strict'
/* global beforeAll, describe, it, expect */
const Alarm = require('Alarm')
const moment = require('moment')

const alarmTimes = {
  1: { hour: 6, minute: 0 },
  2: { hour: 6, minute: 0 },
  3: { hour: 6, minute: 0 },
  4: { hour: 6, minute: 0 },
  5: { hour: 6, minute: 0 }
}

describe('Alarm clock', () => {
  it('can get the next alarm for today', () => {
    const alarm = new Alarm(alarmTimes)
    const now = moment('2019-02-12T05:00:00.000Z')

    const nextAlarm = alarm.getNextAlarm(now)

    expect(nextAlarm.toISOString()).toEqual('2019-02-12T06:00:00.000Z')
  })

  it('can get the next alarm for tomorrow once todays has passed', () => {
    const alarm = new Alarm(alarmTimes)
    const now = moment('2019-02-12T09:00:00.000Z')

    const nextAlarm = alarm.getNextAlarm(now)

    expect(nextAlarm.toISOString()).toEqual('2019-02-13T06:00:00.000Z')
  })

  it('can handle missing days', () => {
    const alarmTimes = {
      2: { hour: 6, minute: 0 },
    }
    const alarm = new Alarm(alarmTimes)
    const now = moment('2019-02-12T09:00:00.000Z')

    const nextAlarm = alarm.getNextAlarm(now)

    expect(nextAlarm.toISOString()).toEqual('2019-02-19T06:00:00.000Z')
  })
})
