let materiasController = require('./capitulos.controller')({ db: modelos })
let schema = require('./schema')

describe('CAPITULOS', () => {
  let capitulo = dump.capitulos[0]
  let capitulo2 = dump.capitulos[1]
  let seccion = dump.secciones[0]
  let seccion2 = dump.secciones[1]
  let materia = dump.materias[0]
  materiasId = ''
  seccionesId = ''
  seccionesId2 = ''
  capitulosId = ''

  beforeEach(async () => {
    let MateriaModelo = new modelos.Materias(materia)
    let MateriaCreada = await MateriaModelo.Crear()
    materiasId = MateriaCreada['_id']

    let SeccionModelo = new modelos.Secciones(seccion)
    let SeccionCreada = await SeccionModelo.Crear()
    seccionesId = SeccionCreada['_id']

    let SeccionModelo2 = new modelos.Secciones(seccion2)
    let SeccionCreada2 = await SeccionModelo2.Crear()
    seccionId2 = SeccionCreada2['_id']

    let CapituloModelo = new modelos.Capitulos({ ...capitulo, materia: materiasId })
    let CapituloCreada = await CapituloModelo.Crear()
    capitulosId = CapituloCreada['_id']
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
      let res = await request(app).get(`/api/ppl/capitulos`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos.length).to.equal(1)
      const [err, errMsg] = validar(schema.OBTENER_TODOS.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })
  })

  context('Obtener Uno', () => {
    it('@T20 Caso exitoso', async () => {
      let res = await request(app).get(`/api/ppl/capitulos/${capitulosId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      const [err, errMsg] = validar(schema.OBTENER.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)
    })

    it('@T21 No existe el capitulo', async () => {
      let res = await request(app).get(`/api/ppl/capitulos/aaaaa`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(null)
    })
  })

  context('Crear', () => {
    it('@T30 Caso exitoso', async () => {
      let materiaNuevoCodigo = 'aaa'
      let res = await request(app).post(`/api/ppl/capitulos`).send({ ...capitulo, materia: materiasId })
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      const [err, errMsg] = validar(schema.CREAR.res, res.body.datos)
      expect(err, `${JSON.stringify(errMsg)}`).to.equal(false)

      let CapituloCreada = await modelos.Capitulos.Obtener({ id: res.body.datos.id })
      expect(CapituloCreada).to.not.equal(null)
      expect(CapituloCreada).to.have.property('nombre', capitulo.nombre)
      expect(CapituloCreada).to.have.property('materia', materiasId)
    })
  })

  context('Actualizar', () => {
    let materiaNuevoCodigo = 'aaa'
    let send = { ...capitulo2, materia: materiaNuevoCodigo }
    it('@T40 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/capitulos/${capitulosId}`).send(send)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Actualizado correctamente')

      // verificar que los cambios fueron hechos
      let capitulo = await modelos.Capitulos.Obtener({ id: capitulosId })
      expect(capitulo).to.not.equal(null)
      expect(capitulo).to.have.property('nombre', capitulo2.nombre)
      expect(capitulo).to.have.property('materia', materiaNuevoCodigo)
    })
    it('@T41 Capitulo no existe', async () => {
      let res = await request(app).put(`/api/ppl/capitulos/aaaaaa`).send(send)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El capitulo no existe')
    })
  })

  context('Eliminar', () => {
    it('@T50 Caso exitoso', async () => {
      let res = await request(app).delete(`/api/ppl/capitulos/${capitulosId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal('Eliminado correctamente')

      let capitulo = await modelos.Capitulos.Obtener({ id: capitulosId })
      expect(capitulo).to.equal(null)
    })
    it('@T51 Capitulo no existe', async () => {
      let res = await request(app).delete(`/api/ppl/grupos/aaaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El grupo no existe')
    })
  })

  context('Anadir Capitulo', () => {
    it('@T60 Caso exitoso', async () => {
      let res = await request(app).put(`/api/ppl/capitulos/${capitulosId}/secciones/${seccionesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      let capitulo = await modelos.Capitulos.Obtener({ id: capitulosId })
      expect(capitulo).to.not.equal(null)
      expect(capitulo.secciones.length).to.equal(1)
      expect(capitulo.secciones[0]).to.equal(seccionesId)
    })

    it('@T61 Capitulo no existe', async () => {
      let res = await request(app).put(`/api/ppl/capitulos/aaaa/secciones/${seccionesId}`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El capitulo no existe')
    })

    it('@T62 Seccion no existe', async () => {
      let res = await request(app).put(`/api/ppl/capitulos/${capitulosId}/secciones/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('La seccion no existe')
    })

    it('@T63 Capitulo o Seccion no existe', async () => {
      let res = await request(app).put(`/api/ppl/capitulos/aaaaa/secciones/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(2)
      expect(res.body.datos[0]).to.equal('El capitulo no existe')
      expect(res.body.datos[1]).to.equal('La seccion no existe')
    })
  })

  context('Eliminar Capitulo', () => {
    it('@T70 Caso exitoso', async () => {
      // anadirlos
      await modelos.Capitulos.AnadirSeccion({ capitulosId, seccionesId  })

      // comprobar que se guardaron
      let capitulo = await modelos.Capitulos.Obtener({ id: capitulosId })
      expect(capitulo).to.not.equal(null)
      expect(capitulo.secciones.length).to.equal(1)
      expect(capitulo.secciones[0]).to.equal(seccionesId)

      // llamada a la api
      let res = await request(app).delete(`/api/ppl/capitulos/${capitulosId}/secciones/${seccionesId}`)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      
      capitulo = await modelos.Capitulos.Obtener({ id: capitulosId })
      expect(capitulo).to.not.equal(null)
      expect(capitulo.secciones.length).to.equal(0)
    })

    it('@T71 Capitulo o Seccion no existe', async () => {
      let res = await request(app).delete(`/api/ppl/capitulos/aaaaa/secciones/aaaaa`)
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)

      expect(res.body.datos.length).to.equal(1)
      expect(res.body.datos[0]).to.equal('El capitulo o la seccion no existe')
    })
  })
})