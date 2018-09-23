describe('CAPITULOS CONTROLLER', () => {
  beforeEach(function() {
    sinon.stub(consola, 'error')
    mockDB = crearStub('reject', 'ObtenerTodos', 'Capitulos', 'Error')
    Controller = require('./capitulos.controller')({ db: mockDB, logger: consola })
  })
  context('Obtener Todos', () => {
    it('@T10 Caso fallido', async () => {
      let res = await Controller.ObtenerTodos()
      expect(res).to.deep.equal(respuestas.ERROR_SERVIDOR)
      expect(consola.error.calledOnce).to.be.true
    })
  })
})