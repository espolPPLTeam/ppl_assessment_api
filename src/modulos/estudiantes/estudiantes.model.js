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
    type: String,
    'default': ''
  },
  matricula: {
    type: String
    // unique: true, verificar si da error esto cuando es vacio
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
  ObtenerTodosFiltrado () {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.find({}, { lecciones: 0, paralelos: 0, grupos: 0, clave: 0 }))
    })
  },
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  ObtenerFiltrado ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }, { lecciones: 0, paralelos: 0, grupos: 0, clave: 0 }))
    })
  },
  Actualizar ({ id, nombres, apellidos, carrera, matricula, correo }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: id }, { $set: { nombres, apellidos, carrera, matricula, correo } }).then((accionEstado) => {
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
  AnadirParalelo ({ estudiantesId, paralelosId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ _id: estudiantesId }, { $addToSet: { 'paralelos': paralelosId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarParalelo ({ estudiantesId, paralelosId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: estudiantesId }, { 'paralelos': { $in: [paralelosId] } }] }, { $pull: { 'paralelos': paralelosId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarGruposDeTodos ({ gruposId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateMany({ }, { $pull: { 'grupos': gruposId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }
}

module.exports = db.model('Estudiantes', EstudiantesSchema)
