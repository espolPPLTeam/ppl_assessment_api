const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const responses = require('../../config/responses')

const Controller = require('./grupos.controller')({ db })

module.exports = (app) => {
  // CRUD BASICO

  // Obtener todos
  app.route('/grupos')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Buscar por ID
  app.route('/grupos/:idGrupo')
    .get(async (req, res) => {
      const idGrupo = req.params.idGrupo
      let resp = await Controller.ObtenerPorId(idGrupo)
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
  app.route('/grupos/:idGrupo')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      const idGrupo = req.params.idGrupo
      const nombre = req.body.nombre
      let resp = await Controller.Actualizar(idGrupo, nombre)
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/grupos/:idGrupo')
    .delete(async (req, res) => {
      const idGrupo = req.params.idGrupo
      let resp = await Controller.Eliminar(idGrupo)
      return res.status(resp.codigoEstado).send(resp)
    })

  // API ESPECIALES

  // anadir un estudiante a un grupo
  app.route('/grupos/:idGrupo/estudiante/')
    .put(async (req, res) => {
      const idGrupo = req.params.idGrupo
      const idEstudiante = req.body.idEstudiante
      const idParalelo = req.body.idParalelo
      let resp = await Controller.AnadirEstudiante(idGrupo, idEstudiante, idParalelo)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar un estudiante de un grupo
  /*app.route('/grupos/:idGrupo/estudiantes/:idEstudiante')
    .delete(async (req, res) => {
      const idGrupo = req.params.idGrupo
      const idEstudiante = req.body.idEstudiante
      let resp = await Controller.EliminarEstudiante(req.params.idGrupo, req.params.idEstudiante)
      return res.status(resp.codigoEstado).send(resp)
    })*/

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
