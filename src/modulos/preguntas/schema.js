let pregunta = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    tiempoEstimado: { type: 'number', minimum: 1, maximun: 50 },
    creador: { type: 'string' },
    tipoPregunta: { type: 'string', enum: ['v/f', 'opcionMultiple', 'justificacion'] },
    puntaje: { type: 'number', minimum: 1, maximun: 50 },
    descripcion: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}

let preguntaCrear = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string' },
    tiempoEstimado: { type: 'number', minimum: 1, maximun: 50 },
    creador: { type: 'string' },
    tipoPregunta: { type: 'string', enum: ['v/f', 'opcionMultiple', 'justificacion'] },
    puntaje: { type: 'number', minimum: 1, maximun: 50 },
    descripcion: { type: 'string' }
  }
}

let pregunaActualizar = preguntaCrear

module.exports = {
  CREAR: {
    body: preguntaCrear,
    res: pregunta
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: pregunta
    }
  },
  OBTENER: {
    res: pregunta
  },
  ACTUALIZAR: {
    body: pregunaActualizar
  }
}
