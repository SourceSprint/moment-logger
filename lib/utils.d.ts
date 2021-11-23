interface CollapseOptions {
    showErrorStack?: boolean;
}
declare const collapse: (data: Array<Error | Object>, options: CollapseOptions) => string;
interface TimeObject {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
/**
 * Get current time
 * @returns {Object} time
 * @returns {int} time.hours Current hour
 * @returns {int} time.minutes Current minute
 * @returns {int} time.seconds Current second
 * @returns {int} time.milliseconds Current milliseconds
 */
declare const parseTime: () => TimeObject;
/**
 * Throttle Queue
 * @param {function} fn Function call
 * @param {Number} delay Throttle delay
 * @returns {function}
 */
declare const throttle: (fn: Function, delay: number) => {
    (...rest: Array<any>): void;
    reset(): void;
};
export { collapse, throttle, parseTime };
//# sourceMappingURL=utils.d.ts.map