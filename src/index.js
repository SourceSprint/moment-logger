const chalk = require('chalk')
const Events = require('events')

const { LogTypes } = require('./models')
const { parseTime, collapse, throttle } = require('./utils')

/**
 * Format message
 * @param {String} prefix Message prefix
 * @param {String} message Composed message
 * @param {String} suffix Message suffix
 * @param {Boolean} noTimestamp Hide timestamp
 * @returns {String}
 */
const format = (prefix, message, suffix, noTimestamp) => {
  const { hours, minutes, seconds, milliseconds } = parseTime()
  const paddedms = `${milliseconds}`.padStart(3, 0)

  const parsed = `[${hours}:${minutes}:${seconds}:${paddedms}]`
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

/**
 * Logger
 * @class Logger
 */
class Logger extends Events {
  /**
   *
   * @param {Object} config
   * @param {String} [config.prefix=''] Message prefix
   * @param {String} [config.suffix=''] Message suffix
   * @param {Boolean} [config.noType=false] Hide message type
   * @param {Boolean} [config.noTimestamp=false] Hide timestamp
   * @param {Boolean} [config.pluginPassthrough=false] Forward raw logger output to plugins
   * @param {Number} [config.pluginThrottle=0] Throttle duration for plugin output
   */
  constructor({
    prefix = '',
    suffix = '',
    noType = false,
    noTimestamp = false,
    pluginPassthrough = false,
    pluginThrottle = 0
  } = {}) {
    super()
    this.setMaxListeners(0)

    this.prefix = prefix
    this.suffix = suffix
    this.noType = noType
    this.noTimestamp = noTimestamp
    this.pluginThrottle = pluginThrottle
    this.pluginPassthrough = pluginPassthrough
  }

  /**
   * Display message with log formatting with timestamp
   * @param  {...any} data
   * @returns {String}
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

    const feedback = (m) => this.emit('logger-log', m)

    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(data)
    } else {
      feedback_(message)
    }

    return display(payload)
  }
  /**
   * Display message with warning format with timestamp
   * @param  {...any} data
   * @returns {String}
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

    const feedback = (m) => this.emit('logger-warn', m)

    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(data)
    } else {
      feedback_(message)
    }
    return display(payload)
  }
  /**
   *  Display message with information format with timestamp
   * @param  {...any} data
   * @returns {String}
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

    const feedback = (m) => this.emit('logger-info', m)

    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(data)
    } else {
      feedback_(message)
    }

    return display(payload)
  }
  /**
   * Display message with error format with timestamp
   * @param  {...any} data
   * @returns {String}
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

    const feedback = (m) => this.emit('logger-error', m)

    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(data)
    } else {
      feedback_(message)
    }

    return display(payload)
  }
  /**
   * Display a message with only timestamp
   * @param  {...any} data
   * @returns {String}
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

    const feedback = (m) => this.emit('logger-blank', m)

    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(data)
    } else {
      feedback_(message)
    }

    return display(payload)
  }
  /**
   *  Clears the console
   * @returns {String}
   */
  clear() {
    this.emit('logger-clear')
    return display('\x1Bc')
  }
  /**
   * Wait for input
   * @returns {String}
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

/**
 * Plugin class
 * @class Plugin
 */
class Plugin {
  constructor({ name = '' } = {}) {
    this.name = name

    this.logCb = null
    this.infoCb = null
    this.warnCb = null
    this.errorCb = null
  }

  /**
   * Link plugin to logger
   * @param {Logger} loggerInstance
   */
  link(loggerInstance) {
    const isLoggerInstance = loggerInstance instanceof Logger

    if (!isLoggerInstance) {
      throw new Error('Only logger instances can be linked to plugins')
    }

    loggerInstance.on('logger-log', (d) => (this.logCb ? this.logCb(d) : null))

    loggerInstance.on('logger-warn', (d) =>
      this.warnCb ? this.warnCb(d) : null
    )

    loggerInstance.on('logger-info', (d) =>
      this.infoCb ? this.infoCb(d) : null
    )
    loggerInstance.on('logger-error', (d) =>
      this.errorCb ? this.errorCb(d) : null
    )
  }

  /**
   * Assign log callback
   * @param {function} cb Log Callback
   */
  log(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }

    this.logCb = cb
  }

  /**
   * Assign info callback
   * @param {function} cb Info callback
   */
  info(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }
    this.infoCb = cb
  }

  /**
   * Assign warning callback
   * @param {function} cb Warning callback
   */
  warn(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }
    this.warnCb = cb
  }

  /**
   * Assign error callback
   * @param {function} cb Error callback
   */
  error(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }

    this.errorCb = cb
  }
}

const loggerObject = new Logger()

const operations = {
  Plugin,
  Logger,
  pause: () => loggerObject.pause(),
  log: (args) => loggerObject.log(args),
  info: (args) => loggerObject.info(args),
  warn: (args) => loggerObject.warn(args),
  error: (args) => loggerObject.error(args),
  blank: (args) => loggerObject.blank(args)
}

module.exports = operations
