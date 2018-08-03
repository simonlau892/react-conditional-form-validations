import * as ErrorMessages from './errorMessages'

// Helper Function =============================================================================================================================================

const isEmpty = (value) => {
  if (value && String(value).length > 0) {
    return 'true'
  } else {
    return 'false'
  }
}

const createObjMap = (nameArray, formData) => {
  return nameArray.reduce((acc, name, index) => {
    let data = formData.find((item) => String(item.name) === String(name))
    if (data && data.value) {
      if (isEmpty(data.value) === 'false') {
        acc['emptyFields'].push(name)
      } else {
        acc['fields'][name] = data.value
      }
    } else {
      acc['emptyFields'].push(name)
    }
    return acc
  }, {fields: {}, emptyFields: []})
}

const sameValueArray = (array) => {
  return !!array.reduce((a, b) => (a === b) ? a : NaN)
}

const sameValueObject = (object) => {
  let firstValue = object[Object.keys(object)[0]]
  return Object.keys(object).every((item) => object[item] === firstValue)
}

// VALIDATORS =============================================================================================================================================
// TODO - Refactor each validator to make it less complicated and easier to read

// Check if multiple form values have the same validity (i.e either all are empty or all are present).
const sameValidity = (fieldNames, formData, formMessage, messages) => {
  const map = createObjMap(fieldNames, formData)

  if (map['emptyFields'].length > 0 && map['emptyFields'].length !== fieldNames.length) {
    return {
      fields: map['emptyFields'],
      validator: ErrorMessages.sameValidity
    }
  } else {
    return null
  }
}

// Check if all values are the same.
const sameValue = (fieldNames, formData, formMessage, messages) => {
  const map = createObjMap(fieldNames, formData)
  if (map['emptyFields'].length === fieldNames.length) {
    if (sameValueArray(map['emptyFields'])) {
      return null
    } else {
      return {fields: fieldNames, validator: ErrorMessages.sameValue}
    }
  } else if (Object.keys(map['fields']).length === fieldNames.length) {
    if (sameValueObject(map['fields'])) {
      return null
    } else {
      return {fields: fieldNames, validator: ErrorMessages.sameValue}
    }
  } else {
    return {fields: fieldNames, validator: ErrorMessages.sameValue}
  }
}

// Check if all form values are not empty.
// Message is displayed on all affected input fields
const notEmpty = (fieldNames, formData, formMessage, messages) => {
  const map = createObjMap(fieldNames, formData)
  if (map['emptyFields'].length > 0) {
    return {fields: fieldNames, validator: ErrorMessages.notEmpty}
  } else {
    return null
  }
}


// Check for correct Postcode within Australia. The correct range is determined by the state.
// Validator assume the fieldNames array is as follows [country, postcode, state].
// Error is displayed in postcode input field
const checkAUSPostcode = (fieldNames, formData) => {
  const ranges = {
    NSW: [[1000, 2599], [2619, 2899], [2921, 2999], [4383, 4383]],
    ACT: [[200, 299], [2600, 2618], [2634, 2639], [2900, 2920], [2626, 2626], [2629, 2629]],
    QLD: [[4000, 4999], [9000, 9799]],
    NT: [[800, 999]],
    VIC: [[3000, 3644], [3645, 3999], [8000, 8999]],
    TAS: [[7000, 7499]],
    WA: [[6000, 6797], [6800, 6999]],
    SA: [[5000, 5999]]
  }

  let postcodeItem = formData.find((item) => String(item.name) === String(fieldNames[2]))
  let stateItem = formData.find((item) => String(item.name) === String(fieldNames[1]))
  let countryItem = formData.find((item) => String(item.name) === String(fieldNames[0]))

  let country = countryItem ? countryItem.value : null
  let state = stateItem ? stateItem.value : null
  let postcode = postcodeItem ? postcodeItem.value : null

  if (country === 'AU' && ranges[state] && state && postcode) {
    let range = ranges[state]
    const result = range.filter((item) => {
      let [min, max] = item
      return (postcode >= min && postcode < max)
    })
    if (result.length <= 0) {
      let fieldWithErrors = [fieldNames[2]]
      return {
        fields: fieldWithErrors,
        validator: ErrorMessages.checkAUSPostcode
      }
    } else {
      return null
    }
  } else {
    return null
  }
}

// At least three fields are present. Use to check at least three security questions are present.
const minNotEmpty = (minValue) => {
  return (fieldNames, formData, formMessage, messages) => {
    const map = createObjMap(fieldNames, formData)
    if (Object.keys(map['fields']).length >= minValue) {
      return null
    } else {
      return {
          fields: map['emptyFields'],
          validator: ErrorMessages.minNotEmpty
      }
    }
  }
}

export default {
  sameValidity,
  sameValue,
  notEmpty,
  checkAUSPostcode,
  minNotEmpty
}
