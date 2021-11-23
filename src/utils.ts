const replacer = (key: string, value: any) => {
  switch (true) {
    // case typeof value === 'string': {
    //   return value
    // }

    // case typeof value === 'number': {
    //   return value
    // }

    default:
      return value
  }

}

/**
 * Parse object into readable format
 * @param {Object} data
 * @returns {String}
 */


const handleObject = (data: Object): string => {
  return JSON.stringify(data, replacer, '\t')
}

interface CollapsedError {
  name: string;
  message: string;
  stack?: string;
}

/**
 * Parse error into readable format
 * @param {Error} error
 * @returns {String}
 */
const handleError = (error: Error, showStack: boolean | undefined) => {
  const { name = '', message = '', stack } = error

  const collapsed: CollapsedError = {
    name,
    message,
    stack
  }

  if (!showStack) {
    delete collapsed.stack
  }

  return handleObject(collapsed) as string
}

interface CollapseOptions {
  showErrorStack?: boolean
}


const collapse = (data: Array<Error | Object>, options: CollapseOptions) => {
  let composed = []


  for (let entry of data) {

    switch (true) {
      case entry instanceof Error: {

        composed.push(handleError(entry as Error, options.showErrorStack))
        break;
      }

      case typeof entry === 'object': {

        composed.push(handleObject(entry))
        break

      }

      default: {

        composed.push(entry)
        break;
      }
    }

  }

  return composed.join('\n')
}


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
const parseTime = () => {
  const date = new Date()

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return <TimeObject>{
    hours,
    minutes,
    seconds,
    milliseconds
  }
}


interface QueueArguments {
  context: any;
  arguments: Array<any>;
}

// Throttle queue implementation https://www.collegestash.com/throttling-using-queue/

/**
 * Throttle Queue
 * @param {function} fn Function call
 * @param {Number} delay Throttle delay
 * @returns {function}
 */
const throttle = (fn: Function, delay: number) => {
  if (isNaN(delay)) {
    throw new Error('Delay must be a number')
  }

  let timeout: ReturnType<typeof setTimeout> | null = null
  let nodelay: boolean = true
  let queue: Array<QueueArguments> = []

  const start = () => {
    if (queue.length) {
      const first = queue.shift()

      if (first) {
        fn.apply(first.context, first.arguments)
      }


      timeout = setTimeout(start, delay)
    } else {
      nodelay = true
    }
  }

  const ret = (...rest: Array<any>) => {
    queue.push({
      context: this,
      arguments: [...rest]
    })

    if (nodelay) {
      nodelay = false
      start()
    }
  }

  ret.reset = () => {
    if (timeout) {
      clearTimeout(timeout)
    }


    queue = []
  }

  return ret
}

export {
  collapse,
  throttle,
  parseTime
}
