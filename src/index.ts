import chalk from 'chalk'
import Events from 'events'

import { parseTime, collapse, throttle } from './utils'


enum LogTypes {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  BLANK = 'blank'
}

enum ConsoleTypes {
  LOG = 'log',
  ERROR = 'error'
}

enum Environments {
  BROWSER = 'browser',
  NODE = 'node'
}


const DEFAULTS = {
  environment: typeof process != 'undefined' ? Environments.NODE : Environments.BROWSER
}

/**
 * Pad string
 * @param {String} [x=''] String to pad
 * @param {*} [a=0] Amount of padding
 * @returns {String}
 */
const pad = (x: number | string = '', a: any = 0): string => `${x}`.padStart(a, '0')

/**
 * Format message
 * @param {String} prefix Message prefix
 * @param {String} message Composed message
 * @param {String} suffix Message suffix
 * @param {Boolean} noTimestamp Hide timestamp
 * @returns {String}
 */
const format = (prefix: string, message: string, suffix: string, noTimestamp: boolean): string => {
  const { hours, minutes, seconds, milliseconds } = parseTime()

  const parsed = [
    { value: hours, padding: 2 },
    { value: minutes, padding: 2 },
    { value: seconds, padding: 2 },
    { value: milliseconds, padding: 3 }
  ]
    .map(({ value, padding }) => pad(value, padding))
    .join(':')

  const padded = parsed.padEnd(20 - parsed.length)
  const composed = `${prefix} ${message} ${suffix}`.trim()

  if (noTimestamp) {
    return composed
  }

  const timestamp = chalk.gray.dim(padded)
  return `${timestamp} ${composed}`
}

interface LoggerOptions {
  prefix?: string;
  suffix?: string;
  noType?: boolean;
  noTimestamp?: boolean;
  pluginPassthrough?: boolean;
  pluginThrottle?: number;
  showErrorStack?: boolean;
}


interface DisplayOptions extends LoggerOptions {
  start: number;
  end: number;
  message: string;
  type: LogTypes;
  modifier?: (x: string) => string;
}


const toConsole = (m: string, mode: ConsoleTypes): void => {


  const mockProcess = {
    stdout: {
      write: (x: string) => console.log(x)
    },
    stderr: {
      write: (x: string) => console.error(x)
    }
  }

  const output = DEFAULTS.environment == Environments.NODE ? process : mockProcess


  if (mode == ConsoleTypes.LOG) {
    m.split('\n').forEach(x => output.stdout.write(x + '\n'))
  }

  if (mode == ConsoleTypes.ERROR) {
    const escaped: string = m.replace(/\\n/g, '\n\t\t')
    escaped.split('\n').forEach(x => output.stderr.write(x + '\n'))
  }
}


const display = (payload: string | DisplayOptions) => {

  if (typeof payload == 'string') {
    toConsole(payload as string, ConsoleTypes.LOG)
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
  } = payload as DisplayOptions

  const body = format(prefix, message, suffix, noTimestamp)

  let header = ''

  const isBlank = type == LogTypes.BLANK
  const isError = type == LogTypes.ERROR

  if (!isBlank && !noType) {
    const castedType: string = type.toString()

    header = modifier(castedType.padStart(start).padEnd(end).toLocaleUpperCase())
  }

  const data = `${header} ${body}`

  if (isError) {
    toConsole(data, ConsoleTypes.ERROR)
  } else {
    toConsole(data, ConsoleTypes.LOG)
  }

  return data

}


interface LoggerClass {
  log: (...args: any[]) => string;
  info: (...args: any[]) => string;
  warn: (...args: any[]) => string;
  error: (...args: any[]) => string;
  blank: (...args: any[]) => string;
  clear: () => string;
  pause: () => string;
}


/**
 * Logger
 * @class Logger
 */
class Logger extends Events implements LoggerClass {
  /**
   *
   * @param {Object} config
   * @param {String} [config.prefix=''] Message prefix
   * @param {String} [config.suffix=''] Message suffix
   * @param {Boolean} [config.noType=false] Hide message type
   * @param {Boolean} [config.noTimestamp=false] Hide timestamp
   * @param {Boolean} [config.pluginPassthrough=false] Forward raw logger output to plugins
   * @param {Number} [config.pluginThrottle=0] Throttle duration for plugin output
   * @param {Boolean} [config.showErrorStack=false] Show error stack with error object
   */


  prefix: string;
  suffix: string;
  noType: boolean;
  noTimestamp: boolean;
  showErrorStack: boolean;
  pluginPassthrough: boolean;
  pluginThrottle: number;

