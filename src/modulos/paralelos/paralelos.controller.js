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
      return responses.NO_OK(['El paralelo no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Paralelos.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['El paralelo no existe'])
    },
    async AnadirEstudiante ({ paralelosId, estudiantesId }) {
      let paraleloExiste = await db.Paralelos.Obtener({ id: paralelosId })
      let estudianteExiste = await db.Estudiantes.Obtener({ id: estudiantesId })
      if (!paraleloExiste && !estudianteExiste) {
        return responses.NO_OK(['El paralelo no existe', 'El estudiante no existe'])
      } else if (!paraleloExiste) {
        return responses.NO_OK(['El paralelo no existe'])
      } else if (!estudianteExiste) {
        return responses.NO_OK(['El estudiante no existe'])
      }
      await db.Paralelos.AnadirEstudiante({ paralelosId, estudiantesId })
      await db.Estudiantes.AnadirParalelo({ estudiantesId, paralelosId })
      return responses.OK('Agregado correctamente')
    },
    async EliminarEstudiante ({ paralelosId, estudiantesId }) {
      let fueEliminado = await db.Paralelos.EliminarEstudiante({ paralelosId, estudiantesId })      
      if (!fueEliminado) {
        return responses.NO_OK(['El paralelo o el estudiante no existe'])
      }

      // los estudiantes tienen paralelos a los que estan inscritos
      await db.Estudiantes.EliminarParalelo({ estudiantesId, paralelosId })

      // es estudiante puede estar en algun grupo inscrito o no. El retorno puedes ser true o false y esto depende si es
      // que el estudiante fue inscrito en un grupo antes de ser eliminado
      await db.Grupos.EliminarEstudiantePorParalelo({ paralelosId, estudiantesId })

      return responses.OK('Eliminado el estudiante del paralelo')
    },
    async AnadirProfesor ({ paralelosId, profesoresId }) {
      let fueAnadido = await db.Paralelos.AnadirProfesor({ paralelosId, profesoresId })

      // los profesor tienen una lista de paralelo a los cuales dan clase
      let fueAnadidoParaleloAlProfesor = await db.Profesores.AnadirParalelo({ profesoresId, paralelosId })
      if (!fueAnadido && !fueAnadidoParaleloAlProfesor) {
        return responses.NO_OK(['El paralelo no existe', 'El profesor no existe'])
      } else if (!fueAnadido) {
        return responses.NO_OK(['El paralelo no existe'])
      } else if (!fueAnadidoParaleloAlProfesor) {
        return responses.NO_OK(['El profesor no existe'])
      }
      return responses.OK('Anadido profesor correctamente')
    },
    async EliminarProfesor ({ paralelosId, profesoresId }) {
      // los profesores tienen paralelos db.Profesores.EliminarParalelo ({ profesoresId, paralelosId })
      // los profesores tienen grupos que pertenecen al paralelo que se elimina
      let fueEliminado = await db.Paralelos.EliminarProfesor({ paralelosId, profesoresId })
      if (fueEliminado) {
        return responses.OK('Eliminado el profesor del paralelo')
      }
      return responses.NO_OK(['Paralelo no existe'])
    },
    async AnadirGrupo ({ paralelosId, gruposId }) {
      let fueAnadido = await db.Paralelos.AnadirGrupo({ paralelosId, gruposId })
      if (fueAnadido) {
        return responses.OK('Agregado grupo correctamente')
      }
      return responses.NO_OK(['Paralelo no existe'])
    },
    async EliminarGrupo ({ paralelosId, gruposId }) {
      // los estudiantes tienen grupos 
      // db.Grupos.Eliminar ({ id })
      let fueEliminado = await db.Paralelos.EliminarGrupo({ paralelosId, gruposId })
      if (fueEliminado) {
        return responses.OK('Eliminado el grupo del paralelo')
      }
      return responses.NO_OK(['Paralelo no existe'])
    }
  }
  return Object.assign(Object.create(proto), {})
}
