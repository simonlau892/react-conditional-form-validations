export default {
  email: {
    default: 'Enter a valid field',
    required: 'The email is a required field',
    isEmail: `The email does not look correct`
  },
  address1: {
    default: 'Enter a valid field',
    notEmpty: 'Address line is a required field',
    isInRange: `The address should be between 1 to 25`
  },
  state: {
    default: 'Enter a valid field',
    isInRange: `The address should be between 1 to 25`,
    notEmpty: 'The state is a required field',
  },
  city: {
    default: 'Enter a valid field',
    notEmpty: 'The city is a required field',
  },
  country: {
    default: 'Enter a valid field',
    notEmpty: 'The country is a required field'
  },
  postcode: {
    default: 'Enter a valid field',
    required: 'The postcode is a required field',
    isNumber: `The postcode should be a number`,
    isInRange: `The postcode should be between 1 to 6`,
    notEmpty: 'The postcode is a required field'
  }
}
