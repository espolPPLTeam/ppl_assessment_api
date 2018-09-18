const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const responses = require('../../config/responses')

const Controller = require('./estudiantes.controller')({ db })

module.exports = (app) => {
  // CRUD BASICO

  // Obtener todos
  app
    .route('/estudiantes')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/estudiantes/:estudiantesId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.estudiantesId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  // Esto esta implementado en el modulo ppl_login
  // o puede que si sea implementado aqui, no lo se

  // Actualizar
  app.route('/estudiantes/:estudiantesId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.estudiantesId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/estudiantes/:estudiantesId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.estudiantesId })
      return res.status(resp.codigoEstado).send(resp)
    })

  /*
    NOTAS:

    GET /estudiantes/:estudiantesId/paralelos | obtener el paralelo de un estudiante?, que datos requerira aqui?
    // en la api vieja calificar leccion estaba aqui, en este modelo
    // Estaba
    hecho que cada estudiante tenia una lista de leccion y ahi se ingresaba la calificacion en el array de json
  */
}
