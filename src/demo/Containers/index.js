import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import View from './view'

class AddressForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      country: '',
      address1: '',
      state: '',
      email:'',
      city: '',
      postcode: ''
    }
  }

  onFormSubmit= (other) => {
    console.log('form has been submitted with no validation errors')
  }

  onSubmitError= (other) => {
    console.log('submit button has been clicked but there are validation errors')
  }

  onInputBlur = (event, name, isFieldError, other) => {
    const {value} = event.target
    this.setState({[name]: value})
  }

  onInputChange = (event, name, isFieldError, other) => {
    const {value} = event.target
    this.setState({[name]: value})
  }

  render (props) {
    const newProps = {
      ...props,
      ...this.state,
      onBlur: this.onInputBlur,
      onChange: this.onInputChange,
      onSubmit: this.onFormSubmit,
      onSubmitError: this.onSubmitError
    }

    return (
      <View {...newProps} />
    )
  }
}
export default AddressForm
