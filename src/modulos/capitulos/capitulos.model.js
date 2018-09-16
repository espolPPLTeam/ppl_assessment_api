let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const CapitulosSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String
  },
  secciones: [{
    type: String,
    ref: 'Secciones'
  }],
  materia: {
    type: String,
    ref: 'Materias'
  }
}, { timestamps: true, versionKey: false, collection: 'capitulos' })

CapitulosSchema.virtual('id').get(function () {
  return this._id
})

CapitulosSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

CapitulosSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

CapitulosSchema.statics = {
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

module.exports = db.model('Capitulos', CapitulosSchema)
