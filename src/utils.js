const parseTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return { hours, minutes, seconds, milliseconds }
}

const handleObject = (data) => {
  return `${typeof data}\n${JSON.stringify(data, null, '\t')}`
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

module.exports = {
  parseTime,
  collapse
}
