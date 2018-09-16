let materiasController = require('./materias.controller')({ db: modelos })
let schema = require('./schema')

describe('MATERIAS', () => {
  let materia = dump.materias[0]

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
    let res = await request(app).post(`/api/ppl/materias`).send(materia)
    let materiaCreada = await modelos.Materias.Obtener(res.body.datos.id)
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)
    expect(materiaCreada).to.not.equal(null)

    const [err, errMsg] = validar(schema.CREAR.res, res.body.datos)
    expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)

    expect(materiaCreada).to.have.property('nombre', materia.nombre)
    expect(materiaCreada).to.have.property('codigo', materia.codigo)
  })

  it('@T20 Obtener Todos', async () => {
    await materiasController.Crear(materia)
    let res = await request(app).get(`/api/ppl/materias`)
    expect(res.body.estado).to.equal(true)
    expect(res.body.codigoEstado).to.equal(200)
    expect(res.body.datos.length).to.equal(1)

    const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
    expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
  })

  it('@T30 Actualizar')

  it('@T40 Eliminar')
})