const chalk = require('chalk')
const { parseTime, stringify } = require('./utils')

const format = (message) => {
  const { hours, minutes, seconds, milliseconds } = parseTime()
  const timestamp = chalk.gray.dim(
    `[${hours}:${minutes}:${seconds}:${milliseconds}]`
  )
  return `${timestamp}${message}\n`
}

const display = (data) => {
  const message = format(data)
  process.stdout.write(message)
  return message
}

const operations = {
  /**
   *
   * @param  {...any} data
   */
  log(...data) {
    const message = stringify(data)
    const colorCoded = `${chalk.gray(message)}`
    return display(colorCoded)
  },
  /**
   *
   * @param  {...any} data
   */
  warn(...data) {
    const message = stringify(data)
    const colorCoded = `${chalk.magenta(message)}`
    return display(colorCoded)
  },
  /**
   *
   * @param  {...any} data
   */
  info(...data) {
    const message = stringify(data)
    const colorCoded = `${chalk.blue(message)}`
    return display(colorCoded)
  },
  /**
   *
   * @param  {...any} data
   */
  error(...data) {
    const message = stringify(data)
    const colorCoded = `${chalk.red(message)}`
    return display(colorCoded)
  },
  /**
   *
   * @param  {...any} data
   */
  blank(...data) {
    const message = stringify(data)
    const colorCoded = `${chalk.gray.dim(message)}`
    return display(colorCoded)
  }
}

module.exports = operations
