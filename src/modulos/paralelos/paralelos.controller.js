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
      await Promise.all([
        // los estudiantes tienen paralelos a los que estan inscritos
        db.Estudiantes.EliminarParalelo({ estudiantesId, paralelosId }),

        // es estudiante puede estar en algun grupo inscrito o no. El retorno puedes ser true o false y esto depende si es
        // que el estudiante fue inscrito en un grupo antes de ser eliminado
        db.Grupos.EliminarEstudiantePorParalelo({ paralelosId, estudiantesId })
      ])

      return responses.OK('Eliminado el estudiante del paralelo')
    },
    async AnadirProfesor ({ paralelosId, profesoresId }) {
      let [paraleloExiste, profesorExiste] = await Promise.all([
        db.Paralelos.Obtener({ id: paralelosId }),
        db.Profesores.Obtener({ id: profesoresId })
      ])
      if (!paraleloExiste && !profesorExiste) {
        return responses.NO_OK(['El paralelo no existe', 'El profesor no existe'])
      } else if (!paraleloExiste) {
        return responses.NO_OK(['El paralelo no existe'])
      } else if (!profesorExiste) {
        return responses.NO_OK(['El profesor no existe'])
      }

      await Promise.all([
        db.Paralelos.AnadirProfesor({ paralelosId, profesoresId }),

        // los profesor tienen una lista de paralelo a los cuales dan clase
        db.Profesores.AnadirParalelo({ profesoresId, paralelosId })
      ])
      return responses.OK('Anadido profesor correctamente')
    },
    async EliminarProfesor ({ paralelosId, profesoresId }) {
      let fueEliminado = await db.Paralelos.EliminarProfesor({ paralelosId, profesoresId })
      if (!fueEliminado) {
        return responses.NO_OK(['El paralelo o el profesor no existe'])
      }

      // los profesores tienen paralelos a los que estan inscritos
      await db.Profesores.EliminarParalelo({ profesoresId, paralelosId })

      let gruposParalelo = await db.Paralelos.Obtener({ id: paralelosId })
      let grupos = gruposParalelo['grupos']
      let exitenGrupos = grupos.length
      if (exitenGrupos) {
        // eliminar los grupos que el profesor tiene de este paralelo del cual es eliminado
        await db.Profesores.EliminarGrupos({ profesoresId, gruposIds: grupos })
      }

      return responses.OK('Eliminado el profesor del paralelo')
    },
    async AnadirGrupo ({ paralelosId, gruposId }) {
      let paraleloExiste = await db.Paralelos.Obtener({ id: paralelosId })
      let grupoExiste = await db.Grupos.Obtener({ id: gruposId })

      if (!paraleloExiste && !grupoExiste) {
        return responses.NO_OK(['El paralelo no existe', 'El grupo no existe'])
      } else if (!paraleloExiste) {
        return responses.NO_OK(['El paralelo no existe'])
      } else if (!grupoExiste) {
        return responses.NO_OK(['El grupo no existe'])
      }
      await db.Paralelos.AnadirGrupo({ paralelosId, gruposId })
      return responses.OK('Anadido grupo correctamente')
    },
    async EliminarGrupo ({ paralelosId, gruposId }) {
      let fueEliminado = await db.Paralelos.EliminarGrupo({ paralelosId, gruposId })
      if (!fueEliminado) {
        return responses.NO_OK(['El paralelo o el grupo no existe'])
      }
      await Promise.all([
        // eliminar de profesores que tienen a este grupo
        db.Profesores.EliminarGruposDeTodos({ gruposId }),

        // eliminar de todos los estudiantes que tienen a este grupo
        db.Estudiantes.EliminarGruposDeTodos({ gruposId }),

        // no tiene sentido que existe un grupo sin paralelo no?
        db.Grupos.Eliminar({ id: gruposId })
      ])
      return responses.OK('Eliminado el grupo del paralelo')
    },
    async ObtenerEstudiantes ({ id }) {
      
      let options = { lean: true }

      let criteriaGrupos = {
        paralelo: id
      }
      let populateGrupos = {
        path: 'estudiantes',
        select: '_id nombres apellidos'
      }
      let projectionGrupos = '-createdAt -updatedAt -paralelo'      
      
      let criteriaParalelos = {
        _id: id
      }
      let populateParalelos = {
        path: 'estudiantes',
        select: '_id nombres apellidos'
      }
      let projectionParalelos = '-createdAt -updatedAt -grupos -profesores -nombre -estado -anio -termino -materia -nombreMateria'


      let values = await Promise.all([
        await db.Grupos.ObtenerPopulate(criteriaGrupos, projectionGrupos, options, populateGrupos),
        await db.Paralelos.ObtenerUnoPopulate(criteriaParalelos, projectionParalelos, options, populateParalelos)
      ])

      const grupos = values[0]
      const paralelo = values[1]

      // Pocas cosas en la vida son peores que esto
      for (let i = grupos.length - 1; i >= 0; i--) {
        let grupoActual = grupos[i]
        for (let j = grupoActual.estudiantes.length - 1; j >= 0; j--) {
          let estudianteActual = grupoActual.estudiantes[j]
          for (let k = paralelo.estudiantes.length - 1; k >= 0; k--) {
            if (estudianteActual._id === paralelo.estudiantes[k]._id) {
              paralelo.estudiantes.splice(k, 1)
              break
            }
          }
        }
      }

      let datos = {
        estudiantesSinGrupo: paralelo.estudiantes,
        grupos: grupos
      }
      
      return responses.OK(datos)
    }
  }
  return Object.assign(Object.create(proto), {})
}
