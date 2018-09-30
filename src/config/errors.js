function VALIDATION_ERROR(err) {
  return {
    type: 'Validation error',
    message: parseErrorMsg(err.errors)
  }
}

function REFERENCE_ERROR(message) {
  return {
    type: 'Reference error',
    message: message
  }
}

function UPDATE_ERROR (message) {
  return {
    type: 'Update error',
    message: message  
  }  
}

function parseErrorMsg(errors) {
  let message = ''
  for (attr in errors) {
    message = message.concat(errors[attr]['message']).concat('. ')
  }
  return message.slice(0, -1)
}

module.exports.ERROR_HANDLER = (err) => {
  if (err.name === 'ValidationError') {
    return VALIDATION_ERROR(err)
  } else if ( err.name === 'ReferenceError' ) {
    return REFERENCE_ERROR(err.message)
  } else if ( err.name === 'UpdateError' ) {
    return UPDATE_ERROR(err.message)
  }
}
