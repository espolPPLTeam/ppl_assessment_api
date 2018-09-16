module.exports = {
  CREAR: {
    body: {
      type: 'object',
      minProperties: 2,
      additionalProperties: false,
      properties: {
        nombre: { type: 'string' },
        codigo: { type: 'string' }
      }
    },
    res: {
      type: 'object',
      minProperties: 3,
      additionalProperties: true,
      properties: {
        id: { type: 'string' },
        nombre: { type: 'string' },
        codigo: { type: 'string' }
      }
    }
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: {
        type: 'object',
        minProperties: 3,
        additionalProperties: true,
        properties: {
          id: { type: 'string' },
          nombre: { type: 'string' },
          codigo: { type: 'string' }
        }
      }
    }
  }
}
