let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const LeccionesSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    required: true
  },
  capitulo: {
    type: String,
    ref: 'Capitulos'
  },
  secciones: [{
    type: String,
    ref: 'Secciones'
  }],
  creador: {
    type: String,
    ref: 'Profesor'
  },
  tiempoEstimadoEnMinutos: {
    type: Number,
    required: true
  },
  puntaje: {
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    enum: ['tutorial', 'laboratorio'],
    required: true
  },
  paralelo: {
    type: String,
    ref: 'Paralelos',
    required: true
  },
  fechaInicio: {
    type: Date
  },
  fechaFin: {
    type: Date
  }
}, { timestamps: true, versionKey: false, collection: 'lecciones' })

LeccionesSchema.virtual('id').get(function () {
  return this._id
})

LeccionesSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

LeccionesSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

LeccionesSchema.statics = {
  ObtenerTodos () {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.find({}))
    })
  },
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  Actualizar ({ id, nombre, capitulo, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { nombre, capitulo, creador, tiempoEstimadoEnMinutos, puntaje, tipo, paralelo, fechaInicio } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  Eliminar ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      self.findOneAndDelete({ _id: id }).then((accionEstado) => {
        resolve(!!accionEstado)
      })
    })
  },
  AnadirSecciones ({ leccionesId, seccionesIds }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: leccionesId }, { $addToSet: { 'secciones': seccionesIds } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarSecciones ({ leccionesId, seccionesIds }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: leccionesId }] }, { $pull: { 'secciones': { $in: seccionesIds } } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }
  // Terminar ({ }) {

  // }
}

module.exports = db.model('Lecciones', LeccionesSchema)
