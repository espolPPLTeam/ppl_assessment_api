let materiasController = require('./secciones.controller')({ db: modelos })
let schema = require('./schema')

describe('SECCIONES', () => {
  let seccion = dump.secciones[0]
  let seccion2 = dump.secciones[1]
  let pregunta = dump.preguntas[0]
  let pregunta2 = dump.preguntas[1]
  let materia = dump.materias[0]
  seccionesId = ''
  preguntasId2 = ''
  preguntasId = ''

  beforeEach(async () => {
    let SeccionModelo = new modelos.Secciones(seccion)
    let SeccionCreada = await SeccionModelo.Crear()
    seccionesId = SeccionCreada['_id']

    let PreguntaModelo2 = new modelos.Preguntas(pregunta)
    let PreguntaCreada2 = await PreguntaModelo2.Crear()
    preguntasId2 = PreguntaCreada2['_id']

    let PreguntaModelo = new modelos.Preguntas(pregunta)
    let PreguntaCreada = await PreguntaModelo.Crear()
    preguntasId = PreguntaCreada['_id']
  })

  afterEach(async function() {
    await db.Limpiar()
  })
  before('Limpiar la base de datos', async () => {
    await db.Conectar(URL_DB())
  })
  after('Desconectar la base de datos', () => {
    db.Desconectar()
  })

  context('Obtener Todos', () => {
    it('@T10 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/secciones`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos.length).to.equal(1)
      const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })
  })

  context('Obtener Uno', () => {
    it('@T20 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/secciones/${seccionesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })

    it('@T21 No existe el capitulo', async () => {
      let res = await request(app).get(`/api/ppl/secciones/aaaaa`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(null)
    })
  })

  context('Crear', () => {
    it('@T30 Caso exitoso', async () => {
      let res = await request(app).post(`/api/ppl/secciones`).send(seccion)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      const [err, errMsg] = validar(schema.CREAR.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
      let SeccionCreada = await modelos.Secciones.Obtener({ id: res.body.datos.id })
      expect(SeccionCreada).to.not.equal(null)
      expect(SeccionCreada).to.have.property('nombre', seccion.nombre)
      expect(SeccionCreada).to.have.property('descripcion', seccion.descripcion)
      expect(SeccionCreada).to.have.property('creador', seccion.creador)
      expect(SeccionCreada.preguntas.length).to.equal(seccion.preguntas.length)
      expect(SeccionCreada).to.have.property('capitulo', seccion.capitulo)
      expect(SeccionCreada).to.have.property('tipo', seccion.tipo)
    })
  })

  context('Actualizar', () => {
    let { nombre, descripcion, creador, capitulo, tipo } = seccion2
    let send = { nombre, descripcion, creador, capitulo, tipo }
    it('@T40 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/secciones/${seccionesId}`).send(send)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Actualizado correctamente')

      // verificar que los cambios fueron hechos
      let capituloEncontrado = await modelos.Secciones.Obtener({ id: seccionesId })
      expect(capituloEncontrado).to.not.equal(null)
      expect(capituloEncontrado).to.have.property('nombre', send.nombre)
      expect(capituloEncontrado).to.have.property('descripcion', send.descripcion)
      expect(capituloEncontrado).to.have.property('creador', send.creador)
      expect(capituloEncontrado).to.have.property('capitulo', send.capitulo)
      expect(capituloEncontrado).to.have.property('tipo', send.tipo)
    })
    it('@T41 Seccion no existe', async () => {
      let res = await request(app).put(`/api/ppl/secciones/aaaaaa`).send(send)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La seccion no existe')
    })
  })

  context('Eliminar', () => {
    it('@T50 Caso exitoso', async () => {
      let res = await request(app).delete(`/api/ppl/secciones/${seccionesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminado correctamente')

      let seccion = await modelos.Secciones.Obtener({ id: seccionesId })
      expect(seccion).to.equal(null)
    })
    it('@T51 Seccion no existe', async () => {
      let res = await request(app).delete(`/api/ppl/secciones/aaaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La seccion no existe')
    })
  })

  context('Anadir Pregunta', () => {
    it('@T60 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/secciones/${seccionesId}/preguntas/${preguntasId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      let seccionTamano = seccion.preguntas.length
      let seccionEncontrada = await modelos.Secciones.Obtener({ id: seccionesId })
      expect(seccionEncontrada).to.not.equal(null)
      expect(seccionEncontrada.preguntas.length).to.equal(seccionTamano + 1)
      expect(seccionEncontrada.preguntas[seccionTamano]).to.equal(preguntasId)
    })

    it('@T61 Seccion no existe', async () => {
      let res = await request(app).put(`/api/ppl/secciones/aaaa/preguntas/${preguntasId}`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La seccion no existe')
    })

    it('@T62 Pregunta no existe', async () => {
      let res = await request(app).put(`/api/ppl/secciones/${seccionesId}/preguntas/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La pregunta no existe')
    })

    it('@T63 Seccion o Pregunta no existe', async () => {
      let res = await request(app).put(`/api/ppl/secciones/aaaaa/preguntas/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(2)
      expect(res.body.datos[0]).to.equal('La seccion no existe')
      expect(res.body.datos[1]).to.equal('La pregunta no existe')
    })
  })

  context('Eliminar Pregunta', () => {
    it('@T70 Caso exitoso', async () => {
      // anadirlos
      await modelos.Secciones.AnadirPregunta({ seccionesId, preguntasId  })

      // comprobar que se guardaron
      let seccionTamano = seccion.preguntas.length
      let seccionEncontrada = await modelos.Secciones.Obtener({ id: seccionesId })
      expect(seccionEncontrada).to.not.equal(null)
      expect(seccionEncontrada.preguntas.length).to.equal(seccionTamano + 1)
      expect(seccionEncontrada.preguntas[seccionTamano]).to.equal(preguntasId)
      let preguntasTamano = seccionEncontrada.preguntas.length
      // llamada a la api
      let res = await request(app).delete(`/api/ppl/secciones/${seccionesId}/preguntas/${preguntasId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminada la pregunta de la seccion')
      
      seccionEncontrada = await modelos.Secciones.Obtener({ id: seccionesId })
      expect(seccionEncontrada).to.not.equal(null)
      expect(seccionEncontrada.preguntas.length).to.equal(preguntasTamano - 1)
    })

    it('@T71 Capitulo o Seccion no existe', async () => {
      let res = await request(app).delete(`/api/ppl/secciones/aaaaa/preguntas/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La seccion o la pregunta no existe')
    })
  })
})