'use strict'
/* global describe, it, expect, beforeAll */

const Timer = require('Timer')
const { EventEmitter } = require('events')
const moment = require('moment')

describe('Timer', () => {
  describe('Interface', () => {
    let timer

    beforeAll(() => {
      timer = new Timer()
    })

    it('can be constructed', () => {
      expect(timer).toBeInstanceOf(Timer)
    })

    it('can be started', () => {
      expect(timer).toHaveProperty('start')
      expect(typeof timer.start === 'function').toBe(true)
    })

    it('can be cancelled', () => {
      expect(timer).toHaveProperty('cancel')
      expect(typeof timer.cancel === 'function').toBe(true)
    })
  })

  describe('emit events', () => {
    it('extends EventEmitter', () => {
      const timer = new Timer()
      expect(timer).toBeInstanceOf(EventEmitter)
    })

    it('emits and event when the timer expires', async (done) => {
      expect.assertions(2)
      const duration = 100
      const timer = new Timer()
      const now = moment()

      timer.on('started', (data) => {
        expect(data.startedAt instanceof moment).toBe(true)
      })

      timer.start(duration)

      timer.on('time-up', (data) => {
        const finished = moment()

        const diff = (finished.diff(now) - duration)
        expect(diff).toBeLessThanOrEqual(5)
        done()
      })
    })

    it('emits ticks', async (done) => {
      expect.assertions(2)
      const duration = 100
      const timer = new Timer()
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

      timer.start(duration)
    })

    it('can can be cancelled', async (done) => {
      expect.assertions(1)
      const duration = 100
      const timer = new Timer()

      timer.on('time-up', (data) => {
        throw new Error('This shouldnt happen')
      })

      timer.on('cancelled', (data) => {
        expect(true).toBe(true)
      })

      timer.on('tick', (data) => {
        throw new Error('This should not have happened')
      })

      timer.start(duration)
      timer.cancel()

      setTimeout(() => {
        done()
      }, duration * 2)
    })
  })
})
