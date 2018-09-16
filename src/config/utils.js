const Ajv = require('ajv')
let localize = require('ajv-i18n')
const ajv = new Ajv({ allErrors: true, jsonPointers: true })
function validar (schema, datos) {
  const validate = ajv.compile(schema)
  validate(datos)
  localize.es(validate.errors)
  let errores = validate.errors
  let erroresReturn = null
  if (errores) {
    erroresReturn = {}
    for (let error of errores) {
      let nombre = error['dataPath'].split('/')[1]
      erroresReturn[nombre] = error['message']
    }
    return [true, erroresReturn]
  }
  return [false, {}]
}
module.exports = {
  validar,
  validarRequest (schema, req, metodo) {
    if (!schema || !req || !metodo) {
      console.error('No envio bien los datos para validar')
      process.exit(1)
    }
    let [errorBody, mensajeBody] = [false, '']
    let [errorQuery, mensajeQuery] = [false, '']
    let [errorParams, mensajeParams] = [false, '']
    let bodySchema = schema[metodo].body
    let querySchema = schema[metodo].query
    let paramSchema = schema[metodo].params
    if (bodySchema && Object.keys(bodySchema).length) {
      [errorBody, mensajeBody] = validar(bodySchema, req.body)
    }
    if (querySchema && Object.keys(querySchema).length) {
      [errorQuery, mensajeQuery] = validar(querySchema, req.query)
    }
    if (paramSchema && Object.keys(paramSchema).length) {
      [errorParams, mensajeParams] = validar(paramSchema, req.params)
    }

    let errores = []
    for (let error in mensajeBody) {
      if (!error) {
        errores.push(`El body ${mensajeBody[error]} `)
      } else {
        errores.push(`El campo del body ${error}: ${mensajeBody[error]}`)
      }
    }

    for (let error in mensajeQuery) {
      if (!error) {
        errores.push(`El query ${mensajeQuery[error]} `)
      } else {
        errores.push(`El campo del query ${error}: ${mensajeQuery[error]}`)
      }
    }

    for (let error in mensajeParams) {
      if (!error) {
        errores.push(`Los params ${mensajeQuery[error]}`)
      } else {
        errores.push(`El campo del params ${error}: ${mensajeQuery[error]}`)
      }
    }
    let existeError = errorBody || errorQuery || errorParams
    return [existeError, errores]
  },
  jsonToInt (json, propiedades) {
    let datos = { }
    for (let propiedad of propiedades) {
      let numero = parseInt(json[propiedad])
      if (!isNaN(numero)) {
        datos[propiedad] = numero
      } else {
        datos[propiedad] = ''
      }
    }
    return datos
  }
  // verify (req, res, next) {
  //   let token = null
  //   let bits = req.headers.authorization.split(' ')
  //   if (bits.length === 2) {
  //     const scheme = bits[0]
  //     const credentials = bits[1]
  //     if (/^Bearer$/i.test(scheme)) {
  //       token = credentials
  //       jwt.verify(token, 'secret', function (err, decoded) {
  //         if (err) {
  //           let resp = responses.NO_AUTORIZADO
  //           res.status(resp.codigoEstado)
  //           res.json(resp)
  //         } else {
  //           next()
  //         }
  //       })
  //     }
  //   } else {
  //     let resp = responses.NO_ENVIO_JWT
  //     res.status(resp.codigoEstado)
  //     res.json(resp)
  //   }
  // }
}
