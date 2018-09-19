let grupo = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    estudiantes: { type: 'array' },
    paralelo: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}

let grupoActualizar = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string' },
    paralelo: { type: 'string' }
  }
}

module.exports = {
  CREAR: {
    body: grupoActualizar,
    res: grupo
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: grupo
    }
  },
  OBTENER: {
    res: grupo
  },
  ACTUALIZAR: {
    body: grupoActualizar
  }
}
