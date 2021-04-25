const chalk = require('chalk')
const { LogTypes } = require('./models')
const { parseTime, collapse } = require('./utils')

const format = (message) => {
  const { hours, minutes, seconds, milliseconds } = parseTime()
  const timestamp = chalk.gray.dim(
    `[${hours}:${minutes}:${seconds}:${milliseconds}]`
  )
  return `${timestamp} ${message}`
}

const display = (payload) => {
  if (typeof payload == 'string') {
    process.stdout.write(payload)
    return payload
  }

  const { type, start, end, modifier = (x) => x, message = '' } = payload

  const body = format(message)

  let header = ''

  const isBlank = type == LogTypes.blank

  if (!isBlank) {
    header = modifier(
      `${type().toString()}`.padStart(start).padEnd(end).toLocaleUpperCase()
    )
  }

  const data = `${header}${body}\n`

  process.stdout.write(data)
  return data
}

const operations = {
  /**
   *
   * @param  {...any} data
   */
  log(...data) {
    const message = collapse(data)

    const payload = {
      type: LogTypes.log,
      start: 6,
      end: 10,
      modifier: chalk.white.bgGray.bold,
      message
    }

    return display(payload)
  },
  /**
   *
   * @param  {...any} data
   */
  warn(...data) {
    const message = collapse(data)

    const payload = {
      type: LogTypes.warn,
      start: 7,
      end: 10,
      modifier: chalk.white.bgHex('#ffa500').bold,
      message
    }

    return display(payload)
  },
  /**
   *
   * @param  {...any} data
   */
  info(...data) {
    const message = collapse(data)

    const payload = {
      type: LogTypes.info,
      start: 7,
      end: 10,
      modifier: chalk.white.bgBlue.bold,
      message
    }

    return display(payload)
  },
  /**
   *
   * @param  {...any} data
   */
  error(...data) {
    const message = collapse(data)

    const payload = {
      type: LogTypes.error,
      start: 8,
      end: 10,
      modifier: chalk.white.bgRed.bold,
      message
    }

    return display(payload)
  },
  /**
   *
   * @param  {...any} data
   */
  blank(...data) {
    const message = collapse(data)

    const payload = {
      type: LogTypes.blank,
      start: 8,
      end: 10,
      modifier: chalk.white.bgGray.dim,
      message
    }

    return display(payload)
  }
}

module.exports = operations
