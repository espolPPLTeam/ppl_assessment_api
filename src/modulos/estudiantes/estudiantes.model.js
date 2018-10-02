let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const validators = require('../../config/validators')
const errors = require('../../config/errors')

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
  email: {
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
    grupo: {
      type: String,
      ref: 'Grupos',
      required: true
    },
    paralelo: {
      type: String,
      ref: 'Paralelos',
      required: true
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo'
    }
  }],
  estado: {
    type: String,
    enum: ['activo', 'retirado'],
    'default': 'activo'
  }
}, { timestamps: true, versionKey: false, collection: 'estudiantes', virtuals: true })

EstudiantesSchema.index({ email: 1 })

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
  ObtenerUnoPopulate (criteria, projection, options, projectionLecciones, projectionParalelos, projectionGrupos) {
    return this.findOne(criteria, projection, options)
      .populate('lecciones', projectionLecciones)
      .populate('paralelos', projectionParalelos)
      .populate('grupos', projectionGrupos)
      .exec()
  },
  ObtenerUno (criteria, projection, options) {
    return this.findOne(criteria, projection, options).exec()
  },
  ObtenerPopulate (criteria, projection, options, projectionEstudiantes, projectionParalelos) {
    return this.find(criteria, projection, options)
      .populate('lecciones', projectionLecciones)
      .populate('paralelos', projectionParalelos)
      .populate('grupos', projectionGrupos)
      .exec()
  },
  Obtener (criteria, projection, options) {
    return this.find(criteria, projection, options).exec()
  },
  Actualizar ({ email, nombres, apellidos, carrera, matricula }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ email }, { $set: { nombres, apellidos, carrera, matricula } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  Eliminar ({ email }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ email }, { $set: { estado: 'inactivo' } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  AnadirParalelo ({ estudiantesId, paralelosId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ email: estudiantesId }, { $addToSet: { 'paralelos': paralelosId } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  EliminarParalelo ({ estudiantesId, paralelosId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ email: estudiantesId }, { 'paralelos': { $in: [paralelosId] } }] }, { $pull: { 'paralelos': paralelosId } }).then((accionEstado) => {
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
  },
  AnadirGrupo (idEstudiante, idGrupo, idParalelo, estado) {
    const self = this
    return this.updateOne(
      { _id: idEstudiante },
      { 
        $addToSet: {
          grupos: {
            grupo: idGrupo,
            paralelo: idParalelo,
            estado: estado
          }
        } 
      }
    ).then((doc) => {
      if (doc.n === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Registro de Estudiante no encontrado' }))
      if (doc.nModified === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'No se pudo modificar el registro de Estudiante' }))
      if (doc.n == doc.nModified)
        return Promise.resolve(true)
      return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Error al actualizar Estudiante' }))
    }).catch((err) => {
      return Promise.reject(errors.ERROR_HANDLER(err))
    })    
  },
  CambiarEstadoGrupo (idEstudiante, idGrupo, estado) {
    return this.updateOne(
        { _id: idEstudiante, "grupos._id": idGrupo },
        { $set: { "grupos.$.estado": estado } }
    ).then((doc) => {
      if (doc.n === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Registro de Estudiante no encontrado' }))
      if (doc.nModified === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'No se pudo modificar el registro de Estudiante' }))
      if (doc.n == doc.nModified)
        return Promise.resolve(true)
      return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Error al actualizar Estudiante' }))
    }).catch((err) => {
      return Promise.reject(errors.ERROR_HANDLER(err))
    })
  }
}

module.exports = db.model('Estudiantes', EstudiantesSchema)
