const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      try {
        let capitulos = await db.Capitulos.ObtenerTodos()
        return responses.OK(capitulos)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Obtener ({ id }) {
      let capitulo = await db.Capitulos.Obtener({ id })
      return responses.OK(capitulo)
    },
    async Crear ({ nombre, materia }) {
      let capitulo = new db.Capitulos({ nombre, materia })
      let capituloCreado = await capitulo.Crear()
      return responses.OK(capituloCreado)
    },
    async Actualizar ({ id, nombre, materia }) {
      let fueActualizado = await db.Capitulos.Actualizar({ id, nombre, materia })
      if (fueActualizado) {
        return responses.OK('Actualizado correctamente')
      }
      return responses.NO_OK(['El capitulo no existe'])
    },
    /*
      FIX: Documentos comprometidos:
      lecciones { capitulo }, si el capitulo se borra que pasa?
      rubricas { capitulo }
      secciones { capitulo }
    */
    async Eliminar ({ id }) {
      let fueEliminado = await db.Capitulos.Eliminar({ id })
      if (fueEliminado) {
        return responses.OK('Eliminado correctamente')
      }
      return responses.NO_OK(['El capitulo no existe'])
    },
    async AnadirSeccion ({ capitulosId, seccionesId }) {
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
    },
    async EliminarSeccion ({ capitulosId, seccionesId }) {
      let fueEliminado = await db.Capitulos.EliminarSeccion({ capitulosId, seccionesId })
      if (!fueEliminado) {
        return responses.NO_OK(['El capitulo o la seccion no existe'])
      }
      return responses.OK('Eliminada la seccion del capitulo')
    }
  }
  return Object.assign(Object.create(proto), {})
}
