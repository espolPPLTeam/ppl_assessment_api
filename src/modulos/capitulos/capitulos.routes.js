module.exports = (app, db, validarRequest, responses, logger) => {
  const schema = require('./schema')
  const Controller = require('./capitulos.controller')({ db, logger })
  // CRUD BASICO

  // Obtener todos
  app
    .route('/capitulos')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/capitulos/:capitulosId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.capitulosId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  app.route('/capitulos')
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
  app.route('/capitulos/:capitulosId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.capitulosId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/capitulos/:capitulosId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.capitulosId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // APIs especiales

  // anadir una seccion a un capitulo
  app.route('/capitulos/:capitulosId/secciones/:seccionesId')
    .put(async (req, res) => {
      let resp = await Controller.AnadirSeccion(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar una seccion a un capitulo
  app.route('/capitulos/:capitulosId/secciones/:seccionesId')
    .delete(async (req, res) => {
      let resp = await Controller.EliminarSeccion(req.params)
      return res.status(resp.codigoEstado).send(resp)
    })

  /*
    GET /capitulos/materias/:materiasId | obtener los capitulos de una materia
  */
}
