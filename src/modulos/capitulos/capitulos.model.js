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
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  Actualizar ({ id, nombre, materia }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { nombre, materia } }).then((accionEstado) => {
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
  AnadirSeccion ({ capitulosId, seccionesId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: capitulosId }, { $addToSet: { 'secciones': seccionesId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarSeccion ({ capitulosId, seccionesId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: capitulosId }, { 'secciones': { $in: [seccionesId] } }] }, { $pull: { 'secciones': seccionesId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }
}

module.exports = db.model('Capitulos', CapitulosSchema)
