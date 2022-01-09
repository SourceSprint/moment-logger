import 'mocha'
import * as chai from 'chai'

import logger, { Logger, Plugin } from '../'

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


interface Operation {
  name: string;
  handler: (...args: any[]) => any;
}

// Logger Function Test

describe('Logger Function Test', () => {

  const operations: Operation[] = [{
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

    const stringTest = () => {

      const feedback = operation.handler(sampleTxt)

      if (!feedback) {
        throw new Error('Display failed: Null response')
      }

      if (!feedback.trim().length) {
        throw new Error('Display failed: Empty response')
      }
    }

    const objectTest = () => {

      const feedback = operation.handler(sampleObject)

      if (!feedback) {
        throw new Error('Display failed: Null response')
      }

      if (!feedback.trim().length) {
        throw new Error('Display failed: Empty response')
      }
    }

    const combinedTest = () => {

      const feedback = operation.handler(sampleTxt, sampleObject)

      if (!feedback) {
        throw new Error('Display failed: Null response')
      }

      if (!feedback.trim().length) {
        throw new Error('Display failed: Empty response')
      }
    }

    it(`logs txt .${operation.name}`, stringTest)
    it(`logs an object .${operation.name}`, objectTest)
    it(`logs txt and an object .${operation.name}`, combinedTest)

  }


  const errorTest = () => {


    const log = new Logger({
      prefix: 'error-stack-test',
      showErrorStack: true
    })

    const error = new Error('This is an error')

    const feedback = log.error(error)

    if (!feedback.includes('stack')) {
      throw new Error('Display failed: No stack trace')
    }
  }

  it(`logs the error stack`, errorTest)
})


// Logger Class Test

describe('Logger Class Test', () => {

  const operationcheck3 = () => {
    const log = new Logger({
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
  }

  const operationcheck4 = () => {
    const log = new Logger({
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
  }

  it(`logs txt with prefix and suffix`, operationcheck3)
  it(`logs an object with prefix and suffix`, operationcheck4)
})


// Logger Plugin Test

describe('Logger Plugin Test', () => {

  it('should create a plugin and link it to a logger instance', (done) => {

    const plugin = new Plugin()
    const loggerInstance = new Logger()

    plugin.link(loggerInstance)

    done()
  })

  it('should forward logger output to the plugin', (done) => {
    const test = 'lorem ipsum'

    const plugin = new Plugin()

    plugin.log((message: string) => {
      chai.expect(message).to.equal(test)
      done()
    })

    const loggerInstance = new Logger()
    plugin.link(loggerInstance)

    loggerInstance.log(test)
  })

  it(`should forward pre-processed data to the plugin`, (done) => {
    const testObject = {
      name: 'john doe',
      age: 25
    }

    const plugin = new Plugin()

    plugin.log((message: object) => {

      const isObject: boolean = typeof message == 'object'
      chai.expect(isObject).to.be.true
      done()
    })

    const loggerInstance = new Logger({
      pluginPassthrough: true
    })

    plugin.link(loggerInstance)

    loggerInstance.log(testObject)
  })
})