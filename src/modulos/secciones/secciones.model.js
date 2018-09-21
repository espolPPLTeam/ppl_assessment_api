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
  creador: {
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
  },
  Actualizar ({ id, nombre, descripcion, creador, capitulo, tipo }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { nombre, descripcion, creador, capitulo, tipo } }).then((accionEstado) => {
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
  AnadirPregunta ({ seccionesId, preguntasId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: seccionesId }, { $addToSet: { 'preguntas': preguntasId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarPregunta ({ seccionesId, preguntasId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: seccionesId }, { 'preguntas': { $in: [preguntasId] } }] }, { $pull: { 'preguntas': preguntasId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }
}

module.exports = db.model('Secciones', SeccionesModel)
