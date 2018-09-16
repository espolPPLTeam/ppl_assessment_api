const winston = require('winston')
const { format, transports } = winston
const { combine, timestamp, printf } = format
const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})
let transportsFiles = []
if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'development') {
  transportsFiles = [
    new winston.transports.File({ filename: 'error.ppl.log', level: 'error' }),
    new winston.transports.File({ filename: 'debug.ppl.log', level: 'info' })
  ]
}

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: transportsFiles,
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.ppl.log' })
  ]
})

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing' && !process.env.TDD) {
  logger.add(new winston.transports.Console({
    format: combine(
      timestamp(),
      myFormat
    )
  }))
}

module.exports = logger
