let materiasController = require('./paralelos.controller')({ db: modelos })
let schema = require('./schema')

describe('MATERIAS', () => {
  let paralelo = dump.paralelos[0]
  let paralelo2 = dump.paralelos[1]

  afterEach(async function() {
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


  describe('ESTUDIANTE', () => {
    let id = ''
    let estudiantesId = ''
    beforeEach(async () => {
      let paraleloModelo = new modelos.Paralelos(paralelo)
      let paraleloCreada = await paraleloModelo.Crear()
      id = paraleloCreada['_id']
      estudiantesId = 'aaaaaa'
    })
    it('@T60 Anadir Estudiante', async () => {
      let res = await request(app).put(`/api/ppl/paralelos/${id}/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
      expect(paraleloEncontrada).to.not.equal(null)
      expect(paraleloEncontrada['estudiantes'].length).to.equal(1)
      expect(paraleloEncontrada['estudiantes'][0]).to.equal(estudiantesId)
    })

    it('@T70 Eliminar Estudiante', async () => {
      let fueAnadido = await modelos.Paralelos.AnadirEstudiante({ paralelosId: id, estudiantesId })
      expect(fueAnadido).to.equal(true)
      let res = await request(app).delete(`/api/ppl/paralelos/${id}/estudiantes/${estudiantesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
      expect(paraleloEncontrada).to.not.equal(null)
      expect(paraleloEncontrada['estudiantes'].length).to.equal(0)
    })
  })

  describe('PROFESOR', () => {
    let id = ''
    let profesoresId = ''
    beforeEach(async () => {
      let paraleloModelo = new modelos.Paralelos(paralelo)
      let paraleloCreada = await paraleloModelo.Crear()
      id = paraleloCreada['_id']
      profesoresId = 'aaaaaa'
    })

    it('@T80 Anadir Profesor', async () => {
      let res = await request(app).put(`/api/ppl/paralelos/${id}/profesores/${profesoresId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      let paraleloEncontrada = await modelos.Paralelos.Obtener({ id })
      expect(paraleloEncontrada).to.not.equal(null)
      expect(paraleloEncontrada['profesores'].length).to.equal(1)
      expect(paraleloEncontrada['profesores'][0]).to.equal(profesoresId)
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