const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const responses = require('../../config/responses')

const Controller = require('./profesores.controller')({ db })

module.exports = (app) => {
  // CRUD BASICO

  // Obtener todos
  app
    .route('/profesores')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/profesores/:profesoresId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.profesoresId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  // Esto esta implementado en el modulo ppl_login
  // o puede que si sea implementado aqui, no lo se

  // Actualizar
  app.route('/profesores/:profesoresId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.profesoresId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/profesores/:profesoresId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.profesoresId })
      return res.status(resp.codigoEstado).send(resp)
    })
  /*

    GET /profesores/:profesoresId/paralelos | obtener los paralelos de un profesor, ver bien que se enviara
  */
}
