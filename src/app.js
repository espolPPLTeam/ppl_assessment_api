process.on('uncaughtException', (err) => {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(compression())

// rutas api
const modulos = require('./modulos/modulos')
app.use('/api/ppl', modulos)

module.exports = app
