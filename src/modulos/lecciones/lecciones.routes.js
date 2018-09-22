module.exports = (app, db, validarRequest, responses) => {
  const Controller = require('./lecciones.controller')({ db })
  const schema = require('./schema')
  // CRUD BASICO

  // Obtener todos
  app
    .route('/lecciones')
    .get(async (req, res) => {
      let resp = await Controller.ObtenerTodos()
      res.status(resp.codigoEstado).send(resp)
    })

  // Obtener uno
  app
    .route('/lecciones/:leccionesId')
    .get(async (req, res) => {
      let resp = await Controller.Obtener({ id: req.params.leccionesId })
      res.status(resp.codigoEstado).send(resp)
    })

  // Crear
  app.route('/lecciones')
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
  app.route('/lecciones/:leccionesId')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.Actualizar({ ...req.body, id: req.params.leccionesId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // Eliminar
  app.route('/lecciones/:leccionesId')
    .delete(async (req, res) => {
      let resp = await Controller.Eliminar({ id: req.params.leccionesId })
      return res.status(resp.codigoEstado).send(resp)
    })

  // API ESPECIALES
  // anadir secciones
  // uso de query params para anadir secciones ej: /lecciones/:seccionesId/secciones?seccionesIds=seccion1,seccion2
  app.route('/lecciones/:leccionesId/secciones')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ELIMINAR_SECCIONES')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.AnadirSecciones({ leccionesId: req.params.leccionesId, seccionesIds: req.query.seccionesIds.split(',') })
      return res.status(resp.codigoEstado).send(resp)
    })

  // eliminar secciones
  // uso de query params para eliminar secciones ej: /lecciones/:seccionesId/secciones?seccionesIds=seccion1,seccion2
  app.route('/lecciones/:leccionesId/secciones')
    .delete(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'ELIMINAR_SECCIONES')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.EliminarSecciones({ leccionesId: req.params.leccionesId, seccionesIds: req.query.seccionesIds.split(',') })
      return res.status(resp.codigoEstado).send(resp)
    })
  /*
    // Una leccion deberia poder modificarse, una vez que ya fue tomada?
    // API ESPECIALES
    GET /lecciones/paralelos/:paralelosId  | obtener las lecciones de un paralelo
    GET /leciones/:leccionesId/estatisticas | estaditicas general
    GET /lecciones/:leccionesId/preguntas | estaditicas de una pregunta

    // esto hara una copia de la leccion en redis
    router.post('/tomar/:id_leccion', authApi.profesor, LeccionController.tomarLeccion); // <= DOCUMENTACION

    // en realtime se usaba esto, ver como cambiarlo, esto va en otro lado
    router.post('/comenzar_leccion/:id_leccion', authApi.profesor, LeccionController.comenzarLeccion) // <= DOCUMENTACION
    router.post('/:id_paralelo/estudiantes', authApi.profesor, LeccionController.habilitarEstudiantesCursoParaLeccion) // DOCUMENTACION
    router.post('/:id_leccion/mas_tiempo',authApi.profesor, LeccionController.anadirTiempo);
    router.post('/terminar_leccion', LeccionController.terminarLeccion);

    router.get('/detalle/:leccionId', LeccionController.detalleLeccion)????
  */
}
