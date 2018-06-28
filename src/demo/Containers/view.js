import React, { Component } from 'react';
import './styles/Form.css';
import validationHOC from '../../lib'
import validationMessage from './validations/validationMessage'
import validationRules from './validations/validationRules'


class Form extends Component {
  render () {
    // From parent
    const {address1, state, city, country, email, postcode, } = this.props
    // From validation HOC
    const { blur, change, fieldErrors, formMessage, isFormError, isSubmitClicked, isInputDirty, submit} = this.props
    return (
      <div className='container'>
        This form has the following validations rules:
        <p>
        <b>Field validations</b>
        <ul>
          <li>Email is mandatory and must be in an email format</li>
          <li>Address must be between 1 to 25 characters</li>
          <li>State must be between 1 to 25 characters</li>
          <li>Postcode must be a number and is between 1 to 5 digits</li>
        </ul>
        </p>
        <p>
        <b>Form Validations</b>
        <ul>
          <li>If the checkbox is ticked and the country entered is <b>not</b> Australia (AU), United States (US), Canada (CA) or
            New Zealand (NZ), then the country, address, city and postcode is mandatory.
          </li>
          <li>If the checkbox is ticked and the country entered is either Australia (AU), United States (US), Canada (CA) or
            New Zealand (NZ), then the country, address, city, <b>state</b> and postcode is mandatory.
          </li>
        </ul>
        </p>
        <div className='form'>
          <div className='formRow'>
            {!isFormError && isSubmitClicked ?
              <span>Form successfully submitted</span>
              : null
            }
            {isFormError ?
            <div className='mainMessage'>
              <ul> {formMessage.map((item, index) => <li key={index}>{item}</li> )}</ul>
            </div>
            : null }
          </div>
          <div className='formRow'>
          <label>Email (mandatory)</label>
          <input
            name={'email'}
            className={'input'}
            value={email}
            onBlur={(e) => blur(e, 'email')}
            onChange={(e) => change(e, 'email', true, null)}
          />
          {fieldErrors.emailError ? <span className={'errorLabel'}>{fieldErrors.emailError}</span> : null}
          </div>
          <div className='formRow'>
            <label className={'checkboxLabel'}>Make address mandatory</label>
            <input id={'addressCheckbox'} type={'checkbox'} className={'checkbox'}/>
          </div>
          <div className='formRow'>
            <label>Country</label>
          <input
            name={'country'}
            className={'input'}
            value={country}
            placeholder={'Enter `AU`, `US`, `CA` or `NZ` here to see the difference'}
            onBlur={(e) => blur(e, 'country')}
            onChange={(e) => change(e, 'country', true, ['address1', 'state', 'city', 'postcode'])}
          />
          {fieldErrors.countryError ? <span className={'errorLabel'}>{fieldErrors.countryError}</span> : null}
        </div>
        <div className='formRow'>
          <label>Address Line 1</label>
          <input
            name={'address1'}
            className={'input'}
            value={address1}
            onBlur={(e) => blur(e, 'address1')}
            onChange={(e) => change(e, 'address1', true, null)}
          />
          {fieldErrors.address1Error ? <span className={'errorLabel'}>{fieldErrors.address1Error}</span> : null}
        </div>
        <div className='formRow'>
          <label>State</label>
          <input
            name={'state'}
            className={'input'}
            value={state}
            onBlur={(e) => blur(e, 'state')}
            onChange={(e) => change(e, 'state', true, null)}
          />
          {fieldErrors.stateError ? <span className={'errorLabel'}>{fieldErrors.stateError}</span> : null}
        </div>
        <div className='formRow'>
          <label>City</label>
          <input
            name={'city'}
            className={'input'}
            value={city}
            onBlur={(e) => blur(e, 'city')}
            onChange={(e) => change(e, 'city', true, ['address1', 'state', 'country', 'postcode'])}
          />
          {fieldErrors.cityError ? <span className={'errorLabel'}>{fieldErrors.cityError}</span> : null}
        </div>
        <div className='formRow'>
          <label>Postcode</label>
          <input
            name={'postcode'}
            className={'input'}
            value={postcode}
            onBlur={(e) => blur(e, 'postcode')}
            onChange={(e) => change(e, 'postcode', true, ['address1', 'state', 'city', 'country'])}
            />
            {fieldErrors.postcodeError ? <span className={'errorLabel'}>{fieldErrors.postcodeError}</span> : null}
        </div>
        <button className={isInputDirty ? null : `disable`}
          onClick={isInputDirty ? (e) => submit() : (e) => e.preventDefault()}>
          Submit
        </button>
        </div>
    </div>
    )
  }
}



export default validationHOC(validationMessage, validationRules)(Form);
