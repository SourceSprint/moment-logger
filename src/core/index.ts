import chalk from 'chalk'
import { LoggerOptions, LogTypes } from '../logger'
import { parseTime } from '../logger/utils'

export enum Environments {
    BROWSER = 'browser',
    NODE = 'node'
}

// check if process is avaiable
// https://stackoverflow.com/a/34550964/5844218

const isProcessAvailable = typeof window === 'undefined' || typeof process === 'object' && process.title === 'node'

export const DEFAULTS = {
    environment: isProcessAvailable ? Environments.NODE : Environments.BROWSER,
    isTTY: isProcessAvailable ? process.stdout.isTTY : false,
}

enum ConsoleTypes {
    LOG = 'log',
    ERROR = 'error'
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

interface FormatOptions {
    prefix?: string;
    suffix?: string;
    noTimestamp?: boolean;
    message?: string;
}


const format = (options: FormatOptions): string => {
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

    const { prefix, suffix, noTimestamp, message } = options


    const composed = `${prefix} ${message} ${suffix}`

    if (noTimestamp) {
        return composed
    }

    const timestamp = chalk.gray.dim(padded)
    return `${timestamp} ${composed}`
}


type Modifier = (...args: any[]) => string;


export interface DisplayOptions extends LoggerOptions {
    start: number;
    end: number;
    message: string;
    type: LogTypes;
    modifier?: Modifier;
}


const toConsole = (message: string, mode: ConsoleTypes): void => {


    const process_ = {
        stdout: {
            write: (x: string) => console.log(x)
        },
        stderr: {
            write: (x: string) => console.error(x)
        }
    }

    const output = isProcessAvailable ? process : process_

    const escaped: string = message.replace(/\\n/g, '\n\t\t')


    switch (mode) {
        case ConsoleTypes.LOG: {
            output.stdout.write(`\n${escaped}`)
            break;
        }

        case ConsoleTypes.ERROR: {
            output.stderr.write(`\n${escaped}`)
            break
        }

        default:
            break;
    }
}


const defaultOptions: Omit<DisplayOptions, 'type' | 'start' | 'end' | 'modifier'> = {
    prefix: '',
    suffix: '',
    linePrefix: '',
    lineSuffix: '',
    message: '',
    noType: false,
    noTimestamp: false,
}


export const display = (payload: string | DisplayOptions) => {

    if (typeof payload == 'string') {
        toConsole(payload as string, ConsoleTypes.LOG)
        return payload
    }

    const normalizedPayload = Object.assign({}, defaultOptions, payload)

    const {
        end,
        type,
        start,
        message,
        prefix,
        suffix,
        noType,
        linePrefix,
        lineSuffix,
        noTimestamp,
        modifier = (x) => x
    } = normalizedPayload as DisplayOptions


    const options: FormatOptions = {
        prefix,
        suffix,
        noTimestamp,
        message
    }

    const body = format(options)

    let header = ''

    const isArt = type == LogTypes.ART
    const isBlank = type == LogTypes.BLANK
    const isError = type == LogTypes.ERROR


    if (isArt) {
        toConsole(body, ConsoleTypes.LOG)
        return body
    }

    if (!isBlank && !noType) {
        const castedType: string = type.toString()

        header = modifier(castedType.padStart(start).padEnd(end).toLocaleUpperCase())
    }

    const data = `${linePrefix}${header} ${body}${lineSuffix}`

    if (isError) {
        toConsole(data, ConsoleTypes.ERROR)
    } else {
        toConsole(data, ConsoleTypes.LOG)
    }

    return data

}


export const clear = (): void => {

    if (DEFAULTS.isTTY) {
        // this is available in all environments
        console.clear()
    }
}