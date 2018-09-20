let seccion = {
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

let seccionActualizar = {
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
    body: seccionActualizar,
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
