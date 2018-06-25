import * as ErrorMessages from './errorMessages'

// Helper Function =============================================================================================================================================

// check if a input is empty from the data object
const isEmpty = (name, formData) => {
  const data = formData.find((item) => String(item.name) === String(name))
  if (data) {
    return String(data.value).length > 0 ? 'true' : 'false'
  } else {
    return 'false'
  }
}

// VALIDATORS =============================================================================================================================================
// TODO - Refactor each validator to make it less complicated and easier to read

// Check if multiple form values have the same validity (i.e either all are empty or all are present).
const sameValidity = (fieldNames, formData) => {
  let fieldNameWithErrors = fieldNames.map((name) => {
    let checker = isEmpty(name, formData)
    if (checker === 'false') {
      return name
    }
    return null
  }).filter((item) => item != null)

  const result = !!fieldNames.map((name) =>
    isEmpty(name, formData)
  ).reduce((firstValue, nextValue) => {
    return (firstValue === nextValue) ? firstValue : NaN
  })

  if (result) {
    return null
  } else {
    return {
      fields: fieldNameWithErrors,
      validator: ErrorMessages.sameValidity
    }
  }
}

// Check if all values are the same.
const sameValue = (fieldNames, formData) => {
  const result = !!fieldNames.reduce((first, next) => {
    let firstValue = formData.find((item) => String(item.name) === String(first))
    let nextValue = formData.find((item) => String(item.name) === String(next))

    return (firstValue.value === nextValue.value) ? true : NaN
  })

  if (result) {
    return null
  } else {
    return {
      fields: fieldNames,
      validator: ErrorMessages.sameValue
    }
  }
}

// Check if all form values are not empty.
const notEmpty = (fieldNames, formData) => {
    let fieldWithErrors = fieldNames.map((name, indx) => {
      let checker = isEmpty(name, formData)
      if (checker === 'false') {
        return name
      }
      return null
    }).filter((item) => item != null)

    if (fieldWithErrors.length > 0) {
      return {
        fields: fieldWithErrors,
        validator: ErrorMessages.notEmpty
      }
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
    ACT: [[200, 299], [2600, 2618], [2634, 2639], [2901, 2920], [2626, 2626], [2629, 2629]],
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
// Error is presented in form message.
const minNotEmpty = (minValue) => {
  return (fieldNames, formData) => {
    let fieldWithErrors = fieldNames.map((name, indx) => {
      let checker = isEmpty(name, formData)
      if (checker === 'false') {
        return name
      }
      return null
    }).filter((item) => item != null)

    if (fieldWithErrors.length > minValue) {
      return {
        fields: fieldWithErrors,
        validator: ErrorMessages.minNotEmpty
      }
    } else {
      return null
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
