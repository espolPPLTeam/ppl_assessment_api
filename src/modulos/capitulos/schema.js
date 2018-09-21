let capitulo = {
  type: 'object',
  minProperties: 6,
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    secciones: { type: 'array' },
    materia: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}

let capituloActualizar = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string' },
    materia: { type: 'string' }
  }
}

module.exports = {
  CREAR: {
    body: capituloActualizar,
    res: capitulo
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: capitulo
    }
  },
  OBTENER: {
    res: capitulo
  },
  ACTUALIZAR: {
    body: capituloActualizar
  }
}
