const { validarRequest } = require('../../config/utils')
const db = require('../../config/db').modelos()
const schema = require('./schema')
const Controller = require('./materias.controller')({ db })
const responses = require('../../config/responses')

module.exports = (app) => {
  app.route('/materias')
    .post(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'CREAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let { nombre, codigo } = req.body
      let resp = await Controller.Crear({ nombre, codigo })
      return res.status(resp.codigoEstado).send(resp)
    })

  app
    .route('/materias')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })
}
