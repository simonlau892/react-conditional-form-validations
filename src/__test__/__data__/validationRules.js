
import { fieldValidators, formValidators } from '../../lib'

export const rules = [
  { type: 'field',
    name: 'mainInput',
    rule: [fieldValidators.isNumber]
  },
  { type: 'form',
    rule: formValidators.notEmpty,
    fields: ['mainInput', 'secondInput']
  },
  { type: 'field',
    name: 'secondInput',
    rule: [fieldValidators.isNumber]
  },
  { type: 'form',
    rule: formValidators.notEmpty,
    fields: ['secondInput', 'mainInput']
  }
]
