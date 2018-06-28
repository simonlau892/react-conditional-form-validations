import {fieldValidators, formValidators} from '../../../lib'

const rules = [
  { type: 'field',
    name: 'email',
    rule: [fieldValidators.required, fieldValidators.isEmail]
  },
  { type: 'field',
    name: 'address1',
    rule: [fieldValidators.isInRange(1, 50)]
  },
  { type: 'field',
    name: 'address2',
    rule: [fieldValidators.isInRange(1, 50)]
  },
  { type: 'field',
    name: 'postcode',
    rule: [fieldValidators.isNumber, fieldValidators.isInRange(1, 8)]
  },
  { type: 'form',
    rule: formValidators.notEmpty,
    fields: ['address1', 'city', 'country', 'postcode'],
    runConditions: [
      {attr: {id: 'addressCheckbox', checked: true, type: 'checkbox'}},
      {attr: {name: 'country', value: ['AU', 'NZ', 'US', 'CA']}, runPolarity: {value: -1}}
    ],
  }
]

export default rules
