let seccion = {
  type: 'object',
  minProperties: 9,
  additionalProperties: false,
  properties: {
    id: { type: 'string', minLength: 2 },
    nombre: { type: 'string', minLength: 2 },
    descripcion: { type: 'string', minLength: 2 },
    creador: { type: 'string', minLength: 2 },
    preguntas: {
      type: 'array',
      contains: { type: 'string' }
    },
    capitulo: { type: 'string', minLength: 2 },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}

let seccionCrear = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string', minLength: 2 },
    descripcion: { type: 'string' },
    creador: { type: 'string', minLength: 2 },
    preguntas: {
      type: 'array',
      contains: { type: 'string' },
      minItems: 1,
      uniqueItems: true
    },
    capitulo: { type: 'string', minLength: 2 },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] }
  }
}

let seccionActualizar = {
  type: 'object',
  minProperties: 5,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string', minLength: 2 },
    descripcion: { type: 'string', minLength: 2 },
    creador: { type: 'string', minLength: 2 },
    capitulo: { type: 'string', minLength: 2 },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] }
  }
}

module.exports = {
  CREAR: {
    body: seccionCrear,
    res: seccion
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: seccion
    }
  },
  OBTENER: {
    res: seccion
  },
  ACTUALIZAR: {
    body: seccionActualizar
  }
}
