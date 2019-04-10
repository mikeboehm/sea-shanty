const { EventEmitter } = require('events')
const moment = require('moment')

class Alarm extends EventEmitter {
  constructor (alarmTimes) {
    super()

    this.alarmTimes = alarmTimes
  }

  getNextAlarm (now, alarm) {
    if (typeof alarm === 'undefined') alarm = moment(now)
    const todaySetting = this.alarmTimes[alarm.day()]

    if (typeof todaySetting === 'undefined') {
      return this.getNextAlarm(now, alarm.add(1, 'day'))
    }

    alarm
      .hour(todaySetting.hour)
      .minute(todaySetting.minute)
      .seconds(0)
      .millisecond(0)

    // Need to increase the day number, without adding it to "now"
    if (now >= alarm) {
      return this.getNextAlarm(now, alarm.add(1, 'day'))
    }

    return alarm
  }

  ZgetNextAlarm (now, attempts = 0) {
    attempts++
    if (attempts >= 7) {
      console.error('TOO MANY ATTEMPTS. BAILING')
      return false
    }
    console.error(now)
    // Get today's day number
    const todaySetting = this.alarmTimes[now.day()]

    console.error(todaySetting)

    // If no alarm for that day, increase day number
    if (typeof todaySetting === 'undefined') {
      console.error('NO ALARM FOR CURRENTY DAY:', now.day())
      const tomorrow = moment(now).add(1, 'day')
      return this.getNextAlarm(tomorrow, attempts)
    }

    // set alarm time for current day and compare
    const alarm = moment(now)
      .hour(todaySetting.hour)
      .minute(todaySetting.minute)
      .seconds(0)
      .millisecond(0)

    console.error('PROPOSED ALARM', alarm)

    // See if today's alarm has passed
    if (now >= alarm) {
      console.error('TODAYS ALARM HAS PASSED')
      const tomorrow = moment(now).add(1, 'day')
      return this.getNextAlarm(tomorrow, attempts)
    }

    return alarm
  }
}

module.exports = Alarm
