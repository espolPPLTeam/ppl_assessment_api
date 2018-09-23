module.exports = (app, db, validarRequest, responses) => {
  const Controller = require('./respuestas.controller')({ db })
  const schema = require('./schema')

  // Crear o actualizar
  // Se hizo de esta forma porque muchas veces el estudiante quiere reeenviar
  // su respuesta y en la anterior api se tenian validaciones rara al tener
  // endpoints separados para actualizar y crear
  // Como diferenciar si creo o actualizo. 200 si actualizo y 201 si creo
  // Ej: /respuestas/crearOActualizar?id=respuesta1id
  app.route('/respuestas/crear/o/actualizar')
    .put(async (req, res) => {
      let [error, mensajeError] = validarRequest(schema, req, 'CREAR_O_ACTUALIZAR')
      if (error) {
        let resp = responses.NO_OK(mensajeError)
        return res.status(resp.codigoEstado).send(resp)
      }
      let resp = await Controller.ActualizarOCrear({ ...req.body, id: req.query.id })
      return res.status(resp.codigoEstado).send(resp)
    })

  /*
    // Aqui esta algo raro, esto tambien lo usara el microservicio realtime, al momento que el estudiante actualiza la pagina esto debe cargarse.
    Por lo tanto suguiero que en el front existe una api del realtime que envie en paralelo la respuesta a la api del realtime

    GET /respuestas/:respuestasId | obtener una respuesta

    POST /respuestas/subirImagen | subir una imagen

    PUT /respuestas/calificar

    // YO NO ENTENDER
    router.get('/buscar/leccion/:id_leccion/pregunta/:id_pregunta/estudiante/:id_estudiante', RespuestaController.obtenerRespuestaDeEstudiante);
    router.post('/buscar', RespuestaController.obtenerRespuestasPorGrupoAPregunta);
    router.get('/buscar/:id_leccion/:id_pregunta/:id_grupo', RespuestaController.obtenerRespuestasPorGrupoAPreguntaGet);

  */
}
