const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async ActualizarOCrear ({ id, estudiante, pregunta, paralelo, grupo, respuesta, imagen }) {
      try {
        let respuestaExiste = null

        if (id) {
          let idTemporal = id.split(',')[0]
          respuestaExiste = await db.Respuestas.Obtener({ id: idTemporal })
        }
        // actualizar
        if (respuestaExiste) {
          let fueActualizado = await db.Respuestas.Actualizar({ id, estudiante, pregunta, paralelo, grupo, respuesta, imagen })
          if (!fueActualizado) {
            return responses.NO_OK(['Ocurrio un error al actualizar su respuesta'])
          }
          return responses.OK('Actualizado correctamente')
        }

        // crear
        let respuestaCrear = new db.Respuestas({ estudiante, pregunta, paralelo, grupo, respuesta, imagen })
        let respuestaCreada = await respuestaCrear.Crear()
        return responses.CREADO(respuestaCreada)
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    }
  }
  return Object.assign(Object.create(proto), {})
}
