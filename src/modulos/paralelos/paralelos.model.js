let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const ParalelosSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    required: true
  },
  anio: {
    type: String,
    required: true
  },
  termino: {
    type: String,
    enum: ['1', '2', '3']
  },
  profesores: [{
    type: String,
    ref: 'Profesores'
  }],
  estudiantes: [{
    type: String,
    ref: 'Estudiantes'
  }],
  grupos: [{
    type: String,
    ref: 'Grupos'
  }],
  materia: {
    type: String,
    ref: 'Materia'
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    'default': 'activo'
  }
}, { timestamps: true, versionKey: false, collection: 'paralelos' })

ParalelosSchema.virtual('id').get(function () {
  return this._id
})

ParalelosSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

ParalelosSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

ParalelosSchema.statics = {
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

module.exports = db.model('Paralelos', ParalelosSchema)
