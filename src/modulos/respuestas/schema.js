let respuestaActualizarOCrear = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    estudiante: { type: 'string', minLength: 2 },
    pregunta: { type: 'string', minLength: 2 },
    paralelo: { type: 'string', minLength: 2 },
    grupo: { type: 'string', minLength: 2 },
    respuesta: { type: 'string' },
    imagen: { type: 'string' }
  }
}

module.exports = {
  CREAR_O_ACTUALIZAR: {
    body: respuestaActualizarOCrear
  }
}
