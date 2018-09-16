// TODO: Verificar si existencia de llaves foraneas
const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let materias = await db.Paralelos.ObtenerTodos()
        return responses.OK(materias)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Crear ({ nombre, anio, termino, materia }) {
      let paralelo = new db.Paralelos({ nombre, anio, termino, materia })
      let paraleloCreada = await paralelo.Crear()
      return responses.OK(paraleloCreada)
    },
    async Obtener ({ id }) {
      let paralelo = await db.Paralelos.Obtener({ id })
      return responses.OK(paralelo)
    },
    async Actualizar ({ id, nombre, anio, termino, materia }) {
      let fueActulizado = await db.Paralelos.Actualizar({ id, nombre, anio, termino, materia })
      if (fueActulizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Paralelos.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async AnadirEstudiante ({ paralelosId, estudiantesId }) {
      let fueAnadido = await db.Paralelos.AnadirEstudiante({ paralelosId, estudiantesId })
      if (fueAnadido) {
        return responses.OK('Anadido correctamente')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async EliminarEstudiante ({ paralelosId, estudiantesId }) {
      let fueEliminado = await db.Paralelos.EliminarEstudiante({ paralelosId, estudiantesId })
      if (fueEliminado) {
        return responses.OK('Eliminado el estudiante del paralelo')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async AnadirProfesor ({ paralelosId, profesoresId }) {
      let fueAnadido = await db.Paralelos.AnadirProfesor({ paralelosId, profesoresId })
      if (fueAnadido) {
        return responses.OK('Anadido profesor correctamente')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async EliminarProfesor ({ paralelosId, profesoresId }) {
      let fueEliminado = await db.Paralelos.EliminarProfesor({ paralelosId, profesoresId })
      if (fueEliminado) {
        return responses.OK('Eliminado el profesor del paralelo')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async AnadirGrupo ({ paralelosId, gruposId }) {
      let fueAnadido = await db.Paralelos.AnadirGrupo({ paralelosId, gruposId })
      if (fueAnadido) {
        return responses.OK('Anadido grupo correctamente')
      }
      return responses.NO_OK('Paralelo no existe')
    },
    async EliminarGrupo ({ paralelosId, gruposId }) {
      let fueEliminado = await db.Paralelos.EliminarGrupo({ paralelosId, gruposId })
      if (fueEliminado) {
        return responses.OK('Eliminado el grupo del paralelo')
      }
      return responses.NO_OK('Paralelo no existe')
    }
  }
  return Object.assign(Object.create(proto), {})
}
