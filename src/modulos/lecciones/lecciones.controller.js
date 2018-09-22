const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let lecciones = await db.Lecciones.ObtenerTodos()
        return responses.OK(lecciones)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let leccion = await db.Lecciones.Obtener({ id })
      return responses.OK(leccion)
    },
    async Crear ({ nombre, capitulo, secciones, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio }) {
      let leccion = new db.Lecciones({ nombre, capitulo, secciones, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio })
      let leccionCreada = await leccion.Crear()
      return responses.OK(leccionCreada)
    },
    async Actualizar ({ id, nombre, capitulo, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio }) {
      let fueActualizado = await db.Lecciones.Actualizar({ id, nombre, capitulo, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio })
      if (fueActualizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['La leccion no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Lecciones.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['La leccion no existe'])
    },
    async AnadirSecciones ({ seccionesIds, leccionesId }) {
      let leccionExiste = await db.Lecciones.Obtener({ id: leccionesId })
      if (!leccionExiste) {
        return responses.NO_OK(['La leccion no existe'])
      }
      await db.Lecciones.AnadirSecciones({ leccionesId, seccionesIds })
      return responses.OK('Agregado correctamente')
    },
    async EliminarSecciones ({ seccionesIds, leccionesId }) {
      let leccionExiste = await db.Lecciones.Obtener({ id: leccionesId })
      if (!leccionExiste) {
        return responses.NO_OK(['La leccion no existe'])
      }
      await db.Lecciones.EliminarSecciones({ leccionesId, seccionesIds })
      return responses.OK('Eliminada las secciones de la leccion')
    }
  }
  return Object.assign(Object.create(proto), {})
}
