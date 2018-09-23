const responses = require('../../config/responses')
module.exports = ({ db, logger }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let capitulos = await db.Capitulos.ObtenerTodos()
        return responses.OK(capitulos)
      } catch (err) {
        logger.error('CAPITULOS-GET-ObtenerTodos', err)
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      try {
        let capitulo = await db.Capitulos.Obtener({ id })
        return responses.OK(capitulo)
      } catch (err) {
        logger.error('CAPITULOS-GET-Obtener', err)
        return responses.ERROR_SERVIDOR
      }
    },
    async Crear ({ nombre, materia }) {
      try {
        let capitulo = new db.Capitulos({ nombre, materia })
        let capituloCreado = await capitulo.Crear()
        return responses.OK(capituloCreado)
      } catch (err) {
        logger.error('CAPITULOS-POST-Crear', err)
        return responses.ERROR_SERVIDOR
      }
    },
    async Actualizar ({ id, nombre, materia }) {
      try {
        let fueActualizado = await db.Capitulos.Actualizar({ id, nombre, materia })
        if (fueActualizado) {
          return responses.OK('Actualizado correctamente')
        }
        return responses.NO_OK(['El capitulo no existe'])
      } catch (err) {
        logger.error('CAPITULOS-PUT-Actualizar', err)
        return responses.ERROR_SERVIDOR
      }
    },
    async Eliminar ({ id }) {
      try {
        let fueEliminado = await db.Capitulos.Eliminar({ id })
        if (fueEliminado) {
          return responses.OK('Eliminado correctamente')
        }
        return responses.NO_OK(['El capitulo no existe'])
      } catch (err) {
        logger.error('CAPITULOS-DELETE-Eliminar', err)
        return responses.ERROR_SERVIDOR
      }
    },
    async AnadirSeccion ({ capitulosId, seccionesId }) {
      try {
        let capituloExiste = await db.Capitulos.Obtener({ id: capitulosId })
        let seccionExiste = await db.Secciones.Obtener({ id: seccionesId })
        if (!capituloExiste && !seccionExiste) {
          return responses.NO_OK(['El capitulo no existe', 'La seccion no existe'])
        } else if (!capituloExiste) {
          return responses.NO_OK(['El capitulo no existe'])
        } else if (!seccionExiste) {
          return responses.NO_OK(['La seccion no existe'])
        }
        await db.Capitulos.AnadirSeccion({ capitulosId, seccionesId })
        return responses.OK('Agregado correctamente')
      } catch (err) {
        logger.error('CAPITULOS-PUT-AnadirSeccion', err)
        return responses.ERROR_SERVIDOR
      }
    },
    async EliminarSeccion ({ capitulosId, seccionesId }) {
      try {
        let fueEliminado = await db.Capitulos.EliminarSeccion({ capitulosId, seccionesId })
        if (!fueEliminado) {
          return responses.NO_OK(['El capitulo o la seccion no existe'])
        }
        return responses.OK('Eliminada la seccion del capitulo')
      } catch (err) {
        logger.error('CAPITULOS-DELETE-EliminarSeccion', err)
        return responses.ERROR_SERVIDOR
      }
    }
  }
  return Object.assign(Object.create(proto), {})
}
