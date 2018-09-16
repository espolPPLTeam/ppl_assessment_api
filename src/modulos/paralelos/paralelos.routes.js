const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const Controller = require('./paralelos.controller')({ db })
const responses = require('../../config/responses')

module.exports = (app) => {
  // CRUD BASICO

  // Obtener todos
  app
    .route('/paralelos')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/paralelos/:paralelosId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.paralelosId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  app.route('/paralelos')
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
  app.route('/paralelos/:paralelosId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.paralelosId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/paralelos/:paralelosId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.paralelosId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // ACCIONES ESPECIALES

  // =================================================
  // Estudiantes
  // anadir un estudiante del paralelo
  app.route('/paralelos/:paralelosId/estudiantes/:estudiantesId')
    .put(async (req, res) => {
      let resp = await Controller.AnadirEstudiante(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar un estudiante del paralelo
  app.route('/paralelos/:paralelosId/estudiantes/:estudiantesId')
    .delete(async (req, res) => {
      let resp = await Controller.EliminarEstudiante(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // =================================================
  // Profesores
  // anadir un profesor del paralelo
  app.route('/paralelos/:paralelosId/profesores/:profesoresId')
    .put(async (req, res) => {
      let resp = await Controller.AnadirProfesor(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar un profesor del paralelo
  app.route('/paralelos/:paralelosId/profesores/:profesoresId')
    .delete(async (req, res) => {
      let resp = await Controller.EliminarProfesor(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // =================================================
  // Grupos
  // anadir un grupo del paralelo
  app.route('/paralelos/:paralelosId/grupos/:gruposId')
    .put(async (req, res) => {
      let resp = await Controller.AnadirGrupo(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar un grupo del paralelo
  app.route('/paralelos/:paralelosId/grupos/:gruposId')
    .delete(async (req, res) => {
      let resp = await Controller.EliminarGrupo(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })
}
