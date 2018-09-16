let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const RubricasModel = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  materia: {
    type: String,
    ref: 'Materias'
  },
  paralelo: {
    type: String,
    ref: 'Paralelos'
  },
  grupo: {
    type: String,
    ref: 'Grupos'
  },
  capitulo: {
    type: String,
    ref: 'Capitulos'
  },
  ejercicio: {
    type: String,
    required: true
  },
  calificacion: [{
    type: String
  }],
  total: { // cuanto se lleva en la calificacion
    type: Number,
    required: true
  },
  evaluador: {
    type: String,
    ref: 'Profesores'
  }
}, { timestamps: true, versionKey: false, collection: 'rubricas' })

RubricasModel.virtual('id').get(function () {
  return this._id
})

RubricasModel.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

RubricasModel.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

RubricasModel.statics = {
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

module.exports = db.model('Rubricas', RubricasModel)
