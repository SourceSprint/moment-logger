/// <reference types="node" />
import Events from 'events';
interface LoggerOptions {
    prefix?: string;
    suffix?: string;
    noType?: boolean;
    noTimestamp?: boolean;
    pluginPassthrough?: boolean;
    pluginThrottle?: number;
    showErrorStack?: boolean;
}
/**
 * Logger
 * @class Logger
 */
declare class Logger extends Events {
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
    constructor(config?: LoggerOptions);
    get options(): LoggerOptions;
    get collapseOptions(): {
        showErrorStack: boolean;
    };
    log(): string;
    warn(): string;
    /**
     *  Display message with information format with timestamp
     * @param  {...any} data
     * @returns {String}
     */
    info(): string;
    /**
     * Display message with error format with timestamp
     * @param  {...any} data
     * @returns {String}
     */
    error(): string;
    /**
     * Display a message with only timestamp
     * @param  {...any} data
     * @returns {String}
     */
    blank(): string;
    /**
     *  Clears the console
     * @returns {String}
     */
    clear(): string;
    /**
     * Wait for input
     * @returns {String}
     */
    pause(): string;
}
/**
 * Plugin class
 * @class Plugin
 */
declare class Plugin {
    name: string;
    logCb: Function;
    warnCb: Function;
    infoCb: Function;
    errorCb: Function;
    constructor({ name }?: {
        name?: string | undefined;
    });
    /**
     * Link plugin to logger
     * @param {Logger} loggerInstance
     */
    link(loggerInstance: Logger): void;
    /**
     * Assign log callback
     * @param {function} cb Log Callback
     */
    log(cb: Function): void;
    /**
     * Assign info callback
     * @param {function} cb Info callback
     */
    info(cb: Function): void;
    /**
     * Assign warning callback
     * @param {function} cb Warning callback
     */
    warn(cb: Function): void;
    /**
     * Assign error callback
     * @param {function} cb Error callback
     */
    error(cb: Function): void;
}
declare const _default: {
    Plugin: typeof Plugin;
    Logger: typeof Logger;
    pause: () => string;
    log: () => string;
    info: () => string;
    warn: () => string;
    error: () => string;
    blank: () => string;
};
export default _default;
//# sourceMappingURL=index.d.ts.map