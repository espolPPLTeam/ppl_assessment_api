let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const ProfesoresModel = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombres: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  clave: {
    type: String
  },
  paralelos: [{
    type: String,
    ref: 'Paralelos'
  }],
  grupos: [{
    type: String,
    ref: 'Grupos'
  }],
  estado: {
    type: String,
    enum: ['activo', 'retirado'],
    'default': 'activo'
  }
}, { timestamps: true, versionKey: false, collection: 'profesores' })

ProfesoresModel.virtual('id').get(function () {
  return this._id
})

ProfesoresModel.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

ProfesoresModel.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

ProfesoresModel.statics = {
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

module.exports = db.model('Profesores', ProfesoresModel)
