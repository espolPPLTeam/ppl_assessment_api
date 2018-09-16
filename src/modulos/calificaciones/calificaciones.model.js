let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const CalificacionesSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  leccion: {
    type: String,
    ref: 'Lecciones'
  },
  grupo: {
    type: String,
    ref: 'Grupos'
  },
  paralelo: {
    type: String,
    ref: 'Paralelos'
  },
  participantes: [{
    type: String,
    ref: 'Estudiantes'
  }],
  calificacion: {
    type: Number,
    required: true
  },
  estudianteCalificado: {
    type: String,
    ref: 'Estudiantes'
  },
  calificada: {
    type: Boolean,
    'default': false
  }
}, { timestamps: true, versionKey: false, collection: 'calificaciones' })

CalificacionesSchema.virtual('id').get(function () {
  return this._id
})

CalificacionesSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

CalificacionesSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

CalificacionesSchema.statics = {
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

module.exports = db.model('Calificaciones', CalificacionesSchema)
