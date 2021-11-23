const assert = require('assert')

const logger = require('../lib').default


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


  const operations = [{
      name: 'log',
      handler: logger.log,
    }, {
      name: 'warn',
      handler: logger.warn
    },
    {
      name: 'info',
      handler: logger.info
    },
    {
      name: 'error',
      handler: logger.error
    }
  ]



  for (let operation of operations) {
    /* jshint -W083 */

    const stringTest = () => {
      try {


        const feedback = operation.handler(sampleTxt)

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

    const objectTest = () => {
      try {

        const feedback = operation.handler(sampleObject)

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

    const combinedTest = () => {
      try {

        const feedback = operation.handler(sampleTxt, sampleObject)

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

    it(`logs txt .${operation.name}`, stringTest)
    it(`logs an object .${operation.name}`, objectTest)
    it(`logs txt and an object .${operation.name}`, combinedTest)

    /* jshint +W083 */
  }


  const errorTest = () => {

    try {

      const log = new logger.Logger({
        prefix: 'error-stack-test',
        showErrorStack: true
      })

      const error = new Error('This is an error')

      const feedback = log.error(error)

      if (!feedback.includes('stack')) {
        throw new Error('Display failed: No stack trace')
      }

    } catch (e) {
      assert(true, e)
    }
  }

  it(`logs the error stack`, errorTest)
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

  it(`should forward pre-processed data to the plugin`, (done) => {
    try {
      const testObject = {
        name: 'john doe',
        age: 25
      }

      const plugin = new logger.Plugin()

      plugin.log((message) => {
        assert(typeof message == 'object')
        done()
      })

      const loggerInstance = new logger.Logger({
        pluginPassthrough: true
      })

      plugin.link(loggerInstance)

      loggerInstance.log(testObject)
    } catch (e) {
      assert(false, e)
    }
  })
})