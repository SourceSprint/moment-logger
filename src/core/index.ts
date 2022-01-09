import { Chalk } from 'chalk'
import { LoggerOptions, LogTypes } from '../logger'
import { parseTime } from '../logger/utils'

export enum Environments {
    BROWSER = 'browser',
    NODE = 'node'
}

const isProcessAvailable = typeof process !== 'undefined'

export const DEFAULTS = {
    environment: isProcessAvailable ? Environments.NODE : Environments.BROWSER,
    isTTY: isProcessAvailable ? process.stdout.isTTY : false,
}

enum ConsoleTypes {
    LOG = 'log',
    ERROR = 'error'
}


const chalk = new Chalk()


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

    switch (mode) {
        case ConsoleTypes.LOG: {
            message.split('\n').forEach(x => output.stdout.write(x + '\n'))
            break;
        }

        case ConsoleTypes.ERROR: {
            const escaped: string = message.replace(/\\n/g, '\n\t\t')
            escaped.split('\n').forEach(x => output.stderr.write(x + '\n'))
            break
        }

        default:
            break;
    }
}



export const display = (payload: string | DisplayOptions) => {

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


export const clear = (): void => {

    if (DEFAULTS.isTTY) {
        console.clear()
    }
}