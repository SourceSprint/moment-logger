import { Logger, LoggerInstance } from '../logger'


type PluginParameter = (args?: any) => void

export interface PluginOptions {
    name?: string;
}


/**
 * Plugin class
 * @class Plugin
 */
export class Plugin {
    name?: string;
    logCb: PluginParameter | null;
    warnCb: PluginParameter | null;
    infoCb: PluginParameter | null;
    errorCb: PluginParameter | null;

    constructor(options: PluginOptions = {}) {

        this.name = options.name

        this.logCb = null
        this.infoCb = null
        this.warnCb = null
        this.errorCb = null
    }

    /**
     * Link plugin to logger
     * @param {LoggerInstance} loggerInstance
     */
    link(loggerInstance: LoggerInstance) {
        const isLoggerInstance = loggerInstance instanceof Logger

        if (!isLoggerInstance) {
            throw new Error('Only logger instances can be linked to plugins')
        }

        loggerInstance.on('logger-log', (d) => {
            if (this.logCb) {
                this.logCb(d)
            }
        })

        loggerInstance.on('logger-warn', (d) => {
            if (this.warnCb) {
                this.warnCb(d)
            }
        })

        loggerInstance.on('logger-info', (d) => {
            if (this.infoCb) {
                this.infoCb(d)
            }
        })

        loggerInstance.on('logger-error', (d) => {
            if (this.errorCb) {
                this.errorCb(d)
            }
        })
    }

    /**
     * Assign log callback
     * @param {PluginParameter} cb Log Callback
     */
    log(cb: PluginParameter) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function')
        }

        this.logCb = cb
    }

    /**
     * Assign info callback
     * @param {PluginParameter} cb Info callback
     */
    info(cb: PluginParameter) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function')
        }
        this.infoCb = cb
    }

    /**
     * Assign warning callback
     * @param {PluginParameter} cb Warning callback
     */
    warn(cb: PluginParameter) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function')
        }
        this.warnCb = cb
    }

    /**
     * Assign error callback
     * @param {PluginParameter} cb Error callback
     */
    error(cb: PluginParameter) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function')
        }

        this.errorCb = cb
    }
}