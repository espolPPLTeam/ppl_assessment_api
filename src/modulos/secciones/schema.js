let seccion = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    descripcion: { type: 'string' },
    creador: { type: 'string' },
    preguntas: { type: 'array', contains: { type: 'string' } },
    capitulo: { type: 'string' },
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
    nombre: { type: 'string' },
    descripcion: { type: 'string' },
    creador: { type: 'string' },
    preguntas: { type: 'array', contains: { type: 'string' } },
    capitulo: { type: 'string' },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] }
  }
}

let seccionActualizar = {
  type: 'object',
  minProperties: 5,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string' },
    descripcion: { type: 'string' },
    creador: { type: 'string' },
    capitulo: { type: 'string' },
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
