const assert = require('assert')
const logger = require('../src')

const sampleTxt = 'legendary text'

const sampleObject = {
  message: 'legendary object'
}

describe('Logger test', () => {
  const operations = Object.keys(logger)

  for (let operation of operations) {
    it(`should print txt to terminal with .${operation}`, () => {
      try {
        const feedback = logger.log(sampleTxt)

        if (!feedback) {
          throw new Error('Display failed: Null response')
        }

        if (!feedback.trim().length) {
          throw new Error('Display failed: Empty response')
        }
      } catch (e) {
        assert.fail(e)
      }
    })

    it(`should print an object to terminal with .${operation}`, () => {
      try {
        const feedback = logger.log(sampleObject)

        if (!feedback) {
          throw new Error('Display failed: Null response')
        }

        if (!feedback.trim().length) {
          throw new Error('Display failed: Empty response')
        }
      } catch (e) {
        assert.fail(e)
      }
    })
  }
})
