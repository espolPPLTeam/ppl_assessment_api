const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const responses = require('../../config/responses')

const Controller = require('./secciones.controller')({ db })

module.exports = (app) => {
  // CRUD BASICO

  // Obtener todos
  app
    .route('/secciones')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/secciones/:seccionesId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.seccionesId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  app.route('/secciones')
    .post(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'CREAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Crear(req.body)
      return res.status(resp.codigoEstado).send(resp)
    })

  // Actualizar
  app.route('/secciones/:seccionesId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.seccionesId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/secciones/:seccionesId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.seccionesId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // APIs especiales

  // anadir una pregunta
  app.route('/secciones/:seccionesId/preguntas/:preguntasId')
    .put(async (req, res) => {
      let resp = await Controller.AnadirPregunta(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar una pregunta
  app.route('/secciones/:seccionesId/preguntas/:preguntasId')
    .delete(async (req, res) => {
      let resp = await Controller.EliminarPregunta(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })
}
