let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const EstudiantesSchema = mongoose.Schema({
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
  carrera: {
    type: String
  },
  matricula: {
    type: String,
    required: true,
    unique: true
  },
  correo: {
    type: String,
    unique: true
  },
  clave: {
    type: String
  },
  lecciones: [{
    type: String,
    ref: 'Lecciones'
  }],
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
}, { timestamps: true, versionKey: false, collection: 'estudiantes' })

EstudiantesSchema.virtual('id').get(function () {
  return this._id
})

EstudiantesSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

EstudiantesSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

EstudiantesSchema.statics = {
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

module.exports = db.model('Estudiantes', EstudiantesSchema)
