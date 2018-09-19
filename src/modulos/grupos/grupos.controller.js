const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let grupos = await db.Grupos.ObtenerTodos()
        return responses.OK(grupos)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let grupos = await db.Grupos.Obtener({ id })
      return responses.OK(grupos)
    },
    async Crear ({ nombre, paralelo }) {
      let grupo = new db.Grupos({ nombre, paralelo })
      let grupoCreado = await grupo.Crear()
      return responses.OK(grupoCreado)
    },
    async Actualizar ({ id, nombre }) {
      let fueActualizado = await db.Grupos.Actualizar({ id, nombre })
      if (fueActualizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['El grupo no existe'])
    },
    async Eliminar ({ id }) {
      let fueEliminado = await db.Grupos.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['El grupo no existe'])
    },
    async AnadirEstudiante ({ gruposId, estudiantesId }) {
      let grupoExiste = await db.Grupos.Obtener({ id: gruposId })
      let estudianteExiste = await db.Estudiantes.Obtener({ id: estudiantesId })
      if (!grupoExiste && !estudianteExiste) {
        return responses.NO_OK(['El grupo no existe', 'El estudiante no existe'])
      } else if (!grupoExiste) {
        return responses.NO_OK(['El grupo no existe'])
      } else if (!estudianteExiste) {
        return responses.NO_OK(['El estudiante no existe'])
      }

      await Promise.all([
        db.Grupos.AnadirEstudiante({ gruposId, estudiantesId }),
        db.Estudiantes.AnadirGrupo({ gruposId, estudiantesId })
      ])
      return responses.OK('Agregado correctamente')
    },
    async EliminarEstudiante ({ gruposId, estudiantesId }) {
      let fueEliminado = await db.Grupos.EliminarEstudiante({ gruposId, estudiantesId })
      if (!fueEliminado) {
        return responses.NO_OK(['El grupo o el estudiante no existe'])
      }
      await db.Estudiantes.EliminarGrupo({ estudiantesId, gruposId })
      return responses.OK('Eliminado el estudiante del grupo')
    }
  }
  return Object.assign(Object.create(proto), {})
}
