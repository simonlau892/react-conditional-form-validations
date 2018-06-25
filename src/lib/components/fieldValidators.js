import * as ErrorMessages from './errorMessages'

function required (value) {
  if (!valueUndefined(value)) {
    return null
  }
  return ErrorMessages.required
}

function isInRange (min, max) {
  return (value) => {
    if (valueUndefined(value)) {
      return null
    }

    const length = value.toString().length

    if (length >= min && length <= max) {
      return null
    }

    return ErrorMessages.isInRange
  }
}

function isEmail (value) {
  const isValid = /\S+@\S+\.\S+/.test(value)
  if (isValid) {
    return null
  }

  return ErrorMessages.isEmail
}

function isNumber (value) {
  if (valueUndefined(value) || !isNaN(Number(value))) {
    return null
  }
  return ErrorMessages.isNumber
}

function isNumberNoSymbol (value) {
  const isValid = /^[0-9]*$/.test(value)
  if (isValid) {
    return null
  }
  return ErrorMessages.isNumberNoSymbol
}

function valueUndefined (value) {
  return value === null || value === undefined || value === ''
}

function isDate (value) {
  // if value is empty exit validations
  if (!value) {
    return null
  }
  // remove all non-digits
  let newValue = value.replace(/\D/g, '')
  // // check if any date has correct length
  if (newValue.length !== 8) {
    return ErrorMessages.isDate
  } else {
    let day = newValue.substring(0, 2)
    let month = newValue.substring(2, 4)
    let year = newValue.substring(4, 8)

    if (month === '02') {
      // check if its a leap year
      let leapYear = false
      if ((!(year % 4) && year % 100) || !(year % 400)) {
        leapYear = true
      }
      if ((leapYear === false) && (day >= 29)) {
        return ErrorMessages.isDate
      }
      if ((leapYear === true) && (day > 29)) {
        return ErrorMessages.isDate
      }
    }
    if (isNaN(Date.parse(year + '-' + month + '-' + day))) {
      return ErrorMessages.isDate
    }
    if ((Date.parse(year + '-' + month + '-' + day)) > Date.now()) {
      return ErrorMessages.isDate
    }
    return null
  }
}

function isDateMonthYear (value) {
  // if value is empty exit validations
  if (!value) {
    return null
  }
  // remove all non-digits
  let newValue = value.replace(/\D/g, '')

  // // check if any date has correct length
  if (newValue.length !== 6) {
    return ErrorMessages.isDateMonthYear
  } else {
    let month = newValue.substring(0, 2)
    let year = newValue.substring(2, 6)

    if (month > 12 || month < 1) {
      return ErrorMessages.isDateMonthYear
    }
    if (year > (new Date()).getFullYear()) {
      return ErrorMessages.isDateMonthYear
    }
    return null
  }
}

export default {
  required,
  isInRange,
  isEmail,
  isNumber,
  isNumberNoSymbol,
  valueUndefined,
  isDate,
  isDateMonthYear
}
