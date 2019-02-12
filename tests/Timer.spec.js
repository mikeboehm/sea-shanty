'use strict'
/* global describe, it, expect, beforeAll */

const Timer = require('Timer')
const { EventEmitter } = require('events')
const moment = require('moment')

describe('Timer', () => {
  describe('Interface', () => {
    let timer

    beforeAll(() => {
      timer = new Timer(100)
    })

    it('can be constructed with a duration in ms', () => {
      const timer = new Timer(100)

      expect(timer).toBeInstanceOf(Timer)
    })

    it('can be started', () => {
      expect(timer).toHaveProperty('start')
      expect(typeof timer.start === 'function').toBe(true)
    })

    it('can be stopped', () => {
      expect(timer).toHaveProperty('stop')
      expect(typeof timer.stop === 'function').toBe(true)
    })
  })

  describe('emit events', () => {
    it('extends EventEmitter', () => {
      const timer = new Timer(100)
      expect(timer).toBeInstanceOf(EventEmitter)
    })

    it('emits and event when the timer expires', async (done) => {
      expect.assertions(2)
      const duration = 100
      const timer = new Timer(duration)
      const now = moment()

      timer.on('started', (data) => {
        expect(data.startedAt instanceof moment).toBe(true)
      })

      timer.start()

      timer.on('time-up', (data) => {
        const finished = moment()

        const diff = (finished.diff(now) - duration)
        expect(diff).toBeLessThanOrEqual(5)
        done()
      })
    })

    it('emits ticks', async (done) => {
      // expect.assertions(10)
      const duration = 100
      const timer = new Timer(duration)
      let ticks = 0
      let count
      timer.on('tick', (data) => {
        ticks++
        count = data.count
      })

      timer.on('time-up', (data) => {
        // We just want to make sure it has happened a bunch of times
        expect(ticks).toBeGreaterThan(10)
        expect(ticks).toEqual(count)
        done()
      })

      timer.start()
    })

    it('can can be stopped', async (done) => {
      expect.assertions(1)
      const duration = 100
      const timer = new Timer(duration)

      timer.on('time-up', (data) => {
        throw new Error('This shouldnt happen')
      })

      timer.on('stopped', (data) => {
        expect(true).toBe(true)
      })

      timer.on('tick', (data) => {
        throw new Error('This should not have happened')
      })

      timer.start()
      timer.stop()

      setTimeout(() => {
        done()
      }, duration * 2)
    })
  })
})
