const assert = require('assert')
const logger = require('../src')

const sampleTxt = 'legendary text'

const sampleObject = {
  message: 'legendary object',
  extra: {
    name: 'John Doe',
    age: 100,
    stats: {
      height: 200,
      skintone: 'brown'
    }
  }
}

describe('Logger test', () => {
  const operations = Object.keys(logger)
    .filter((operation) => operation !== 'pause')
    .sort()

  for (let operation of operations) {
    it(`should print txt to terminal with .${operation}`, () => {
      try {
        const handler = logger[operation]

        const feedback = handler(sampleTxt)

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
        const handler = logger[operation]

        const feedback = handler(sampleObject)

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
