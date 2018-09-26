const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let preguntas = await db.Preguntas.ObtenerTodos()
        return responses.OK(preguntas)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let pregunta = await db.Preguntas.Obtener({ id })
      return responses.OK(pregunta)
    },
    async Crear ({ nombre, tiempoEstimado, creador, tipoPregunta, puntaje, descripcion, idSeccion }) {
      let pregunta = new db.Preguntas({ nombre, tiempoEstimado, creador, tipoPregunta, puntaje, descripcion })
      let preguntaCreada = await pregunta.Crear()
      return responses.OK(preguntaCreada)
    },
    async Actualizar ({ id, nombre, tiempoEstimado, creador, tipoPregunta, puntaje, descripcion }) {
      let fueActualizado = await db.Preguntas.Actualizar({ id, nombre, tiempoEstimado, creador, tipoPregunta, puntaje, descripcion })
      if (fueActualizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['La pregunta no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Preguntas.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['La pregunta no existe'])
    }
  }
  return Object.assign(Object.create(proto), {})
}
