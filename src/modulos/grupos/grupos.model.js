let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const validators = require('../../config/validators')
const errors = require('../../config/errors')

const GruposSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: {
    type: String,
    required: [true, 'El campo "Nombre"es obligatorio'],
    validate: [
      { validator: validators.noSpecialChars, msg: 'El campo "Nombre" no acepta caracteres especiales' },
      { validator: validators.notEmpty, msg: 'El campo "Nombre" no puede estar vacío' }
    ]
  },
  estudiantes: [{
    type: String,
    ref: 'Estudiantes'
  }],
  paralelo: {
    type: String,
    ref: 'Paralelos',
    required: [true, 'El campo "Paralelo"es obligatorio'],
    validate: [
      { validator: validators.notEmpty, msg: 'El campo "Paralelo" no puede estar vacío' }
    ]
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
    return this.save().then((doc) => {
      return Promise.resolve(doc)
    }).catch((err) => {
      return Promise.reject(errors.ERROR_HANDLER(err))
    })
  }
}

GruposSchema.statics = {
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
  Actualizar (id, nombre) {
    return new Promise((resolve, reject) => {
      return this.updateOne(
        { _id: id },
        {
          $set: { nombre: nombre }
        },
        { runValidators: true }
      ).then((doc) => {
        if (doc.n === 0)
          return reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Registro de Grupo no encontrado' }))
        if (doc.nModified === 0)
          return reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'No se pudo modificar el registro de Grupo' }))
        if (doc.n == doc.nModified)
          return resolve(true)
        console.log(doc)
        return reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Error al actualizar Grupo' }))
      }).catch((err) => {
        return reject(errors.ERROR_HANDLER(err))
      })
    })    
  },
  Eliminar (criteria) {
    return this.findOneAndDelete(criteria).then((doc) => {
      return Promise.resolve(doc)
    }).catch((err) => {
      return Promise.reject(err)
    })
  },
  /* EliminarEstudiantePorParalelo ({ paralelosId, idEstudiante }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ paralelo: paralelosId }, { 'estudiantes': { $in: [idEstudiante] } }] }, { $pull: { 'estudiantes': idEstudiante } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }, */
  AnadirEstudiante (idGrupo, idEstudiante) {
    return this.updateOne(
      { _id: idGrupo },
      { $addToSet: { 'estudiantes': idEstudiante } }
    ).then((doc) => {
      if (doc.n === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Registro del Grupo no encontrado' }))
      if (doc.nModified === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'No se pudo modificar el registro del Grupo' }))
      if (doc.n == doc.nModified)
        return Promise.resolve(true)

      return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Error al actualizar Grupo' }))
    }).catch((err) => {
      return Promise.reject(errors.ERROR_HANDLER(err))
    })
  },
  EliminarEstudiante (idGrupo, idEstudiante) {
    return this.updateOne(
      { _id: idGrupo, estudiantes: idEstudiante },
      { $pull: { estudiantes: idEstudiante } }
    ).then((doc) => {
      if (doc.n === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Registro del Grupo no encontrado' }))
      if (doc.nModified === 0)
        return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'No se pudo modificar el registro del Grupo' }))
      if (doc.n == doc.nModified)
        return Promise.resolve(true)
      
      return Promise.reject(errors.ERROR_HANDLER({ name: 'UpdateError', message: 'Error al actualizar Grupo' }))
    }).catch((err) => {
      return Promise.reject(errors.ERROR_HANDLER(err))
    })
  }
}

module.exports = db.model('Grupos', GruposSchema)
