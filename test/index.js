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

describe('Logger Function Test', () => {
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
        assert(false, e)
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
        assert(false, e)
      }
    }

    it(`logs txt .${operation}`, operationcheck1)
    it(`logs an object .${operation}`, operationcheck2)

    /* jshint +W083 */
  }
})

describe('Logger Class Test', () => {
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
      assert(false, e)
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
      assert(false, e)
    }
  }

  it(`logs txt with prefix and suffix`, operationcheck3)
  it(`logs an object with prefix and suffix`, operationcheck4)
})

describe('Logger Plugin Test', () => {
  it('should create a plugin and link it to a logger instance', (done) => {
    try {
      const plugin = new logger.Plugin()
      const loggerInstance = new logger.Logger()
      plugin.link(loggerInstance)
      done()
    } catch (e) {
      assert(false, e)
    }
  })

  it('should forward logger output to the plugin', (done) => {
    try {
      const test = 'lorem ipsum'

      const plugin = new logger.Plugin()

      plugin.log((message) => {
        assert(message == test)
        done()
      })

      const loggerInstance = new logger.Logger()
      plugin.link(loggerInstance)

      loggerInstance.log(test)
    } catch (e) {
      assert(false, e)
    }
  })
})
