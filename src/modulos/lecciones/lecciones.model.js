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
  Obtener (id) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  }
}

module.exports = db.model('Lecciones', LeccionesSchema)
