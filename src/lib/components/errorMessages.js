
export const required = (fieldName, messages) => {
  return messages[fieldName].required || messages[fieldName].default
}

export const isInRange = (fieldName, messages) => {
  return messages[fieldName].isInRange || messages[fieldName].default
}

export const isEmail = (fieldName, messages) => {
  return messages[fieldName].isEmail || messages[fieldName].default
}

export const isNumber = (fieldName, messages) => {
  return messages[fieldName].isNumber || messages[fieldName].default
}

export const isNumberNoSymbol = (fieldName, messages) => {
  return messages[fieldName].isNumberNoSymbol || messages[fieldName].default
}

export const sameValue = (fieldName, messages) => {
  return messages[fieldName].sameValue || messages[fieldName].default
}

export const isDate = (fieldName, messages) => {
  return messages[fieldName].isDate || messages[fieldName].default
}

export const isDateMonthYear = (fieldName, messages) => {
  return messages[fieldName].isDateMonthYear || messages[fieldName].default
}

export const sameValidity = (fieldName, messages) => {
  return messages[fieldName].sameValidity || messages[fieldName].default
}

export const notEmpty = (fieldName, messages) => {
  return messages[fieldName].notEmpty || messages[fieldName].default
}

export const checkAUSPostcode = (fieldName, messages) => {
  return messages[fieldName].checkAUSPostcode || messages[fieldName].default
}

export const minNotEmpty = (fieldName, messages) => {
  return messages[fieldName].minNotEmpty || messages[fieldName].default
}

export const isAddress = (fieldName, messages) => {
  return messages[fieldName].isAddress || messages[fieldName].default
}
