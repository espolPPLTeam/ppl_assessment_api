// let materiasController = require('./respuestas.controller')({ db: modelos })
let schema = require('./schema')

describe('SECCIONES', () => {
  let respuesta1 = dump.respuestas[0]
  let respuesta2 = dump.respuestas[1]
  respuestasId2 = ''
  respuestasId = ''

  beforeEach(async () => {
    let RespuestaModelo = new modelos.Respuestas(respuesta1)
    let RespuestaCreada = await RespuestaModelo.Crear()
    respuestasId = RespuestaCreada['_id']

    let RespuestaModelo2 = new modelos.Respuestas(respuesta2)
    let RespuestaCreada2 = await RespuestaModelo2.Crear()
    respuestasId2 = RespuestaCreada2['_id']
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

  context('Actualizar o Crear', () => {
    let { estudiante, pregunta, paralelo, grupo, respuesta, imagen } = respuesta1
    let send = { estudiante, pregunta, paralelo, grupo, respuesta, imagen }
    it('@T10 Caso exitoso crear', async () => { 
      let res = await request(app).put(`/api/ppl/respuestas/crear/o/actualizar`).send(send)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(201)
      
      // verificar que se guardo
      let RespuestaEncontrada = await modelos.Respuestas.Obtener({ id: res.body.datos.id })
      expect(RespuestaEncontrada).to.have.property('estudiante', send.estudiante)
      expect(RespuestaEncontrada).to.have.property('pregunta', send.pregunta)
      expect(RespuestaEncontrada).to.have.property('paralelo', send.paralelo)
      expect(RespuestaEncontrada).to.have.property('grupo', send.grupo)
      expect(RespuestaEncontrada).to.have.property('respuesta', send.respuesta)
      expect(RespuestaEncontrada).to.have.property('imagen', send.imagen)
    })

    it('@T11 Caso exitoso actualizar', async () => {
      let { estudiante, pregunta, paralelo, grupo, respuesta, imagen } = respuesta2
      let send = { estudiante, pregunta, paralelo, grupo, respuesta, imagen }
      let url = `/api/ppl/respuestas/crear/o/actualizar?id=${respuestasId}`
      let res = await request(app).put(url).send(send)

      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Actualizado correctamente')
      
      // verificar que se guardo
      let RespuestaEncontrada = await modelos.Respuestas.Obtener({ id: respuestasId2 })
      expect(RespuestaEncontrada).to.have.property('estudiante', send.estudiante)
      expect(RespuestaEncontrada).to.have.property('pregunta', send.pregunta)
      expect(RespuestaEncontrada).to.have.property('paralelo', send.paralelo)
      expect(RespuestaEncontrada).to.have.property('grupo', send.grupo)
      expect(RespuestaEncontrada).to.have.property('respuesta', send.respuesta)
      expect(RespuestaEncontrada).to.have.property('imagen', send.imagen)
    })

    // expect(res.body.datos).to.eql(['Actualizado correctamente'])
    // let { nombre, capitulo, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio } = leccion2
    //   let send = { nombre, capitulo, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio }
    // it('@T40 Caso exitoso', async () => {
    //   let res = await request(app).put(`/api/ppl/lecciones/${leccionesId}`).send(send)
    //   expect(res.body.estado).to.equal(true)
    //   expect(res.body.codigoEstado).to.equal(200)
    //   expect(res.body.datos).to.equal('Actualizado correctamente')

    //   // verificar que los cambios fueron hechos
    //   let LeccionEncontrada = await modelos.Lecciones.Obtener({ id: leccionesId })
    //   expect(LeccionEncontrada).to.not.equal(null)
    //   expect(LeccionEncontrada).to.have.property('nombre', leccion2.nombre)
    //   expect(LeccionEncontrada).to.have.property('capitulo', leccion2.capitulo)
    //   expect(LeccionEncontrada).to.have.property('creador', leccion2.creador)
    //   expect(LeccionEncontrada.secciones.length).to.equal(leccion.secciones.length)
    //   expect(LeccionEncontrada).to.have.property('tiempoEstimadoEnMinutos', leccion2.tiempoEstimadoEnMinutos)
    //   expect(LeccionEncontrada).to.have.property('puntaje', leccion2.puntaje)
    //   expect(LeccionEncontrada).to.have.property('tipo', leccion2.tipo)
    //   expect(LeccionEncontrada).to.have.property('paralelo', leccion2.paralelo)
    //   // fechaInicio me sale un error raro
    //   // expect(LeccionCreada.fechaInicio).to.equal(leccion.fechaInicio)
    // })
    // it('@T41 Leccion no existe', async () => {
    //   let res = await request(app).put(`/api/ppl/lecciones/aaaaaa`).send(send)
    //   expect(res.body.estado).to.equal(false)
    //   expect(res.body.codigoEstado).to.equal(200)

    //   expect(res.body.datos.length).to.equal(1)
    //   expect(res.body.datos[0]).to.equal('La leccion no existe')
    // })
  })
})