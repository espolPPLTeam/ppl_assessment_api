module.exports.noSpecialChars = (v) => {
  return  !/[`~,<>;'"/[\]|{}()=+]/.test(v)
}

module.exports.notEmpty = (v) => {
  return /[a-zA-Z0-9]+/g.test(v)
}

module.exports.onlyNumbers = (v) => {
  return /^[0-9]*$/gm.test(v)
}

module.exports.cedulaValida = (v) => {
  let total = 0
  let longcheck = v.length - 1

  if (v !== "" && v.length === 10){
    for(i = 0; i < longcheck; i++){
      if (i%2 === 0) {
        let aux = v.charAt(i) * 2
        if (aux > 9) {
          aux -= 9
        }
        total += aux
      } else {
        total += parseInt(v.charAt(i)) // parseInt o concatenará en lugar de sumar
      }
    }

    total = total % 10 ? 10 - total % 10 : 0

    return v.charAt(v.length - 1) == total
  } else {
    return false
  }
}

module.exports.validEmail = (v) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(v.toLowerCase())
}

module.exports.codigoValido = (v) => {
  return /[A-Z0-9]+/g.test(v)
}