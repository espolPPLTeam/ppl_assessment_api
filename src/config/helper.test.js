expect = require('chai').expect
sinon = require('sinon')
request = require('supertest')

validar = require('./utils').validar

app = require('../app')
dump = require('./db/dump')
URL_DB = require('./config').URL_DB
db = require('./db')
respuestas = require('./responses')
modelos = require('./db').modelos()
consola = require('./logger')

crearStub = (tipo, metodo, nombreSchema, response) => {
  let modelStub = {}
  modelStub[nombreSchema] = {}
  if (tipo === 'resolve') {
    modelStub[nombreSchema][metodo] = () => { return Promise.resolve(response) }
    return modelStub
  }
  modelStub[nombreSchema][metodo] = () => { return Promise.reject(response) }
  return modelStub
}
// let mockDB  = () => {
//  const proto = {
//   capitulos: {
//     ObtenerTodos() {
//       Promise.resolve(true)
//     }
//   }
//  }
//  return Object.assign(Object.create(proto), {})
// }