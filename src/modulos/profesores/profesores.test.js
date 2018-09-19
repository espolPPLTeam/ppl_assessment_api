let materiasController = require('./profesores.controller')({ db: modelos })
let schema = require('./schema')

describe('PROFESORES', () => {
  let profesor = dump.profesores[0]
  let profesor2 = dump.profesores[1]
  profesoresId = ''

  beforeEach(async () => {
    let ProfesorModelo = new modelos.Profesores(profesor)
    let ProfesorCreado = await ProfesorModelo.Crear()
    profesoresId = ProfesorCreado['_id']
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
      let res = await request(app).get(`/api/ppl/profesores`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos.length).to.equal(1)

      const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })
  })

  context('Obtener Uno', () => {
    it('@T20 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/profesores/${profesoresId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })

    it('@T21 No existe el estudiante', async () => {
      let res = await request(app).get(`/api/ppl/profesores/aaaaa`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(null)
    })
  })

  context('Actualizar', () => {
    let { nombres, apellidos, correo } = profesor2
    it('@T30 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/profesores/${profesoresId}`).send({ nombres, apellidos, correo })
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      // verificar que los cambios fueron hechos
      let profesorEncontrado = await modelos.Profesores.Obtener({ id: profesoresId })
      expect(profesorEncontrado).to.not.equal(null)
      expect(profesorEncontrado).to.have.property('nombres', profesor2.nombres)
      expect(profesorEncontrado).to.have.property('apellidos', profesor2.apellidos)
      expect(profesorEncontrado).to.have.property('correo', profesor2.correo)
    })
    it('@T31 Estudiante no existe', async () => {
      let res = await request(app).put(`/api/ppl/profesores/aaaaaa`).send({ nombres, apellidos, correo })
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El profesor no existe')
    })
  })

  context('Eliminar', () => {
    it('@T40 Caso exitoso', async () => {
      let res = await request(app).delete(`/api/ppl/profesores/${profesoresId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminado correctamente')

      let profesorEncontrado = await modelos.Profesores.Obtener({ id: profesoresId })
      expect(profesorEncontrado).to.not.equal(null)
      expect(profesorEncontrado).to.have.property('estado', 'inactivo')
    })
    it('@T41 Paralelo no existe', async () => {
      let res = await request(app).delete(`/api/ppl/profesores/aaaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El profesor no existe')
    })
  })
})