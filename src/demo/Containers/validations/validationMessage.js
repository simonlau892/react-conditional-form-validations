export default {
  email: {
    default: 'Enter a valid field',
    required: 'The email is a required field',
    isEmail: `The email does not look correct`
  },
  address1: {
    default: 'Enter a valid field',
    notEmpty: 'Address line 1 is a required field',
    isInRange: `The address should be between 1 to 50`,
    minNotEmpty: `Minimum number of inputs to be filled`
  },
  address2: {
    default: 'Enter a valid field',
    isInRange: `The address should be between 1 to 50`,
    minNotEmpty: `Minimum number of inputs to be filled`
  },
  city: {
    default: 'Enter a valid field',
    notEmpty: 'The city is a required field',
    minNotEmpty: `Minimum number of inputs to be filled`
  },
  country: {
    default: 'Enter a valid field',
    notEmpty: 'The country is a required field',
    minNotEmpty: `Minimum number of inputs to be filled`
  },
  postcode: {
    default: 'Enter a valid field',
    required: 'The postcode is a required field',
    isNumber: `The postcode should be a number`,
    isInRange: `The postcode should be between 1 to 8`,
    notEmpty: 'The postcode is a required field',
    minNotEmpty: `Minimum number of inputs to be filled`
  }
}
