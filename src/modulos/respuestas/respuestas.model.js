let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const RespuestasModel = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  estudiante: {
    type: String,
    ref: 'Estudiantes'
  },
  pregunta: {
    type: String,
    ref: 'Preguntas'
  },
  paralelo: {
    type: String,
    ref: 'Paralelos'
  },
  grupo: {
    type: String,
    ref: 'Grupos'
  },
  respuesta: {
    type: String
  },
  imagen: {
    type: String
  },
  calificada: {
    type: Boolean,
    'default': false
  },
  calificacion: {
    type: Number,
    enum: [0, 1, 2],
    'default': 0
  },
  feedback: {
    type: String
  }
}, { timestamps: true, versionKey: false, collection: 'respuestas' })

RespuestasModel.virtual('id').get(function () {
  return this._id
})

RespuestasModel.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

RespuestasModel.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

RespuestasModel.statics = {
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

module.exports = db.model('Respuestas', RespuestasModel)
