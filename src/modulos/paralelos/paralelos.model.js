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
}, { timestamps: true, versionKey: false, collection: 'paralelos', virtuals: true })

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
  ObtenerUnoPopulate (criteria, projection, options, populate) {
    return this.findOne(criteria, projection, options).populate(populate).exec()
  },
  ObtenerUno (criteria, projection, options) {
    return this.findOne(criteria, projection, options).exec()
  },
  ObtenerPopulate (criteria, projection, options, populate) {
    return this.find(criteria, projection, options).populate(populate).exec()
  },
  Obtener (criteria, projection, options) {
    return this.find(criteria, projection, options).exec()
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
  AnadirGrupo (idParalelo, idGrupo) {
    return this.updateOne(
      { _id: idParalelo },
      { $addToSet: { 'grupos': idGrupo } }
    ).then((doc) => {
      if (doc.n === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Registro de Paralelo no encontrado' }))
      if (doc.nModified === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'No se pudo modificar el registro del Paralelo' }))
      if (doc.n == doc.nModified)
        return Promise.resolve(true)
      
      return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Error al actualizar Paralelo' }))
    }).catch((err) => {
      return Promise.reject(errors.ERROR_HANDLER(err))
    })
  },
  EliminarGrupo ({ paralelosId, gruposId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ _id: paralelosId }, { 'grupos': { $in: [gruposId] } }] }, { $pull: { 'grupos': gruposId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  ObtenerEstudiantes ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }).populate('estudiantes').populate('grupos').select('-estado -profesores -nombre -anio -termino -materia -nombreMateria'))
    })
  }
}

module.exports = db.model('Paralelos', ParalelosSchema)
