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
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  Actualizar ({ id, nombre, anio, termino, materia }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { nombre, anio, termino, materia } }).then((accionEstado) => {
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
  AnadirEstudiante ({ paralelosId, estudiantesId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: paralelosId }, { $addToSet: { 'estudiantes': estudiantesId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarEstudiante ({ paralelosId, estudiantesId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: paralelosId }, { 'estudiantes': { $in: [estudiantesId] } }] }, { $pull: { 'estudiantes': estudiantesId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  AnadirProfesor ({ paralelosId, profesoresId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: paralelosId }, { $addToSet: { 'profesores': profesoresId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarProfesor ({ paralelosId, profesoresId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: paralelosId }, { 'profesores': { $in: [profesoresId] } }] }, { $pull: { 'profesores': profesoresId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  AnadirGrupo ({ paralelosId, gruposId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: paralelosId }, { $addToSet: { 'grupos': gruposId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarGrupo ({ paralelosId, gruposId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: paralelosId }, { 'grupos': { $in: [gruposId] } }] }, { $pull: { 'grupos': gruposId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }
}

module.exports = db.model('Paralelos', ParalelosSchema)
