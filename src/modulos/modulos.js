const express = require('express')
const app = express()
const { validarRequest } = require('../config/utils')
const db = require('../config/db').modelos()
const responses = require('../config/responses')

require('./materias/materias.routes')(app)
require('./paralelos/paralelos.routes')(app)
require('./estudiantes/estudiantes.routes')(app)
require('./profesores/profesores.routes')(app)
require('./grupos/grupos.routes')(app)
require('./capitulos/capitulos.routes')(app)
require('./secciones/secciones.routes')(app)
require('./preguntas/preguntas.routes')(app, db, validarRequest, responses)

app.route('*')
  .get((req, res) => {
    res.json({ estado: false, datos: 'Esta ruta no existe' })
  })

module.exports = app
