const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let estudiantes = await db.Estudiantes.ObtenerTodosFiltrado()
        return responses.OK(estudiantes)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let estudiantes = await db.Estudiantes.ObtenerFiltrado({ id })
      return responses.OK(estudiantes)
    },
    async Actualizar ({ id, nombres, apellidos, carrera, matricula }) {
      let fueActulizado = await db.Estudiantes.Actualizar({ id, nombres, apellidos, carrera, matricula })
      if (fueActulizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['El estudiante no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Estudiantes.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['El estudiante no existe'])
    }
  }
  return Object.assign(Object.create(proto), {})
}
