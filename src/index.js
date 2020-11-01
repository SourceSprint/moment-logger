const chalk = require('chalk')

const parseTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return chalk.gray.dim(`[${hours}:${minutes}:${seconds}:${milliseconds}]`)
}

const display = (message) => process.stdout.write(message)

const operations = {
  log(message) {
    const escapedMessage =
      typeof message == 'object' ? JSON.stringify(message) : message
    const formattedMessage = `${parseTime()} ${chalk.gray(escapedMessage)}`
    display(formattedMessage)
  },
  warn(message) {
    const escapedMessage =
      typeof message == 'object' ? JSON.stringify(message) : message
    const formattedMessage = `${parseTime()} ${chalk.magenta(escapedMessage)}`
    display(formattedMessage)
  },
  info(message) {
    const escapedMessage =
      typeof message == 'object' ? JSON.stringify(message) : message
    const formattedMessage = `${parseTime()} ${chalk.blue(escapedMessage)}`
    display(formattedMessage)
  },
  error(message) {
    const escapedMessage =
      typeof message == 'object' ? JSON.stringify(message) : message
    const formattedMessage = `${parseTime()} ${chalk.red(escapedMessage)}`
    display(formattedMessage)
  },
  blank(message) {
    const escapedMessage =
      typeof message == 'object' ? JSON.stringify(message) : message
    const formattedMessage = `${parseTime()} ${chalk.gray.dim(escapedMessage)}`
    display(formattedMessage)
  }
}

module.exports = operations
