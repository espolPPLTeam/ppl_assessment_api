const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let materias = await db.Materias.ObtenerTodos()
        return responses.OK(materias)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Crear (datos) {
      let materia = new db.Materias(datos)
      let materiaCreada = await materia.Crear()
      return responses.OK(materiaCreada)
    }
  }
  return Object.assign(Object.create(proto), {})
}
