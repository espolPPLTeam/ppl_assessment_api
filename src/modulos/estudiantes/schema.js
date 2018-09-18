let estudiante = {
  type: 'object',
  minProperties: 9,
  additionalProperties: false,
  properties: {
    estado: { type: 'string' },
    nombres: { type: 'string' },
    apellidos: { type: 'string' },
    matricula: { type: 'string', minLength: 9, maxLength: 9 },
    correo: { type: 'string', format: 'email' },
    id: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    carrera: { type: 'string' }
  }
}

let estudianteActualizar = {
  type: 'object',
  minProperties: 5,
  additionalProperties: false,
  properties: {
    nombres: { type: 'string' },
    apellidos: { type: 'string' },
    matricula: { type: 'string', minLength: 9, maxLength: 9 },
    correo: { type: 'string', format: 'email' },
    carrera: { type: 'string' }
  }
}

module.exports = {
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: estudiante
    }
  },
  OBTENER: {
    res: estudiante
  },
  ACTUALIZAR: {
    body: estudianteActualizar
  }
}
