"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTime = exports.throttle = exports.collapse = void 0;
var tslib_1 = require("tslib");
var replacer = function (key, value) {
    switch (true) {
        // case typeof value === 'string': {
        //   return value
        // }
        // case typeof value === 'number': {
        //   return value
        // }
        default:
            return value;
    }
};
/**
 * Parse object into readable format
 * @param {Object} data
 * @returns {String}
 */
var handleObject = function (data) {
    return JSON.stringify(data, replacer, '\t');
};
/**
 * Parse error into readable format
 * @param {Error} error
 * @returns {String}
 */
var handleError = function (error, showStack) {
    var _a = error.name, name = _a === void 0 ? '' : _a, _b = error.message, message = _b === void 0 ? '' : _b, stack = error.stack;
    var collapsed = {
        name: name,
        message: message,
        stack: stack
    };
    if (!showStack) {
        delete collapsed.stack;
    }
    return handleObject(collapsed);
};
var collapse = function (data, options) {
    var composed = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var entry = data_1[_i];
        switch (true) {
            case entry instanceof Error: {
                composed.push(handleError(entry, options.showErrorStack));
                break;
            }
            case typeof entry === 'object': {
                composed.push(handleObject(entry));
                break;
            }
            default: {
                composed.push(entry);
                break;
            }
        }
    }
    return composed.join('\n');
};
exports.collapse = collapse;
/**
 * Get current time
 * @returns {Object} time
 * @returns {int} time.hours Current hour
 * @returns {int} time.minutes Current minute
 * @returns {int} time.seconds Current second
 * @returns {int} time.milliseconds Current milliseconds
 */
var parseTime = function () {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds
    };
};
exports.parseTime = parseTime;
// Throttle queue implementation https://www.collegestash.com/throttling-using-queue/
/**
 * Throttle Queue
 * @param {function} fn Function call
 * @param {Number} delay Throttle delay
 * @returns {function}
 */
var throttle = function (fn, delay) {
    if (isNaN(delay)) {
        throw new Error('Delay must be a number');
    }
    var timeout = null;
    var nodelay = true;
    var queue = [];
    var start = function () {
        if (queue.length) {
            var first = queue.shift();
            if (first) {
                fn.apply(first.context, first.arguments);
            }
            timeout = setTimeout(start, delay);
        }
        else {
            nodelay = true;
        }
    };
    var ret = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        queue.push({
            context: _this,
            arguments: (0, tslib_1.__spreadArray)([], rest, true)
        });
        if (nodelay) {
            nodelay = false;
            start();
        }
    };
    ret.reset = function () {
        if (timeout) {
            clearTimeout(timeout);
        }
        queue = [];
    };
    return ret;
};
exports.throttle = throttle;
