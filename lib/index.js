"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
var events_1 = (0, tslib_1.__importDefault)(require("events"));
var utils_1 = require("./utils");
var LogTypes;
(function (LogTypes) {
    LogTypes["LOG"] = "log";
    LogTypes["INFO"] = "info";
    LogTypes["WARN"] = "warn";
    LogTypes["ERROR"] = "error";
    LogTypes["BLANK"] = "blank";
})(LogTypes || (LogTypes = {}));
var ConsoleTypes;
(function (ConsoleTypes) {
    ConsoleTypes["LOG"] = "log";
    ConsoleTypes["ERROR"] = "error";
})(ConsoleTypes || (ConsoleTypes = {}));
var Environments;
(function (Environments) {
    Environments["BROWSER"] = "browser";
    Environments["NODE"] = "node";
})(Environments || (Environments = {}));
var DEFAULTS = {
    environment: typeof process != 'undefined' ? Environments.NODE : Environments.BROWSER
};
/**
 * Pad string
 * @param {String} [x=''] String to pad
 * @param {*} [a=0] Amount of padding
 * @returns {String}
 */
var pad = function (x, a) {
    if (x === void 0) { x = ''; }
    if (a === void 0) { a = 0; }
    return "".concat(x).padStart(a, '0');
};
/**
 * Format message
 * @param {String} prefix Message prefix
 * @param {String} message Composed message
 * @param {String} suffix Message suffix
 * @param {Boolean} noTimestamp Hide timestamp
 * @returns {String}
 */
var format = function (prefix, message, suffix, noTimestamp) {
    var _a = (0, utils_1.parseTime)(), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds, milliseconds = _a.milliseconds;
    var parsed = [
        { value: hours, padding: 2 },
        { value: minutes, padding: 2 },
        { value: seconds, padding: 2 },
        { value: milliseconds, padding: 3 }
    ]
        .map(function (_a) {
        var value = _a.value, padding = _a.padding;
        return pad(value, padding);
    })
        .join(':');
    var padded = parsed.padEnd(20 - parsed.length);
    var composed = "".concat(prefix, " ").concat(message, " ").concat(suffix).trim();
    if (noTimestamp) {
        return composed;
    }
    var timestamp = chalk_1.default.gray.dim(padded);
    return "".concat(timestamp, " ").concat(composed);
};
var toConsole = function (m, mode) {
    var mockProcess = {
        stdout: {
            write: function (x) { return console.log(x); }
        },
        stderr: {
            write: function (x) { return console.error(x); }
        }
    };
    var output = DEFAULTS.environment == Environments.NODE ? process : mockProcess;
    if (mode == ConsoleTypes.LOG) {
        m.split('\n').forEach(function (x) { return output.stdout.write(x + '\n'); });
    }
    if (mode == ConsoleTypes.ERROR) {
        var escaped = m.replace(/\\n/g, '\n\t\t');
        escaped.split('\n').forEach(function (x) { return output.stderr.write(x + '\n'); });
    }
};
var display = function (payload) {
    if (typeof payload == 'string') {
        toConsole(payload, ConsoleTypes.LOG);
        return payload;
    }
    var _a = payload, end = _a.end, type = _a.type, start = _a.start, _b = _a.prefix, prefix = _b === void 0 ? '' : _b, _c = _a.suffix, suffix = _c === void 0 ? '' : _c, _d = _a.message, message = _d === void 0 ? '' : _d, _e = _a.noType, noType = _e === void 0 ? false : _e, _f = _a.noTimestamp, noTimestamp = _f === void 0 ? false : _f, _g = _a.modifier, modifier = _g === void 0 ? function (x) { return x; } : _g;
    var body = format(prefix, message, suffix, noTimestamp);
    var header = '';
    var isBlank = type == LogTypes.BLANK;
    var isError = type == LogTypes.ERROR;
    if (!isBlank && !noType) {
        var castedType = type.toString();
        header = modifier(castedType.padStart(start).padEnd(end).toLocaleUpperCase());
    }
    var data = "".concat(header, " ").concat(body);
    if (isError) {
        toConsole(data, ConsoleTypes.ERROR);
    }
    else {
        toConsole(data, ConsoleTypes.LOG);
    }
    return data;
};
/**
 * Logger
 * @class Logger
 */
