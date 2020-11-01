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
        logger.log(sampleTxt)
      } catch (e) {
        assert.fail(e)
      }
    })

    it(`should print an object to terminal with .${operation}`, () => {
      try {
        logger.log(sampleObject)
      } catch (e) {
        assert.fail(e)
      }
    })
  }
})
