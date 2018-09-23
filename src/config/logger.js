const winston = require('winston')
const { format, transports } = winston
const { combine, timestamp, printf } = format
const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})
let transportsFiles = []
let exceptionHandlersFiles = []
if (process.env.NODE_ENV === 'production') {
  transportsFiles = [
    new winston.transports.File({ filename: 'error.api.ppl.log', level: 'error' }),
    new winston.transports.File({ filename: 'debug.api.ppl.log', level: 'info' })
  ]

  exceptionHandlersFiles = [
    new transports.File({ filename: 'exceptions.api.ppl.log' })
  ]
}

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: transportsFiles,
  exceptionHandlers: exceptionHandlersFiles
})

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: combine(
      timestamp(),
      myFormat
    )
  }))
}

module.exports = logger
