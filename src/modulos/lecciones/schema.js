let leccion = {
  type: 'object',
  minProperties: 12,
  additionalProperties: true,
  properties: {
    id: { type: 'string', minLength: 2 },
    nombre: { type: 'string', minLength: 2 },
    capitulo: { type: 'string', minLength: 2 },
    creador: { type: 'string', minLength: 2 },
    secciones: {
      type: 'array',
      contains: { type: 'string' }
    },
    tiempoEstimadoEnMinutos: { type: 'number', minimum: 2 },
    puntaje: { type: 'number', minimum: 2 },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] },
    paralelo: { type: 'string', minimum: 2 },
    fechaInicio: { type: 'string', minimum: 2 },
    fechaFin: { type: 'string', minimum: 2 },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  }
}

let leccionCrear = {
  type: 'object',
  minProperties: 9,
  additionalProperties: false, // por el campo fechaFin, puede o no existir
  properties: {
    nombre: { type: 'string', minLength: 2 },
    capitulo: { type: 'string', minLength: 2 },
    creador: { type: 'string', minLength: 2 },
    secciones: {
      type: 'array',
      contains: { type: 'string' }
    },
    tiempoEstimadoEnMinutos: { type: 'number', minimum: 2 },
    puntaje: { type: 'number', minimum: 2 },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] },
    paralelo: { type: 'string', minimum: 2 },
    fechaInicio: { type: 'string', minimum: 2 }
  }
}

let seccionesQuery = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    seccionesIds: { type: 'string', minLength: 2 }
  }
}

let leccionActualizar = {
  type: 'object',
  minProperties: 8,
  additionalProperties: false,
  properties: {
    nombre: { type: 'string', minLength: 2 },
    capitulo: { type: 'string', minLength: 2 },
    creador: { type: 'string', minLength: 2 },
    tiempoEstimadoEnMinutos: { type: 'number', minimum: 2 },
    puntaje: { type: 'number', minimum: 2 },
    tipo: { type: 'string', enum: ['tutorial', 'laboratorio'] },
    paralelo: { type: 'string', minimum: 2 },
    fechaInicio: { type: 'string', minimum: 2 }
  }
}

module.exports = {
  CREAR: {
    body: leccionCrear,
    res: leccion
  },
  OBTENER_TODOS: {
    res: {
      type: 'array',
      items: leccion
    }
  },
  OBTENER: {
    res: leccion
  },
  ACTUALIZAR: {
    body: leccionActualizar
  },
  ELIMINAR_SECCIONES: {
    query: seccionesQuery
  },
  ANADIR_SECCIONES: {
    query: seccionesQuery
  }
}
