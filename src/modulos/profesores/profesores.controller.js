const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let profesores = await db.Profesores.ObtenerTodosFiltrado()
        return responses.OK(profesores)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let profesores = await db.Profesores.ObtenerFiltrado({ id })
      return responses.OK(profesores)
    },
    async Actualizar ({ id, nombres, apellidos, correo }) {
      let fueActualizado = await db.Profesores.Actualizar({ id, nombres, apellidos, correo })
      if (fueActualizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['El profesor no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Profesores.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['El profesor no existe'])
    }
  }
  return Object.assign(Object.create(proto), {})
}
