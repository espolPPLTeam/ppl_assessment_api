const express = require('express')
const app = express()

require('./materias/materias.routes')(app)

app.route('*')
  .get((req, res) => {
    res.json({ estado: false, datos: 'Esta ruta no existe' })
  })

module.exports = app
