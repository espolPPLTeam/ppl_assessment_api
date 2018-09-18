let materiasController = require('./estudiantes.controller')({ db: modelos })
let schema = require('./schema')

describe('ESTUDIANTES', () => {
  let estudiante = dump.estudiantes[0]
  let estudiante2 = dump.estudiantes[1]
  estudiantesId = ''

  beforeEach(async () => {
    let EstudianteModelo = new modelos.Estudiantes(estudiante)
    let EstudianteCreado = await EstudianteModelo.Crear()
    estudiantesId = EstudianteCreado['_id']
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
      let res = await request(app).get(`/api/ppl/estudiantes`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos.length).to.equal(1)

      const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })
  })

  context('Obtener Uno', () => {
    it('@T20 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })

    it('@T21 No existe el estudiante', async () => {
      let res = await request(app).get(`/api/ppl/estudiantes/aaaaa`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(null)
    })
  })

  context('Actualizar', () => {
    let { nombres, apellidos, carrera, matricula, correo } = estudiante2
    it('@T30 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/estudiantes/${estudiantesId}`).send({ nombres, apellidos, carrera, matricula, correo })
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      // verificar que los cambios fueron hechos
      let estudianteEncontrado = await modelos.Estudiantes.Obtener({ id: estudiantesId })
      expect(estudianteEncontrado).to.not.equal(null)
      expect(estudianteEncontrado).to.have.property('nombres', estudiante2.nombres)
      expect(estudianteEncontrado).to.have.property('apellidos', estudiante2.apellidos)
      expect(estudianteEncontrado).to.have.property('carrera', estudiante2.carrera)
      expect(estudianteEncontrado).to.have.property('matricula', estudiante2.matricula)
      expect(estudianteEncontrado).to.have.property('correo', estudiante2.correo)
    })
    it('@T31 Estudiante no existe', async () => {
      let res = await request(app).put(`/api/ppl/estudiantes/aaaaaa`).send({ nombres, apellidos, carrera, matricula, correo })
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El estudiante no existe')
    })
  })

  context('Eliminar', () => {
    it('@T40 Caso exitoso', async () => {
      let res = await request(app).delete(`/api/ppl/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminado correctamente')

      let estudianteEncontrado = await modelos.Estudiantes.Obtener({ id: estudiantesId })
      expect(estudianteEncontrado).to.not.equal(null)
      expect(estudianteEncontrado).to.have.property('estado', 'inactivo')
    })
    it('@T41 Paralelo no existe', async () => {
      let res = await request(app).delete(`/api/ppl/estudiantes/aaaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El estudiante no existe')
    })
  })
})