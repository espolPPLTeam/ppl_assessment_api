module.exports = (app, db, validarRequest, responses) => {
  const schema = require('./schema')
  const Controller = require('./preguntas.controller')({ db })
  // CRUD BASICO

  // Obtener todos
  app
    .route('/preguntas')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/preguntas/:preguntasId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.preguntasId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  app.route('/preguntas')
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
  app.route('/preguntas/:preguntasId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.preguntasId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/preguntas/:preguntasId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.preguntasId })
      return res.status(resp.codigoEstado).send(resp)
    })
}
