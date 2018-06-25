export default {
  address1: {
    default: 'Enter a valid field',
    notEmpty: 'Address line 1 is a required field',
    isInRange: `The address should be between 1 to 50`,
  },
  address2: {
    default: 'Enter a valid field',
    isInRange: `The address should be between 1 to 50`,
  },
  city: {
    default: 'Enter a valid field',
    notEmpty: 'The city is a required field',
  },
  country: {
    default: 'Enter a valid field',
    notEmpty: 'The country is a required field',
  },
  postcode: {
    default: 'Enter a valid field',
    required: 'The postcode is a required field',
    isNumber: `The postcode should be a number`,
    isInRange: `The postcode should be between 1 to 8`,
    notEmpty: 'The postcode is a required field',
  },
  email: {
    default: 'Enter a valid field',
    required: 'The email is a required field',
    isEmail: `The email does not look correct`
  },
  'test': {
    default: 'Enter a valid field',
    notEmpty: 'sadsadsadsdas',
  }
}
