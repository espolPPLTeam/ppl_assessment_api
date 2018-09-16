let materiasController = require('./paralelos.controller')({ db: modelos })
let schema = require('./schema')

describe('PARALELOS', () => {
  let paralelo = dump.paralelos[0]
  let paralelo2 = dump.paralelos[1]
  let estudiante = dump.estudiantes[0]
  let profesor = dump.profesores[0]
  let grupo = dump.grupos[0]
  estudiantesId = ''
  profesoresId = ''

  beforeEach(async () => {
    let EstudianteModelo = new modelos.Estudiantes(estudiante)
    let EstudianteCreado = await EstudianteModelo.Crear()
    estudiantesId = EstudianteCreado['_id']

    let ProfesorModelo = new modelos.Profesores(profesor)
    let ProfesorCreado = await ProfesorModelo.Crear()
    profesoresId = ProfesorCreado['_id']
  })

  afterEach(async () => {
    await db.Limpiar()
  })
  before('Limpiar la base de datos', async () => {
    await db.Conectar(URL_DB())
  })
  after('Desconectar la base de datos', () => {
    db.Desconectar()
  })

  it('@T10 Crear', async () => {
    let res = await request(app).post(`/api/ppl/paralelos`).send(paralelo)
    let paraleloCreada = await modelos.Paralelos.Obtener({ id: res.body.datos.id })
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)
    expect(paraleloCreada).to.not.equal(null)

    const [err, errMsg] = validar(schema.CREAR.res, res.body.datos)
    expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)

    expect(paraleloCreada).to.have.property('estado', 'activo')
    expect(paraleloCreada).to.have.property('nombre', paralelo.nombre)
    expect(paraleloCreada).to.have.property('anio', paralelo.anio)
    expect(paraleloCreada).to.have.property('termino', paralelo.termino)
    expect(paraleloCreada).to.have.property('materia', paralelo.materia)
  })

  it('@T20 Obtener Todos', async () => {
    let paraleloModelo = new modelos.Paralelos(paralelo)
    await paraleloModelo.Crear()
    let res = await request(app).get(`/api/ppl/paralelos`)
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)
    expect(res.body.datos.length).to.equal(1)

    const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
    expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
  })

  it('@T30 Obtener', async () => {
    let paraleloModelo = new modelos.Paralelos(paralelo)
    let paraleloCreada = await paraleloModelo.Crear()
    let id = paraleloCreada['_id']
    let res = await request(app).get(`/api/ppl/paralelos/${id}`)
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)

    const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
    expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
  })

  it('@T40 Actualizar', async () => {
    let paraleloModelo = new modelos.Paralelos(paralelo)
    let paraleloCreada = await paraleloModelo.Crear()
    let id = paraleloCreada['_id']
    let res = await request(app).put(`/api/ppl/paralelos/${id}`).send(paralelo2)
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)

    let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
    expect(paraleloEncontrada).to.not.equal(null)
    expect(paraleloEncontrada).to.have.property('nombre', paralelo2.nombre)
    expect(paraleloEncontrada).to.have.property('anio', paralelo2.anio)
    expect(paraleloEncontrada).to.have.property('termino', paralelo2.termino)
    expect(paraleloEncontrada).to.have.property('materia', paralelo2.materia)
  })

  it('@T50 Eliminar', async () => {
    let paraleloModelo = new modelos.Paralelos(paralelo)
    let paraleloCreada = await paraleloModelo.Crear()
    let id = paraleloCreada['_id']
    let res = await request(app).delete(`/api/ppl/paralelos/${id}`)
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)
    let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
    expect(paraleloEncontrada).to.have.property('estado', 'inactivo')
  })


  context('ESTUDIANTE', () => {
    let id = ''
    beforeEach(async () => {
      let paraleloModelo = new modelos.Paralelos(paralelo)
      let paraleloCreada = await paraleloModelo.Crear()
      id = paraleloCreada['_id']
      
    })
    describe('Anadir Estudiante', () => {
      it('@T60 Caso exitoso', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/${id}/estudiantes/${estudiantesId}`)
        expect(res.body.estado).to.equal(true)
        expect(res.body.codigoEstado).to.equal(200)

        let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
        expect(paraleloEncontrada).to.not.equal(null)
        expect(paraleloEncontrada['estudiantes'].length).to.equal(1)
        expect(paraleloEncontrada['estudiantes'][0]).to.equal(estudiantesId)

        let estudiantesEncontrada = await modelos.Estudiantes.Obtener({ id: estudiantesId })
        expect(estudiantesEncontrada).to.not.equal(null)
        expect(estudiantesEncontrada['paralelos'].length).to.equal(1)
        expect(estudiantesEncontrada['paralelos'][0]).to.equal(id)
      })

      it('@T61 Estudiante no existe', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/${id}/estudiantes/aaa`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El estudiante no existe')
      })

      it('@T62 Paralelo no existe', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/aaaa/estudiantes/${estudiantesId}`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El paralelo no existe')
      })

      it('@T63 Paralelo y es Estudiante no existe', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/aaaa/estudiantes/aaaa`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(2)
        expect(res.body.datos[0]).to.equal('El paralelo no existe')
        expect(res.body.datos[1]).to.equal('El estudiante no existe')
      })
    })

    describe('Eliminar Estudiante', () => {
      let id = ''
      beforeEach(async () => {
        let paraleloModelo = new modelos.Paralelos(paralelo)
        let paraleloCreada = await paraleloModelo.Crear()
        id = paraleloCreada['_id']
      })
      it('@T70 Caso exitoso', async () => {

        // crear un grupo y anadirlo al estudiante
        let GrupoModelo = new modelos.Grupos({ ...grupo, paralelo: id })
        let GrupoCreado = await GrupoModelo.Crear()
        let gruposId = GrupoCreado['_id']
        await modelos.Grupos.AnadirEstudiante({ gruposId, estudiantesId })
        let fueAnadido = await modelos.Paralelos.AnadirEstudiante({ paralelosId: id, estudiantesId })

        // crear un grupo con un paralelo ficticio
        let GrupoModelo2 = new modelos.Grupos({ ...grupo, paralelo: 'aaaa' })
        let GrupoCreado2 = await GrupoModelo2.Crear()
        let gruposId2 = GrupoCreado2['_id']
        await modelos.Grupos.AnadirEstudiante({ gruposId: gruposId2, estudiantesId })

        // crear el paralelo
        await modelos.Estudiantes.AnadirParalelo({ estudiantesId, paralelosId: id })
        let estudiante = await modelos.Estudiantes.Obtener({ id: estudiantesId })
        expect(estudiante).to.not.equal(null)
        expect(estudiante['paralelos'].length).to.equal(1)

        // verificar que el estudiante este en un grupo
        let grupoObtenido = await modelos.Grupos.Obtener({ id: gruposId })
        expect(grupoObtenido).to.not.equal(null)
        expect(grupoObtenido['estudiantes'].length).to.equal(1)

        // verificar que el estudiante este en el otro grupo
        grupoObtenido = await modelos.Grupos.Obtener({ id: gruposId2 })
        expect(grupoObtenido).to.not.equal(null)
        expect(grupoObtenido['estudiantes'].length).to.equal(1)

        let res = await request(app).delete(`/api/ppl/paralelos/${id}/estudiantes/${estudiantesId}`)
        expect(res.body.estado).to.equal(true)
        expect(res.body.codigoEstado).to.equal(200)

        // verificar que el estudiante no este en paralelo
        let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
        expect(paraleloEncontrada).to.not.equal(null)
        expect(paraleloEncontrada['estudiantes'].length).to.equal(0)

        // verificar que el estudiante no tenga el paralelo que fue eliminado
        estudiante = await modelos.Estudiantes.Obtener({ id: estudiantesId })
        expect(estudiante).to.not.equal(null)
        expect(estudiante['paralelos'].length).to.equal(0)

        // verificar que el estudiante no este en el grupo que fue eliminado
        grupoObtenido = await modelos.Grupos.Obtener({ id: gruposId })
        expect(grupoObtenido).to.not.equal(null)
        expect(grupoObtenido['estudiantes'].length).to.equal(0)

        // verificar que el estudiante si este en el otro grupo
        grupoObtenido = await modelos.Grupos.Obtener({ id: gruposId2 })
        expect(grupoObtenido).to.not.equal(null)
        expect(grupoObtenido['estudiantes'].length).to.equal(1)
      })

      it('@T71 Paralelo no exite', async () => {
        let fueAnadido = await modelos.Paralelos.AnadirEstudiante({ paralelosId: id, estudiantesId })
        await modelos.Estudiantes.AnadirParalelo({ estudiantesId, paralelosId: id })
        expect(fueAnadido).to.equal(true)
        let res = await request(app).delete(`/api/ppl/paralelos/aaaa/estudiantes/${estudiantesId}`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El paralelo o el estudiante no existe')
      })

      it('@T72 Estudiante no exite', async () => {
        let fueAnadido = await modelos.Paralelos.AnadirEstudiante({ paralelosId: id, estudiantesId })
        expect(fueAnadido).to.equal(true)
        let res = await request(app).delete(`/api/ppl/paralelos/${id}/estudiantes/aaaa`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El paralelo o el estudiante no existe')
      })

      it('@T73 Paralelo y estudiante no exite', async () => {
        let res = await request(app).delete(`/api/ppl/paralelos/aaaaa/estudiantes/aaaa`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El paralelo o el estudiante no existe')
      })
    })
  })

  describe('PROFESOR', () => {
    let id = ''
    beforeEach(async () => {
      let paraleloModelo = new modelos.Paralelos(paralelo)
      let paraleloCreada = await paraleloModelo.Crear()
      id = paraleloCreada['_id']
    })

    describe('Anadir Profesor', () => {
      it('@T80 Caso exitoso', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/${id}/profesores/${profesoresId}`)
        expect(res.body.estado).to.equal(true)
        expect(res.body.codigoEstado).to.equal(200)

        let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
        expect(paraleloEncontrada).to.not.equal(null)
        expect(paraleloEncontrada['profesores'].length).to.equal(1)
        expect(paraleloEncontrada['profesores'][0]).to.equal(profesoresId)

        let profesorEncontrada = await modelos.Profesores.Obtener({ id: profesoresId })
        expect(profesorEncontrada).to.not.equal(null)
        expect(profesorEncontrada['paralelos'].length).to.equal(1)
        expect(profesorEncontrada['paralelos'][0]).to.equal(id)
      })

      it('@T81 Paralelo no exite', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/aaaa/profesores/${profesoresId}`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El paralelo no existe')
      })


      it('@T82 Profesor no exite', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/${id}/profesores/aaaaaaaa`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(1)
        expect(res.body.datos[0]).to.equal('El profesor no existe')
      })

      it('@T83 Paralelo y Profesor no existe', async () => {
        let res = await request(app).put(`/api/ppl/paralelos/aaaa/profesores/aaaaa`)
        expect(res.body.estado).to.equal(false)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos.length).to.equal(2)
        expect(res.body.datos[0]).to.equal('El paralelo no existe')
        expect(res.body.datos[1]).to.equal('El profesor no existe')
      })
    })
    

    it('@T90 Eliminar Profesor', async () => {
      let fueAnadido = await modelos.Paralelos.AnadirProfesor({ paralelosId: id, profesoresId })
      expect(fueAnadido).to.equal(true)
      let res = await request(app).delete(`/api/ppl/paralelos/${id}/profesores/${profesoresId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
      expect(paraleloEncontrada).to.not.equal(null)
      expect(paraleloEncontrada['profesores'].length).to.equal(0)
    })
  })

  describe('PROFESOR', () => {
    let id = ''
    let gruposId = ''
    beforeEach(async () => {
      let paraleloModelo = new modelos.Paralelos(paralelo)
      let paraleloCreada = await paraleloModelo.Crear()
      id = paraleloCreada['_id']
      gruposId = 'aaaaaa'
    })
    it('@T110 Anadir Grupo', async () => {
      let res = await request(app).put(`/api/ppl/paralelos/${id}/grupos/${gruposId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
      expect(paraleloEncontrada).to.not.equal(null)
      expect(paraleloEncontrada['grupos'].length).to.equal(1)
      expect(paraleloEncontrada['grupos'][0]).to.equal(gruposId)
    })

    it('@T120 Eliminar Grupo', async () => {
      let fueAnadido = await modelos.Paralelos.AnadirProfesor({ paralelosId: id, gruposId })
      expect(fueAnadido).to.equal(true)
      let res = await request(app).delete(`/api/ppl/paralelos/${id}/grupos/${gruposId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
      expect(paraleloEncontrada).to.not.equal(null)
      expect(paraleloEncontrada['grupos'].length).to.equal(0)
    })
  })
})