var Logger = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Logger, _super);
    function Logger(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.setMaxListeners(0);
        _this.prefix = config.prefix || '';
        _this.suffix = config.suffix || '';
        _this.noType = config.noType || false;
        _this.noTimestamp = config.noTimestamp || false;
        _this.showErrorStack = config.showErrorStack || false;
        _this.pluginPassthrough = config.pluginPassthrough || false;
        _this.pluginThrottle = config.pluginThrottle || 0;
        return _this;
    }
    Object.defineProperty(Logger.prototype, "options", {
        get: function () {
            return {
                noType: this.noType,
                prefix: this.prefix,
                suffix: this.suffix,
                noTimestamp: this.noTimestamp,
                showErrorStack: this.showErrorStack,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "collapseOptions", {
        get: function () {
            return {
                showErrorStack: this.showErrorStack
            };
        },
        enumerable: false,
        configurable: true
    });
    Logger.prototype.log = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var message = (0, utils_1.collapse)(args, this.collapseOptions);
        var payload = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.options), { type: LogTypes.LOG, start: 6, end: 10, modifier: chalk_1.default.white.bgGray.bold, message: message });
        var feedback = function (m) { _this.emit('logger-log', m); };
        var feedback_ = feedback;
        if (this.pluginThrottle) {
            feedback_ = (0, utils_1.throttle)(feedback, this.pluginThrottle);
        }
        if (this.pluginPassthrough) {
            feedback_(args);
        }
        else {
            feedback_(message);
        }
        return display(payload);
    };
    Logger.prototype.warn = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var message = (0, utils_1.collapse)(args, this.collapseOptions);
        var payload = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.options), { type: LogTypes.WARN, start: 7, end: 10, modifier: chalk_1.default.white.bgHex('#ffa500').bold, message: message });
        var feedback = function (m) { _this.emit('logger-warn', m); };
        var feedback_ = feedback;
        if (this.pluginThrottle) {
            feedback_ = (0, utils_1.throttle)(feedback, this.pluginThrottle);
        }
        if (this.pluginPassthrough) {
            feedback_(args);
        }
        else {
            feedback_(message);
        }
        return display(payload);
    };
    /**
     *  Display message with information format with timestamp
     * @param  {...any} data
     * @returns {String}
     */
    Logger.prototype.info = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var message = (0, utils_1.collapse)(args, this.collapseOptions);
        var payload = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.options), { type: LogTypes.INFO, start: 7, end: 10, modifier: chalk_1.default.white.bgBlue.bold, message: message });
        var feedback = function (m) { _this.emit('logger-info', m); };
        var feedback_ = feedback;
        if (this.pluginThrottle) {
            feedback_ = (0, utils_1.throttle)(feedback, this.pluginThrottle);
        }
        if (this.pluginPassthrough) {
            feedback_(args);
        }
        else {
            feedback_(message);
        }
        return display(payload);
    };
    /**
     * Display message with error format with timestamp
     * @param  {...any} data
     * @returns {String}
     */
    Logger.prototype.error = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var message = (0, utils_1.collapse)(args, this.collapseOptions);
        var payload = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.options), { type: LogTypes.ERROR, start: 8, end: 10, modifier: chalk_1.default.white.bgRed.bold, message: message });
        var feedback = function (m) { _this.emit('logger-error', m); };
        var feedback_ = feedback;
        if (this.pluginThrottle) {
            feedback_ = (0, utils_1.throttle)(feedback, this.pluginThrottle);
        }
        if (this.pluginPassthrough) {
            feedback_(args);
        }
        else {
            feedback_(message);
        }
        return display(payload);
    };
    /**
     * Display a message with only timestamp
     * @param  {...any} data
     * @returns {String}
     */
    Logger.prototype.blank = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var message = (0, utils_1.collapse)(args, this.collapseOptions);
        var payload = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.options), { type: LogTypes.BLANK, start: 8, end: 10, modifier: chalk_1.default.white.bgGray.dim, message: message });
        var feedback = function (m) { _this.emit('logger-blank', m); };
        var feedback_ = feedback;
        if (this.pluginThrottle) {
            feedback_ = (0, utils_1.throttle)(feedback, this.pluginThrottle);
        }
        if (this.pluginPassthrough) {
            feedback_(args);
        }
        else {
            feedback_(message);
        }
        return display(payload);
    };
    /**
     *  Clears the console
     * @returns {String}
     */
    Logger.prototype.clear = function () {
        this.emit('logger-clear');
        return display('\x1Bc');
    };
    /**
     * Wait for input
     * @returns {String}
     */
    Logger.prototype.pause = function () {
        if (DEFAULTS.environment === Environments.BROWSER) {
            throw new Error('Pause is not supported in browser environment');
        }
        if (DEFAULTS.environment === Environments.NODE) {
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(true);
            }
            process.stdin.resume();
            process.stdin.on('data', process.exit.bind(process, 0));
        }
        return '';
    };
    return Logger;
}(events_1.default));
/**
 * Plugin class
 * @class Plugin
 */
var Plugin = /** @class */ (function () {
    function Plugin(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.name, name = _c === void 0 ? '' : _c;
        this.name = name;
        this.logCb = function () { };
        this.infoCb = function () { };
        this.warnCb = function () { };
        this.errorCb = function () { };
    }
    /**
     * Link plugin to logger
     * @param {Logger} loggerInstance
     */
    Plugin.prototype.link = function (loggerInstance) {
        var _this = this;
        var isLoggerInstance = loggerInstance instanceof Logger;
        if (!isLoggerInstance) {
            throw new Error('Only logger instances can be linked to plugins');
        }
        loggerInstance.on('logger-log', function (d) { return (_this.logCb ? _this.logCb(d) : null); });
        loggerInstance.on('logger-warn', function (d) {
            return _this.warnCb ? _this.warnCb(d) : null;
        });
        loggerInstance.on('logger-info', function (d) {
            return _this.infoCb ? _this.infoCb(d) : null;
        });
        loggerInstance.on('logger-error', function (d) {
            return _this.errorCb ? _this.errorCb(d) : null;
        });
    };
    /**
     * Assign log callback
     * @param {function} cb Log Callback
     */
    Plugin.prototype.log = function (cb) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function');
        }
        this.logCb = cb;
    };
    /**
     * Assign info callback
     * @param {function} cb Info callback
     */
    Plugin.prototype.info = function (cb) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function');
        }
        this.infoCb = cb;
    };
    /**
     * Assign warning callback
     * @param {function} cb Warning callback
     */
    Plugin.prototype.warn = function (cb) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function');
        }
        this.warnCb = cb;
    };
    /**
     * Assign error callback
     * @param {function} cb Error callback
     */
    Plugin.prototype.error = function (cb) {
        if (typeof cb !== 'function') {
            throw new Error('Callback has to be a function');
        }
        this.errorCb = cb;
    };
    return Plugin;
}());
var l = new Logger();
exports.default = {
    Plugin: Plugin,
    Logger: Logger,
    pause: l.pause.bind(l),
    log: l.log.bind(l),
    info: l.info.bind(l),
    warn: l.warn.bind(l),
    error: l.error.bind(l),
    blank: l.blank.bind(l)
};
