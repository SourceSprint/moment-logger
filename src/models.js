class LogTypes {
  constructor(name) {
    this.name = name
  }

  toString() {
    return `${this.name}`
  }

  static warn() {
    return new LogTypes('warn')
  }

  static log() {
    return new LogTypes('log')
  }

  static info() {
    return new LogTypes('info')
  }

  static error() {
    return new LogTypes('error')
  }

  static blank() {
    return new LogTypes('blank')
  }
}

module.exports = {
  LogTypes
}
