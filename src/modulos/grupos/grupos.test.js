let materiasController = require('./grupos.controller')({ db: modelos })
let schema = require('./schema')

describe('GRUPOS', () => {
  let grupo = dump.grupos[0]
  let grupo2 = dump.grupos[1]
  let paralelo = dump.paralelos[0]
  let estudiante = dump.estudiantes[0]
  paralelosId = ''
  gruposId = ''
  estudiantesId = ''

  beforeEach(async () => {
    let ParaleloModelo = new modelos.Paralelos(paralelo)
    let ParaleloCreado = await ParaleloModelo.Crear()
    paralelosId = ParaleloCreado['_id']

    let GrupoModelo = new modelos.Grupos({ ...grupo, paralelo: paralelosId })
    let GrupoCreado = await GrupoModelo.Crear()
    gruposId = GrupoCreado['_id']

    let EstudianteModelo = new modelos.Estudiantes(estudiante)
    let EstudianteCreado = await EstudianteModelo.Crear()
    estudiantesId = EstudianteCreado['correo']
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
      let res = await request(app).get(`/api/ppl/grupos`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos.length).to.equal(1)
      const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })
  })

  context('Obtener Uno', () => {
    it('@T20 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/grupos/${gruposId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })

    it('@T21 No existe el grupo', async () => {
      let res = await request(app).get(`/api/ppl/grupos/aaaaa`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(null)
    })
  })

  context('Crear', () => {
    it('@T30 Caso exitoso', async () => {
      let res = await request(app).post(`/api/ppl/grupos`).send({ ...grupo, paralelo: paralelosId })
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      const [err, errMsg] = validar(schema.CREAR.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)

      let grupoCreado = await modelos.Grupos.Obtener({ id: res.body.datos.id })
      expect(grupoCreado).to.not.equal(null)
      expect(grupoCreado).to.have.property('nombre', grupo.nombre)
      expect(grupoCreado).to.have.property('paralelo', paralelosId)
    })
  })

  context('Actualizar', () => {
    it('@T40 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/grupos/${gruposId}`).send(grupo2)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Actualizado correctamente')

      // verificar que los cambios fueron hechos
      let grupoEncontrado = await modelos.Grupos.Obtener({ id: gruposId })
      expect(grupoEncontrado).to.not.equal(null)
      expect(grupoEncontrado).to.have.property('nombre', grupo2.nombre)
    })
    it('@T41 Grupo no existe', async () => {
      let res = await request(app).put(`/api/ppl/grupos/aaaaaa`).send(grupo2)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El grupo no existe')
    })
  })

  context('Eliminar', () => {
    it('@T50 Caso exitoso', async () => {
      let res = await request(app).delete(`/api/ppl/grupos/${gruposId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminado correctamente')

      let grupoEncontrado = await modelos.Grupos.Obtener({ id: gruposId })
      expect(grupoEncontrado).to.equal(null)
    })
    it('@T51 Grupo no existe', async () => {
      let res = await request(app).delete(`/api/ppl/grupos/aaaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El grupo no existe')
    })
  })

  context('Anadir estudiante', () => {
    it('@T60 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/grupos/${gruposId}/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      let grupoEncontrado = await modelos.Grupos.Obtener({ id: gruposId })
      expect(grupoEncontrado).to.not.equal(null)
      expect(grupoEncontrado.estudiantes.length).to.equal(1)
      expect(grupoEncontrado.estudiantes[0]).to.equal(estudiantesId)

      let estudianteEncontrado = await modelos.Estudiantes.Obtener({ id: estudiantesId })
      expect(estudianteEncontrado).to.not.equal(null)
      expect(estudianteEncontrado.grupos.length).to.equal(1)
      expect(estudianteEncontrado.grupos[0]).to.equal(gruposId)
    })

    it('@T61 Grupo no existe', async () => {
      let res = await request(app).put(`/api/ppl/grupos/aaaa/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El grupo no existe')
    })

    it('@T62 Estudiante no existe', async () => {
      let res = await request(app).put(`/api/ppl/grupos/${gruposId}/estudiantes/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El estudiante no existe')
    })

    it('@T63 Grupo y estudiante no existe', async () => {
      let res = await request(app).put(`/api/ppl/grupos/aaaaa/estudiantes/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(2)
      expect(res.body.datos[0]).to.equal('El grupo no existe')
      expect(res.body.datos[1]).to.equal('El estudiante no existe')
    })
  })

  context('Eliminar estudiante', () => {
    it('@T70 Caso exitoso', async () => {
      // anadirlos
      await modelos.Estudiantes.AnadirGrupo({ gruposId, estudiantesId })
      await modelos.Grupos.AnadirEstudiante({ gruposId, estudiantesId })

      // comprobar que se guardaron
      let grupoEncontrado = await modelos.Grupos.Obtener({ id: gruposId })
      expect(grupoEncontrado).to.not.equal(null)
      expect(grupoEncontrado.estudiantes.length).to.equal(1)
      expect(grupoEncontrado.estudiantes[0]).to.equal(estudiantesId)

      let estudianteEncontrado = await modelos.Estudiantes.Obtener({ id: estudiantesId })
      expect(estudianteEncontrado).to.not.equal(null)
      expect(estudianteEncontrado.grupos.length).to.equal(1)
      expect(estudianteEncontrado.grupos[0]).to.equal(gruposId)

      // llamada a la api
      let res = await request(app).delete(`/api/ppl/grupos/${gruposId}/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      grupoEncontrado = await modelos.Grupos.Obtener({ id: gruposId })
      expect(grupoEncontrado).to.not.equal(null)
      expect(grupoEncontrado.estudiantes.length).to.equal(0)

      estudianteEncontrado = await modelos.Estudiantes.Obtener({ id: estudiantesId })
      expect(estudianteEncontrado).to.not.equal(null)
      expect(estudianteEncontrado.grupos.length).to.equal(0)
    })

    it('@T71 Grupo o estudiante no existe', async () => {
      let res = await request(app).delete(`/api/ppl/grupos/aaaaa/estudiantes/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El grupo o el estudiante no existe')
    })
  })
})