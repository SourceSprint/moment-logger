import { Logger } from './logger'


export * from './logger'
export * from './plugin'


function createLogger() {
  return new Logger()
}


export default createLogger()
