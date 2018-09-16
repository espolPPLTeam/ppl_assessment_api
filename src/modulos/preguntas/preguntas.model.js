let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const PreguntasModel = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    required: true
  },
  tiempoEstimado: {
    type: Number,
    required: true
  },
  creador: {
    type: String,
    ref: 'Profesores',
    required: true
  },
  tipoPregunta: {
    type: String,
    enum: ['v/f', 'opcionMultiple', 'justificacion'],
    'default': 'justificacion'
  },
  puntaje: {
    type: Number
  },
  descripcion: {
    type: String
  }
}, { timestamps: true, versionKey: false, collection: 'preguntas' })

PreguntasModel.virtual('id').get(function () {
  return this._id
})

PreguntasModel.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

PreguntasModel.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

PreguntasModel.statics = {
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

module.exports = db.model('Preguntas', PreguntasModel)
