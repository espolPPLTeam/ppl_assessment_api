let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const MateriasSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    unique: true,
    required: true
  },
  codigo: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true, versionKey: false, collection: 'materias' })

MateriasSchema.virtual('id').get(function () {
  return this._id
})

MateriasSchema.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

MateriasSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

MateriasSchema.statics = {
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

module.exports = db.model('Materias', MateriasSchema)
