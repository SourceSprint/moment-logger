const assert = require('assert')
const logger = require('../src')

const sampleTxt = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.'

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

describe('Logger function test', () => {
  const operations = ['log', 'warn', 'info', 'error']

  for (let operation of operations) {
    /* jshint -W083 */

    const operationcheck1 = () => {
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
    }

    const operationcheck2 = () => {
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
    }

    it(`logs txt .${operation}`, operationcheck1)
    it(`logs an object .${operation}`, operationcheck2)

    /* jshint +W083 */
  }
})

describe('Logger class test', () => {
  const operationcheck3 = () => {
    try {
      const log = new logger.Logger({
        prefix: '🔥',
        suffix: '❄️',
        noType: true
      })

      const feedback = log.info(sampleTxt)

      if (!feedback) {
        throw new Error('Display failed: Null response')
      }

      if (!feedback.trim().length) {
        throw new Error('Display failed: Empty response')
      }
    } catch (e) {
      assert.fail(e)
    }
  }

  const operationcheck4 = () => {
    try {
      const log = new logger.Logger({
        prefix: '🔥',
        suffix: '❄️',
        noTimestamp: true
      })

      const feedback = log.info(sampleObject)

      if (!feedback) {
        throw new Error('Display failed: Null response')
      }

      if (!feedback.trim().length) {
        throw new Error('Display failed: Empty response')
      }
    } catch (e) {
      assert.fail(e)
    }
  }

  it(`logs txt with prefix and suffix`, operationcheck3)
  it(`logs an object with prefix and suffix`, operationcheck4)
})
