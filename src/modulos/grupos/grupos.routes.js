const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const responses = require('../../config/responses')

const Controller = require('./grupos.controller')({ db })

module.exports = (app) => {
  // CRUD BASICO

  // Obtener todos
  app
    .route('/grupos')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/grupos/:gruposId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.gruposId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  app.route('/grupos')
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
  app.route('/grupos/:gruposId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.gruposId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/grupos/:gruposId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.gruposId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // API ESPECIALES

  // anadir un estudiante a un grupo
  app.route('/grupos/:gruposId/estudiantes/:estudiantesId')
    .put(async (req, res) => {
      let resp = await Controller.AnadirEstudiante(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar un estudiante de un grupo
  app.route('/grupos/:gruposId/estudiantes/:estudiantesId')
    .delete(async (req, res) => {
      let resp = await Controller.EliminarEstudiante(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // GETs customizados de acuerdo al front

  // GET /grupos/paralelos/:paralelosId | obtener todos los grupos de un paralelo

  // GET /grupos/estudiantes/:estudiantesId | obtener los grupos de un estudiante

  // GET /grupos/estudiantes/:estudiantesId/paralelos/:paralelosId | obtener el grupo de un estudiante dado tambien el paralelo

  // POST
  app.route('/grupos/bulkCreate')
    .post(async (req, res) => {
      let resp = await Controller.BulkCreate(req.body)
      return res.status(resp.codigoEstado).send(resp)
    })

}
