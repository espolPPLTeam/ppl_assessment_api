const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let secciones = await db.Secciones.ObtenerTodos()
        return responses.OK(secciones)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let seccion = await db.Secciones.Obtener({ id })
      return responses.OK(seccion)
    },
    async Crear ({ nombre, descripcion, creador, preguntas, capitulo, tipo }) {
      let seccion = new db.Secciones({ nombre, descripcion, creador, preguntas, capitulo, tipo })
      let seccionCreada = await seccion.Crear()
      return responses.OK(seccionCreada)
    },
    async Actualizar ({ id, nombre, descripcion, creador, capitulo, tipo }) {
      let fueActualizado = await db.Secciones.Actualizar({ id, nombre, descripcion, creador, capitulo, tipo })
      if (fueActualizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['La seccion no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Secciones.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['La seccion no existe'])
    },
    async AnadirPregunta ({ seccionesId, preguntasId }) {
      let seccionExiste = await db.Secciones.Obtener({ id: seccionesId })
      let preguntaExiste = await db.Preguntas.Obtener({ id: preguntasId })
      if (!preguntaExiste && !seccionExiste) {
        return responses.NO_OK(['La seccion no existe', 'La pregunta no existe'])
      } else if (!seccionExiste) {
        return responses.NO_OK(['La seccion no existe'])
      } else if (!preguntaExiste) {
        return responses.NO_OK(['La pregunta no existe'])
      }
      await db.Secciones.AnadirPregunta({ seccionesId, preguntasId })
      return responses.OK('Agregado correctamente')
    },
    async EliminarPregunta ({ seccionesId, preguntasId }) {
      let fueEliminado = await db.Secciones.EliminarPregunta({ seccionesId, preguntasId })
      if (!fueEliminado) {
        return responses.NO_OK(['La seccion o la pregunta no existe'])
      }
      return responses.OK('Eliminada la pregunta de la seccion')
    }
  }
  return Object.assign(Object.create(proto), {})
}
