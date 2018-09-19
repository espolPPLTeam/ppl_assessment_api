const express = require('express')
const app = express()

require('./materias/materias.routes')(app)
require('./paralelos/paralelos.routes')(app)
require('./estudiantes/estudiantes.routes')(app)
require('./profesores/profesores.routes')(app)
require('./grupos/grupos.routes')(app)

app.route('*')
  .get((req, res) => {
    res.json({ estado: false, datos: 'Esta ruta no existe' })
  })

module.exports = app
