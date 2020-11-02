const parseTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return { hours, minutes, seconds, milliseconds }
}

const handleObject = (data) => {
  return JSON.stringify(data)
}

const stringify = (data) => {
  let composed = []
  for (let entry of data) {
    const isObject = typeof entry === 'object'

    if (isObject) {
      composed.push(handleObject(entry))
    } else {
      composed.push(entry)
    }
  }

  return composed.join('\n')
}

module.exports = {
  parseTime,
  stringify
}