  constructor(config: LoggerOptions = {}) {


    super()
    this.setMaxListeners(0)

    this.prefix = config.prefix || ''
    this.suffix = config.suffix || ''
    this.noType = config.noType || false
    this.noTimestamp = config.noTimestamp || false
    this.showErrorStack = config.showErrorStack || false
    this.pluginPassthrough = config.pluginPassthrough || false
    this.pluginThrottle = config.pluginThrottle || 0
  }

  get options() {
    return <LoggerOptions>{
      noType: this.noType,
      prefix: this.prefix,
      suffix: this.suffix,
      noTimestamp: this.noTimestamp,
      showErrorStack: this.showErrorStack,
    }
  }

  get collapseOptions() {
    return {
      showErrorStack: this.showErrorStack
    }
  }

  log(...args: any[]) {
    const message = collapse(args, this.collapseOptions)

    const payload = {
      ...this.options,
      type: LogTypes.LOG,
      start: 6,
      end: 10,
      modifier: chalk.white.bgGray.bold,
      message
    }

    const feedback = (m: any): void => { this.emit('logger-log', m) }

    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(args)
    } else {
      feedback_(message)
    }

    return display(payload)
  }


  warn(...args: any[]) {
    const message = collapse(args, this.collapseOptions)


    const payload = {
      ...this.options,
      type: LogTypes.WARN,
      start: 7,
      end: 10,
      modifier: chalk.white.bgHex('#ffa500').bold,
      message
    }


    const feedback = (m: any): void => { this.emit('logger-warn', m) }


    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(args)
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
  info(...args: any[]): string {
    const message = collapse(args, this.collapseOptions)


    const payload = {
      ...this.options,
      type: LogTypes.INFO,
      start: 7,
      end: 10,
      modifier: chalk.white.bgBlue.bold,
      message
    }


    const feedback = (m: any): void => { this.emit('logger-info', m) }


    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(args)
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
  error(...args: any[]): string {
    const message = collapse(args, this.collapseOptions)


    const payload = {
      ...this.options,
      type: LogTypes.ERROR,
      start: 8,
      end: 10,
      modifier: chalk.white.bgRed.bold,
      message
    }


    const feedback = (m: any): void => { this.emit('logger-error', m) }


    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(args)
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
  blank(...args: any[]): string {
    const message = collapse(args, this.collapseOptions)


    const payload = {
      ...this.options,
      type: LogTypes.BLANK,
      start: 8,
      end: 10,
      modifier: chalk.white.bgGray.dim,
      message
    }

    const feedback = (m: any): void => { this.emit('logger-blank', m) }


    let feedback_ = feedback

    if (this.pluginThrottle) {
      feedback_ = throttle(feedback, this.pluginThrottle)
    }

    if (this.pluginPassthrough) {
      feedback_(args)
    } else {
      feedback_(message)
    }

    return display(payload)
  }


  /**
   *  Clears the console
   * @returns {String}
   */
  clear(): string {
    this.emit('logger-clear')
    return display('\x1Bc')
  }
  /**
   * Wait for input
   * @returns {String}
   */
  pause(): string {

    if (DEFAULTS.environment === Environments.BROWSER) {
      throw new Error('Pause is not supported in browser environment')
    }

    if (DEFAULTS.environment === Environments.NODE) {

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true)
      }

      process.stdin.resume()
      process.stdin.on('data', process.exit.bind(process, 0))

    }

    return ''
  }
}

/**
 * Plugin class
 * @class Plugin
 */
class Plugin {
  name: string;
  logCb: Function;
  warnCb: Function;
  infoCb: Function;
  errorCb: Function;

  constructor({ name = '' } = {}) {
    this.name = name

    this.logCb = () => { }
    this.infoCb = () => { }
    this.warnCb = () => { }
    this.errorCb = () => { }
  }

  /**
   * Link plugin to logger
   * @param {Logger} loggerInstance
   */
  link(loggerInstance: Logger) {
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
  log(cb: Function) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }

    this.logCb = cb
  }

  /**
   * Assign info callback
   * @param {function} cb Info callback
   */
  info(cb: Function) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }
    this.infoCb = cb
  }

  /**
   * Assign warning callback
   * @param {function} cb Warning callback
   */
  warn(cb: Function) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }
    this.warnCb = cb
  }

  /**
   * Assign error callback
   * @param {function} cb Error callback
   */
  error(cb: Function) {
    if (typeof cb !== 'function') {
      throw new Error('Callback has to be a function')
    }

    this.errorCb = cb
  }
}

const l = new Logger()

export default {
  Plugin,
  Logger,
  pause: l.pause.bind(l),
  log: l.log.bind(l),
  info: l.info.bind(l),
  warn: l.warn.bind(l),
  error: l.error.bind(l),
  blank: l.blank.bind(l)
}

