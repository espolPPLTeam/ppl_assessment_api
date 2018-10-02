const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let grupos = await db.Grupos.Obtener({}, {}, { lean: true })
        return responses.OK(grupos)
      } catch (err) {
        console.log(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async ObtenerPorId (idGrupo) {
      try {
        const populate = [
          {
            path: 'estudiantes',
            select: '_id nombres apellidos'
          },
          {
            path: 'paralelo',
            select: '_id nombreMateria nombre materia'
          }
        ]
        const criteria = { _id: idGrupo }
        const options = { lean: true }
        let grupos = await db.Grupos.ObtenerUnoPopulate( criteria, {}, options, populate)
        return responses.OK(grupos)
      } catch (err) {
        console.log(err)
        return responses.ERROR_SERVIDOR 
      }      
    },
    async Crear ({ nombre, paralelo }) {
      try {
        let grupo = new db.Grupos({ nombre, paralelo })
        let grupoCreado = await grupo.Crear()
        await db.Paralelos.AnadirGrupo(paralelo, grupoCreado._id)
        return responses.OK({ _id: grupoCreado._id })
      } catch (err) {
        return responses.NO_OK(err.message)
      }
    },
    async Actualizar (id, nombre) {
      try {
        await db.Grupos.Actualizar(id, nombre)
        return responses.OK()
      } catch (err) {
        return responses.NO_OK(err.message)
      }
    },
    /*
      FIX:  Documentos comprometidos:
      // profesores, estudiantes, paralelos, calificaciones, respuestas, rubricas
    */
    async Eliminar (id) {
      try {
        let fueEliminado = await db.Grupos.Eliminar({ _id: id })
        if (!fueEliminado) {
          return responses.REGISTRO_NO_ENCONTRADO('Grupo no encontrado')
        }
        return responses.OK()
      } catch (err) {
        console.log(err)
        return responses.NO_OK(err.message)
      }
      
      /*if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }*/

      //return responses.NO_OK(['El grupo no existe'])
    },

    async AnadirEstudiante (idGrupo, idEstudiante, idParalelo) {
      try {
        let values = await Promise.all([
          db.Grupos.ObtenerUno({ _id: idGrupo }, {}, { lean: true }),
          db.Estudiantes.ObtenerUno({ _id: idEstudiante }, {}, { lean: true })
        ])
        const grupo = values[0]
        const estudiante = values[1]

        if (!grupo && !estudiante) {
          return responses.NO_OK('El grupo no existe. El estudiante no existe')
        }
        if (!grupo) {
          return responses.NO_OK('El grupo no existe')
        }
        if (!estudiante) {
          return responses.NO_OK('El estudiante no existe')
        }

        let grupoActual = estudiante.grupos.find((grupo) => {
          return grupo.estado === 'activo' && grupo.paralelo === idParalelo
        })

        if (grupoActual) {
          await Promise.all([
            db.Estudiantes.CambiarEstadoGrupo(idEstudiante, grupoActual._id, 'inactivo'),
            db.Grupos.EliminarEstudiante(grupoActual.grupo, idEstudiante)
          ])
        }
        await Promise.all([
          db.Grupos.AnadirEstudiante(idGrupo, idEstudiante),
          db.Estudiantes.AnadirGrupo(idEstudiante, idGrupo, idParalelo, 'activo')
        ])
        return responses.OK('Agregado correctamente')
      } catch (err) {
        return responses.NO_OK(err.message)
      }
    },

    async EliminarEstudiante (idGrupo, idEstudiante) {
      try {
        let values = await Promise.all([
          db.Grupos.ObtenerUno({ _id: idGrupo }, {}, { lean: true }),
          db.Estudiantes.ObtenerUno({ _id: idEstudiante }, {}, { lean: true })
        ])
        const grupo = values[0]
        const estudiante = values[1]

        if (!grupo && !estudiante) {
          return responses.NO_OK('El grupo no existe. El estudiante no existe')
        }
        if (!grupo) {
          return responses.NO_OK('El grupo no existe')
        }
        if (!estudiante) {
          return responses.NO_OK('El estudiante no existe')
        }

        let grupoActual = estudiante.grupos.find((grupo) => {
          return grupo.estado === 'activo' && grupo.paralelo === idParalelo
        })

        if (grupoActual) {
          await Promise.all([
            db.Estudiantes.CambiarEstadoGrupo(idEstudiante, grupoActual._id, 'inactivo'),
            db.Grupos.EliminarEstudiante(grupoActual.grupo, idEstudiante)
          ])
        }
        return responses.OK('Eliminado el estudiante del grupo')
      } catch (err) {
        return responses.NO_OK(err.message)
      }
      
    },
    /* async BulkCreate ({ nombre, paralelo, estudiantes }) {
      let grupo = new db.Grupos({ nombre, paralelo, estudiantes })
      let grupoCreado = await grupo.Crear()
      await db.Paralelos.AnadirGrupo({ paralelosId: paralelo, gruposId: grupoCreado._id })
      const promises = estudiantes.map(async (estudiante) => {
        await db.Estudiantes.AnadirGrupo({ idEstudiante: estudiante, gruposId: grupoCreado._id })
      })
      await Promise.all(promises)
      return responses.OK('Agregado correctamente')
    } */
  }
  return Object.assign(Object.create(proto), {})
}
