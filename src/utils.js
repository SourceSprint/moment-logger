const replacer = (key, value) => {
  return value
}

/**
 * Parse object into readable format
 * @param {Object} data
 * @returns {String}
 */
const handleObject = (data) => {
  return `${typeof data}\n${JSON.stringify(data, replacer, '\t')}`
}

/**
 * Parse error into readable format
 * @param {Error} error
 * @returns {String}
 */
const handleError = (error) => {
  const { name = '', message = '' } = error
  return handleObject({ name, message })
}

const collapse = (data) => {
  let composed = []
  for (let entry of data) {
    const isError = entry instanceof Error

    const isObject = typeof entry === 'object'

    if (isError) {
      composed.push(handleError(entry))
    } else if (isObject) {
      composed.push(handleObject(entry))
    } else {
      composed.push(entry)
    }
  }

  return composed.join('\n')
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

  return { hours, minutes, seconds, milliseconds }
}

// Throttle queue implementation https://www.collegestash.com/throttling-using-queue/

/**
 * Throttle Queue
 * @param {function} fn Function call
 * @param {Number} delay Throttle delay
 * @returns {function}
 */
const throttle = (fn, delay) => {
  if (isNaN(delay)) {
    throw new Error('Delay must be a number')
  }

  let timeout = null
  let nodelay = true
  let queue = []

  const start = () => {
    if (queue.length) {
      const first = queue.shift()
      fn.apply(first.context, first.arguments)
      timeout = setTimeout(start, delay)
    } else {
      nodelay = true
    }
  }

  const ret = (...rest) => {
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
    clearTimeout(timeout)
    queue = []
  }
  return ret
}

module.exports = {
  collapse,
  throttle,
  parseTime
}
