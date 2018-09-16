let paralelo = {
  type: 'object',
  minProperties: 9,
  additionalProperties: true,
  properties: {
    id: { type: 'string' },
    profesores: { type: 'array' },
    estudiantes: { type: 'array' },
    grupos: { type: 'array' },
    estado: { type: 'string' },
    nombre: { type: 'string' },
    anio: { type: 'string' },
    termino: { type: 'string' },
    materia: { type: 'string' }
  }
}

let paraleloBasico = {
  type: 'object',
  minProperties: 4,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string' },
    anio: { type: 'string' },
    termino: { type: 'string', enum: ['1', '2', '3'] },
    materia: { type: 'string' }
  }
}

module.exports = {
  CREAR: {
    body: paraleloBasico,
    res: paralelo
  },
  OBTENER: {
    res: paralelo
  },
  ACTUALIZAR: {
    body: paraleloBasico
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: paralelo
    }
  }
}
