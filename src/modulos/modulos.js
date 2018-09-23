const express = require('express')
const app = express()
const { validarRequest } = require('../config/utils')
const db = require('../config/db').modelos()
const logger = require('../config/logger')
const responses = require('../config/responses')

require('./materias/materias.routes')(app, db, validarRequest, responses, logger)
require('./paralelos/paralelos.routes')(app, db, validarRequest, responses, logger)
require('./estudiantes/estudiantes.routes')(app, db, validarRequest, responses, logger)
require('./profesores/profesores.routes')(app, db, validarRequest, responses, logger)
require('./grupos/grupos.routes')(app, db, validarRequest, responses, logger)
require('./capitulos/capitulos.routes')(app, db, validarRequest, responses, logger)
require('./secciones/secciones.routes')(app, db, validarRequest, responses, logger)
require('./preguntas/preguntas.routes')(app, db, validarRequest, responses, logger)
require('./lecciones/lecciones.routes')(app, db, validarRequest, responses, logger)
require('./respuestas/respuestas.routes')(app, db, validarRequest, responses, logger)

app.route('*')
  .get((req, res) => {
    res.json({ estado: false, datos: 'Esta ruta no existe' })
  })

module.exports = app
