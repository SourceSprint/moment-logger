const chalk = require('chalk')
const moment = require('moment')

const parseTime = () => chalk.gray.dim(`[${moment().format('HH:mm:ss')}]`)
const display = (data) => console.log(data)

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
