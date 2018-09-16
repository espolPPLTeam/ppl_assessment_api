const mongoose = require('mongoose')
mongoose.Promise = Promise
var db

let Conectar = function (url) {
  return new Promise(function (resolve) {
    let options = { useNewUrlParser: true }
    if (process.env.NODE_ENV === 'production') { options = { autoIndex: false } }
    mongoose.connect(url, options)
    db = mongoose.connection
    db.on('error', function (err) {
      console.log(`error ${err}`)
    })

    db.on('connected', function () {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production') { console.log(`app de PPL conectada con ${url}`) }
    })

    db.on('disconnected', function () {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production') { console.log('base de datos desconectada') }
    })
    resolve(db)
  })
}

let getDatabaseConnection = function () {
  if (!db) {
    console.error('Llamar los modelos de mongoose despues de inicializar la base de datos')
    process.exit(1)
  }
  return db
}

const Materias = require('../../modulos/materias/materias.model.js')

let modelos = function () {
  return {
    Materias
  }
}

let Desconectar = function () {
  mongoose.connection.close()
}

let Limpiar = function () {
  return new Promise(function (resolve) {
    resolve(mongoose.connection.dropDatabase())
  })
}

module.exports = {
  Conectar,
  Desconectar,
  Limpiar,
  getDatabaseConnection,
  modelos
}
