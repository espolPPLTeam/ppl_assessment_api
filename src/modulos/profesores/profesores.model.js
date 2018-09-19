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
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  ObtenerTodosFiltrado () {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.find({}, { paralelos: 0, grupos: 0, clave: 0 }))
    })
  },
  ObtenerFiltrado ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }, { paralelos: 0, grupos: 0, clave: 0 }))
    })
  },
  Actualizar ({ id, nombres, apellidos, correo }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { id, nombres, apellidos, correo } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  Eliminar ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { estado: 'inactivo' } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  AnadirParalelo ({ profesoresId, paralelosId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: profesoresId }, { $addToSet: { 'paralelos': paralelosId } }).then((accionEstado) => {
        resolve(accionEstado.nModified !== 0)
      })
    })
  },
  EliminarParalelo ({ profesoresId, paralelosId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: profesoresId }, { $pull: { 'paralelos': paralelosId } }).then((accionEstado) => {
        resolve(accionEstado.nModified !== 0)
      })
    })
  },
  AnadirGrupo ({ profesoresId, gruposId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: profesoresId }, { $addToSet: { 'grupos': gruposId } }).then((accionEstado) => {
        resolve(accionEstado.nModified !== 0)
      })
    })
  },
  EliminarGrupos ({ profesoresId, gruposIds }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: profesoresId }, { $pull: { 'grupos': { $in: gruposIds } } }).then((accionEstado) => {
        resolve(accionEstado.nModified !== 0)
      })
    })
  },
  EliminarGruposDeTodos ({ gruposId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateMany({ }, { $pull: { 'grupos': gruposId } }).then((accionEstado) => {
        resolve(accionEstado.nModified !== 0)
      })
    })
  }
}

module.exports = db.model('Profesores', ProfesoresModel)
