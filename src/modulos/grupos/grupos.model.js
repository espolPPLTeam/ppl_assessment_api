let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const GruposSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    required: true
  },
  estudiantes: [{
    type: String,
    ref: 'Estudiantes'
  }],
  paralelo: {
    type: String,
    ref: 'Paralelos'
  }
}, { timestamps: true, versionKey: false, collection: 'grupos' })

GruposSchema.virtual('id').get(function () {
  return this._id
})

GruposSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

GruposSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

GruposSchema.statics = {
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

module.exports = db.model('Grupos', GruposSchema)
