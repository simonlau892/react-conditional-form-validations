import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import View from './view'

class AddressForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      country: '',
      address1: '',
      address2: '',
      email:'',
      city: '',
      postcode: ''
    }
  }

  static propTypes = {
  }

  onFormSubmit= (other) => {
    // this.props.dispatch(actions.cd.postCDRequest())
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
    }

    return (
      <View {...newProps} />
    )
  }
}
export default AddressForm
