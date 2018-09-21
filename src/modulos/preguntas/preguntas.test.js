let materiasController = require('./preguntas.controller')({ db: modelos })
let schema = require('./schema')

describe('SECCIONES', () => {
  let pregunta = dump.preguntas[0]
  let pregunta2 = dump.preguntas[1]
  preguntasId = ''

  beforeEach(async () => {
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
      let res = await request(app).get(`/api/ppl/preguntas`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos.length).to.equal(1)
      const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })
  })

  context('Obtener Uno', () => {
    it('@T20 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/preguntas/${preguntasId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })

    it('@T21 No existe el capitulo', async () => {
      let res = await request(app).get(`/api/ppl/preguntas/aaaaa`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(null)
    })
  })

  context('Crear', () => {
    it('@T30 Caso exitoso', async () => {
      let res = await request(app).post(`/api/ppl/preguntas`).send(pregunta)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      const [err, errMsg] = validar(schema.CREAR.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
      let PreguntaCreada = await modelos.Preguntas.Obtener({ id: res.body.datos.id })
      expect(PreguntaCreada).to.not.equal(null)
      expect(PreguntaCreada).to.have.property('nombre', pregunta.nombre)
      expect(PreguntaCreada).to.have.property('tiempoEstimado', pregunta.tiempoEstimado)
      expect(PreguntaCreada).to.have.property('creador', pregunta.creador)
      expect(PreguntaCreada).to.have.property('tipoPregunta', pregunta.tipoPregunta)
      expect(PreguntaCreada).to.have.property('puntaje', pregunta.puntaje)
      expect(PreguntaCreada).to.have.property('descripcion', pregunta.descripcion)
    })
  })

  context('Actualizar', () => {
    let send = pregunta2
    it('@T40 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/preguntas/${preguntasId}`).send(send)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Actualizado correctamente')

      // verificar que los cambios fueron hechos
      let PreguntaEncontrada = await modelos.Preguntas.Obtener({ id: preguntasId })
      expect(PreguntaEncontrada).to.not.equal(null)
      expect(PreguntaEncontrada).to.have.property('nombre', pregunta2.nombre)
      expect(PreguntaEncontrada).to.have.property('tiempoEstimado', pregunta2.tiempoEstimado)
      expect(PreguntaEncontrada).to.have.property('creador', pregunta2.creador)
      expect(PreguntaEncontrada).to.have.property('tipoPregunta', pregunta2.tipoPregunta)
      expect(PreguntaEncontrada).to.have.property('puntaje', pregunta2.puntaje)
      expect(PreguntaEncontrada).to.have.property('descripcion', pregunta2.descripcion)
    })
    it('@T41 Pregunta no existe', async () => {
      let res = await request(app).put(`/api/ppl/preguntas/aaaaaa`).send(send)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La pregunta no existe')
    })
  })

  context('Eliminar', () => {
    it('@T50 Caso exitoso', async () => {
      let res = await request(app).delete(`/api/ppl/preguntas/${preguntasId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminado correctamente')

      let seccion = await modelos.Secciones.Obtener({ id: preguntasId })
      expect(seccion).to.equal(null)
    })
    it('@T51 Pregunta no existe', async () => {
      let res = await request(app).delete(`/api/ppl/preguntas/aaaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La pregunta no existe')
    })
  })
})