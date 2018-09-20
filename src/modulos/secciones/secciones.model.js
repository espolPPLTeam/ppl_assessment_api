let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const SeccionesModel = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  creador: { // <= deberia ir quemado?
    type: String,
    ref: 'Profesores'
  },
  preguntas: [{
    type: String,
    ref: 'Preguntas'
  }],
  capitulo: {
    type: String,
    ref: 'Capitulos'
  },
  tipo: {
    type: String,
    enum: ['tutorial', 'laboratorio']
  }
}, { timestamps: true, versionKey: false, collection: 'secciones' })

SeccionesModel.virtual('id').get(function () {
  return this._id
})

SeccionesModel.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

SeccionesModel.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

SeccionesModel.statics = {
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
  }
}

module.exports = db.model('Secciones', SeccionesModel)
