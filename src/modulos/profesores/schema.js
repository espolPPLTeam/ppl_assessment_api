let profesor = {
  type: 'object',
  minProperties: 7,
  additionalProperties: false,
  properties: {
    estado: { type: 'string' },
    nombres: { type: 'string' },
    apellidos: { type: 'string' },
    correo: { type: 'string', format: 'email' },
    id: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}

let profesorActualizar = {
  type: 'object',
  minProperties: 2,
  additionalProperties: false,
  properties: {
    nombres: { type: 'string' },
    apellidos: { type: 'string' }
  }
}

module.exports = {
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: profesor
    }
  },
  OBTENER: {
    res: profesor
  },
  ACTUALIZAR: {
    body: profesorActualizar
  }
}
