const chalk = require('chalk')
const { LogTypes } = require('./models')
const { parseTime, collapse } = require('./utils')

const format = (prefix, message, suffix, noTimestamp) => {
  const { hours, minutes, seconds, milliseconds } = parseTime()
  const parsed = `[${hours}:${minutes}:${seconds}:${milliseconds}]`
  const padded = parsed.padEnd(20 - parsed.length)
  const composed = `${prefix} ${message} ${suffix}`.trim()

  if (noTimestamp) {
    return composed
  }

  const timestamp = chalk.gray.dim(padded)
  return `${timestamp} ${composed}`
}

const display = (payload) => {
  if (typeof payload == 'string') {
    process.stdout.write(payload)
    return payload
  }

  const {
    end,
    type,
    start,
    prefix = '',
    suffix = '',
    message = '',
    noType = false,
    noTimestamp = false,
    modifier = (x) => x
  } = payload

  const body = format(prefix, message, suffix, noTimestamp)

  let header = ''

  const isBlank = type == LogTypes.blank
  const isError = type == LogTypes.error

  if (!isBlank && !noType) {
    header = modifier(
      `${type().toString()}`.padStart(start).padEnd(end).toLocaleUpperCase()
    )
  }

  const data = `${header}${body}`

  if (isError) {
    data.split('\n').forEach((line) => process.stderr.write(`${line}\n`))
  } else {
    data.split('\n').forEach((line) => process.stdout.write(`${line}\n`))
  }

  return data
}

class Logger {
  constructor({
    prefix = '',
    suffix = '',
    noType = false,
    noTimestamp = false
  } = {}) {
    this.prefix = prefix
    this.suffix = suffix
    this.noType = noType
    this.noTimestamp = noTimestamp
  }

  /**
   * Display message with log formatting with timestamp
   * @param  {...any} data
   */
  log(...data) {
    const message = collapse(data)

    const options = {
      noType: this.noType,
      noTimestamp: this.noTimestamp,
      prefix: this.prefix,
      suffix: this.suffix
    }

    const payload = {
      ...options,
      type: LogTypes.log,
      start: 6,
      end: 10,
      modifier: chalk.white.bgGray.bold,
      message
    }

    return display(payload)
  }
  /**
   * Display message with warning format with timestamp
   * @param  {...any} data
   */
  warn(...data) {
    const message = collapse(data)

    const options = {
      noType: this.noType,
      noTimestamp: this.noTimestamp,
      prefix: this.prefix,
      suffix: this.suffix
    }

    const payload = {
      ...options,
      type: LogTypes.warn,
      start: 7,
      end: 10,
      modifier: chalk.white.bgHex('#ffa500').bold,
      message
    }

    return display(payload)
  }
  /**
   *  Display message with information format with timestamp
   * @param  {...any} data
   */
  info(...data) {
    const message = collapse(data)

    const options = {
      noType: this.noType,
      noTimestamp: this.noTimestamp,
      prefix: this.prefix,
      suffix: this.suffix
    }

    const payload = {
      ...options,
      type: LogTypes.info,
      start: 7,
      end: 10,
      modifier: chalk.white.bgBlue.bold,
      message
    }

    return display(payload)
  }
  /**
   * Display message with error format with timestamp
   * @param  {...any} data
   */
  error(...data) {
    const message = collapse(data)

    const options = {
      noType: this.noType,
      noTimestamp: this.noTimestamp,
      prefix: this.prefix,
      suffix: this.suffix
    }

    const payload = {
      ...options,
      type: LogTypes.error,
      start: 8,
      end: 10,
      modifier: chalk.white.bgRed.bold,
      message
    }

    return display(payload)
  }
  /**
   * Display a message with only timestamp
   * @param  {...any} data
   */
  blank(...data) {
    const message = collapse(data)

    const options = {
      noType: this.noType,
      noTimestamp: this.noTimestamp,
      prefix: this.prefix,
      suffix: this.suffix
    }

    const payload = {
      ...options,
      type: LogTypes.blank,
      start: 8,
      end: 10,
      modifier: chalk.white.bgGray.dim,
      message
    }

    return display(payload)
  }
  /**
   *  Clears the console
   */
  clear() {
    return display('\x1Bc')
  }
  /**
   * Wait for input
   */
  pause() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true)
    }

    process.stdin.resume()
    process.stdin.on('data', process.exit.bind(process, 0))
    return ''
  }
}

const loggerObject = new Logger()

const operations = {
  Logger,
  log: (args) => loggerObject.log(args),
  info: (args) => loggerObject.info(args),
  warn: (args) => loggerObject.warn(args),
  error: (args) => loggerObject.error(args),
  blank: (args) => loggerObject.blank(args),
  pause: () => loggerObject.pause()
}

module.exports = operations
