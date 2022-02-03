import Events, { EventEmitter } from 'events'

import chalk from 'chalk';
import figlet from 'figlet';

import { collapse, throttle } from './utils'
import { Environments, DisplayOptions, display, clear, DEFAULTS } from '../core'

export interface FigletOptions {
    figlet?: typeof figlet;
    options?: figlet.Options;
    delay?: number
}


const defaultFigletConfiguration: FigletOptions = {
    options: {
        horizontalLayout: 'default',
        verticalLayout: 'fitted',
    },
    delay: 0
};

export interface LoggerOptions {
    prefix?: string;
    suffix?: string;
    noType?: boolean;
    noTimestamp?: boolean;
    pluginPassthrough?: boolean;
    pluginThrottle?: number;
    showErrorStack?: boolean;
    figlet?: FigletOptions;
}


export enum LogTypes {
    LOG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    BLANK = 'blank',
    ART = 'art',
    PAUSE = 'pause'
}

type LoggerFunction = (...args: any[]) => string | void;
type PromisedLoggerFunction = (...args: any[]) => Promise<string | void>;



export interface LoggerInstance extends EventEmitter {
    log: LoggerFunction;
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
    blank: LoggerFunction;
    clear: LoggerFunction;
    pause: PromisedLoggerFunction;
    art: PromisedLoggerFunction;
}





export class Logger extends Events implements LoggerInstance {
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


    private prefix: string;
    private suffix: string;
    private noType: boolean;
    private noTimestamp: boolean;
    private showErrorStack: boolean;
    private pluginPassthrough: boolean;
    private pluginThrottle: number;
    private figlet: FigletOptions;


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
        this.figlet = config.figlet || defaultFigletConfiguration
    }

    get options(): LoggerOptions {
        return {
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

    log = (...args: any[]) => {
        const message = collapse(args, this.collapseOptions)

        const payload: DisplayOptions = {
            ...this.options,
            type: LogTypes.LOG,
            start: 6,
            end: 10,
            modifier: (...t) => chalk.white.bgGray.bold(t),
            message
        }

        const feedback = (m: any): void => {
            this.emit('logger-log', m)
        }

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


    warn = (...args: any[]) => {
        const message = collapse(args, this.collapseOptions)


        const payload: DisplayOptions = {
            ...this.options,
            type: LogTypes.WARN,
            start: 7,
            end: 10,
            modifier: (...t) => chalk.white.bgHex('#ffa500').bold(t),
            message
        }


        const feedback = (m: any): void => {
            this.emit('logger-warn', m)
        }


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
    info = (...args: any[]): string => {
        const message = collapse(args, this.collapseOptions)


        const payload: DisplayOptions = {
            ...this.options,
            type: LogTypes.INFO,
            start: 7,
            end: 10,
            modifier: (...t) => chalk.white.bgBlue.bold(t),
            message
        }


        const feedback = (m: any): void => {
            this.emit('logger-info', m)
        }


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
    error = (...args: any[]): string => {
        const message = collapse(args, this.collapseOptions)


        const payload: DisplayOptions = {
            ...this.options,
            type: LogTypes.ERROR,
            start: 8,
            end: 10,
            modifier: (...t) => chalk.white.bgRed.bold(t),
            message
        }


        const feedback = (m: any): void => {
            this.emit('logger-error', m)
        }


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
    blank = (...args: any[]): string => {
        const message = collapse(args, this.collapseOptions)


        const payload: DisplayOptions = {
            ...this.options,
            type: LogTypes.BLANK,
            start: 8,
            end: 10,
            modifier: (...t) => chalk.white.bgGray.dim(t),
            message
        }

        const feedback = (m: any): void => {
            this.emit('logger-blank', m)
        }


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
    clear(): void {
        this.emit('logger-clear')
        clear()
    }
    /**
     * Wait for input
     * @returns {String}
     */
    pause = (...args: any[]): Promise<string> => new Promise((resolve, reject) => {

        const message = collapse(args, this.collapseOptions)

        const payload: DisplayOptions = {
            ...this.options,
            type: LogTypes.PAUSE,
            start: 8,
            end: 10,
            modifier: (...t) => chalk.white.bgGray.dim(t),
            message
        }

        const feedback = (m: any): void => {
            this.emit('logger-pause', m)
        }


        let feedback_ = feedback

        if (this.pluginThrottle) {
            feedback_ = throttle(feedback, this.pluginThrottle)
        }

        if (this.pluginPassthrough) {
            feedback_(args)
        } else {
            feedback_(message)
        }

        display(payload)


        const startTimestamp = Date.now()

        if (DEFAULTS.environment === Environments.BROWSER) {
            return reject(new Error('Pause is not supported in browser environment'))
        }

        if (DEFAULTS.environment === Environments.NODE) {

            if (process.stdin.isTTY) {
                process.stdin.setRawMode(true)
            }

            process.stdin.resume()
            process.stdin.on('data', () => {

                const endTimestamp = Date.now()

                const diff = endTimestamp - startTimestamp
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                resolve(diff.toLocaleString())
            })

        }

    })

    art = async (...args: any[]): Promise<string> => new Promise((resolve) => {
        const startTimestamp = Date.now()

        const message = collapse(args, this.collapseOptions)

        const feedback = (m: any): void => {
            this.emit('logger-art', m)
        }


        let feedback_ = feedback

        if (this.pluginThrottle) {
            feedback_ = throttle(feedback, this.pluginThrottle)
        }

        if (this.pluginPassthrough) {
            feedback_(args)
        } else {
            feedback_(message)
        }


        function resolveDiff() {
            const endTimestamp = Date.now()
            const diff = endTimestamp - startTimestamp
            resolve(diff.toLocaleString())
        }

        const figletFallback = (text: string) => {
            this.log(message)
            resolveDiff()
        }

        // use figlet if injected in the logger instance
        if (this.figlet.figlet) {

            const options: figlet.Options = {
                ...this.figlet.options
            }

            figlet.text(message, options, (err: Error | null, data: string | undefined) => {
                if (err) {
                    figletFallback(message)
                    return
                }


                const payload: DisplayOptions = {
                    noTimestamp: true,
                    noType: true,
                    type: LogTypes.ART,
                    start: 8,
                    end: 10,
                    modifier: (...t) => chalk.white.bgGray.dim(t),
                    message: `\n${data}\n`
                }


                display(payload)


                if (!this.figlet.delay) {
                    resolveDiff()
                    return
                }

                setTimeout(() => resolveDiff(), this.figlet.delay)

            })
        }

        else {
            figletFallback(message)
            return
        }


    })
}
