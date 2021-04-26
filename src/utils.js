const replacer = (key, value) => {
  return value
}

const handleObject = (data) => {
  return `${typeof data}\n${JSON.stringify(data, replacer, '\t')}`
}

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

const parseTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return { hours, minutes, seconds, milliseconds }
}

module.exports = {
  parseTime,
  collapse
}
