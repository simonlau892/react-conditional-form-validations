import {fieldValidators, formValidators} from '../../../lib'

const rules = [
  { type: 'field',
    name: 'email',
    rule: [fieldValidators.required, fieldValidators.isEmail]
  },
  { type: 'field',
    name: 'address1',
    rule: [fieldValidators.isInRange(1, 25)]
  },
  { type: 'field',
    name: 'state',
    rule: [fieldValidators.isInRange(1, 25)]
  },
  { type: 'field',
    name: 'postcode',
    rule: [fieldValidators.isNumber, fieldValidators.isInRange(1, 6)]
  },
  { type: 'form',
    rule: formValidators.notEmpty,
    fields: ['address1', 'city', 'country', 'postcode'],
    runConditions: [
      {attr: {id: 'addressCheckbox', checked: true, type: 'checkbox'}},
      {attr: {name: 'country', value: ['AU', 'NZ', 'US', 'CA']}, runPolarity: {value: -1}}
    ],
  },
  { type: 'form',
    rule: formValidators.notEmpty,
    fields: ['address1', 'city', 'country', 'state', 'postcode'],
    runConditions: [
      {attr: {id: 'addressCheckbox', checked: true, type: 'checkbox'}},
      {attr: {name: 'country', value: ['AU', 'NZ', 'US', 'CA']}}
    ],
  }
]

export default rules
