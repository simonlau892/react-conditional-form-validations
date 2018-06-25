// theirs
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formValidators from './formValidators'

export default function ValidateForm (messages, validation) {
  return (ValidationComponent) => class ValidateForm extends Component {
    static propTypes = {
      onChange: PropTypes.func.isRequired,
      onBlur: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
      onSubmitError: PropTypes.func,
      serverError: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    }

    constructor (props) {
      super(props)
      this.state = {
        fieldErrors: {},
        formErrors: {},
        formMessage: [],
        isFieldError: null,
        isFormError: null,
        isSubmitClicked: false,
        isInputDirty: false,
        dynamicVal: null
      }
      this._fieldErrors = {}
      this._formErrors = {}
    }

    setfieldErrors = (error) => {
      this._fieldErrors = Object.assign(this._fieldErrors, error)
    }

    setformErrors = (error) => {
      this._formErrors = Object.assign(this._formErrors, error)
    }

    resetErrors = () => {
      this._formErrors = {}
      this._fieldErrors = {}
    }

    componentWillReceiveProps (nextProps) {
      const {serverError} = nextProps
      if ((serverError !== null || serverError !== undefined) && (this.state.isSubmitClicked)) {
        if (Object.prototype.toString.call(serverError) === '[object Array]') {
          this.setState({formMessage: [...this.state.formMessage, ...serverError], isFormError: true})
        }
        if (typeof serverError === 'string') {
          this.setState({formMessage: [...this.state.formMessage, serverError], isFormError: true})
        }
      }
    }

    // Helper functions =================================

    // check if there are errors in object. Return Boolean.
    areThereErrors = (errors) => {
      return Object.keys(errors).filter((item) => errors[item] !== null).length > 0
    }

    // Add dynamic validations.
    addDynamicValidation = (val) => {
      this.setState({dynamicVal: val})
    }

    // ==================================================

    // Used to validate individual fields
    validateFields (name, value) {
      const fieldValidations = this.state.dynamicVal || validation
      const findField = fieldValidations.find((item) => {
        return item.name === String(name) && item.type === 'field'
      })

      if (findField) {
        let rulesArray = findField['rule']
        let errorObj = {}
        for (let rule of rulesArray) {
          let errorMessageFunc = rule(value)
          if (errorMessageFunc) {
            errorObj[`${name}Error`] = errorMessageFunc(name, messages)
            break
          }
        }

        if (findField['formMessage'] !== 'false' || findField['formMessage'] === undefined) {
          // const updateFormState = {...this._formErrors, ...errorObj}
          this.setfieldErrors(errorObj)
          this.setformErrors(errorObj)
        } else {
          this.setfieldErrors(errorObj)
        }
      }
    }

    // Used to validate a group of fields
    validateForm () {
      let formData = []
      // Retrieve all inputs from form
      const formInputs = document.querySelectorAll('input')

      Array.prototype.forEach.call(formInputs, (field) => {
        const {name, value, id, checked, type} = field
        formData.push({ name, value, id, checked, type })
      })

      // Run through validation
      if (this.state.dynamicVal || validation) {
        const formValidations = this.state.dynamicVal || validation

        for (let item of formValidations) {
          if (item['type'] === 'field') {
            let fieldValue = formData.find((element) => element.name === String(item.name))
            if (fieldValue) {
              const {value} = fieldValue
              this.validateFields(item.name, value)
            }
          } else {
            let isConditionsMet
            // check the run conditions to see whether to run the valiation rule or not
            if (item['runConditions'] && item['runMethod']) {
              isConditionsMet = formValidators.checkValidationCondtion(item['runConditions'], item['runMethod'], formData)
            } else {
              // If 'runCondtions' key is not present then run the validation rule
              isConditionsMet = true
            }

            if (isConditionsMet) {
              let formMessage = item['formMessage'] || null
              let ErrorMessageObj = item['rule'](item.fields, formData, formMessage, messages)
              if (ErrorMessageObj) {
                const {field, form} = ErrorMessageObj
                this.setfieldErrors(field)
                this.setformErrors(form)
              }
            }
          }
        }
      }
    }

    change = (event, name, reset, fieldNames = null, ...other) => {
      if (reset) {
        if (fieldNames) {
          const removeErrors = fieldNames.reduce((acc, item) => {
            acc[`${item}Error`] = null
            return acc
          }, {})
          this.setfieldErrors({...this.state.fieldErrors, ...removeErrors, ...{[`${name}Error`]: null}})
        } else {
          this.setfieldErrors({...this.state.fieldErrors, ...{[`${name}Error`]: null}})
        }
        this.setState({
          fieldErrors: this._fieldErrors,
          isFieldError: null,
          isInputDirty: true,
          isSubmitClicked: false})
      } else {
        // Input has been touched && reset submit btn clicked
        this.setState({isInputDirty: true, isSubmitClicked: false})
      }
      if (this.props.onChange) {
        this.props.onChange(event, name, this.state.isFieldError, other)
      }
    }

    blur = (event, name, ...other) => {
      const { value } = event.target || event
      this.validateFields(name, value)
      const isFieldError = this.areThereErrors(this._fieldErrors)
      this.setState({
        fieldErrors: this._fieldErrors,
        formErrors: this._formErrors,
        isFieldError
      })
      if (this.props.onBlur) this.props.onBlur(event, name, this.state.isFieldError, other)
    }

    submit = (...other) => {
      this.resetErrors()
      this.validateForm()
      const formArray = Object.keys(this._formErrors).reduce((acc, key) => {
        if (this._formErrors[key] !== null) {
          acc.push(this._formErrors[key])
        }
        return acc
      }, [])
      const isFieldError = this.areThereErrors(this._fieldErrors)
      const isFormError = formArray.length > 0

      // submit btn is clicked
      const isSubmitClicked = true

      this.setState({
        fieldErrors: this._fieldErrors,
        formErrors: this._formErrors,
        formMessage: formArray,
        isSubmitClicked,
        isFieldError,
        isFormError
      })

      const isError = !!(this.state.isFieldError || this.state.isFormError)
      if (isError && this.props.onSubmitError) {
        const payload = {...this.state}
        this.props.onSubmitError(payload, other)
      }
      if (!isError && this.props.onSubmit) {
        this.props.onSubmit(other)
      }
    }

    render () {
      const validationProps = {
        change: this.change,
        blur: this.blur,
        submit: this.submit,
        addVal: this.addDynamicValidation
      }
      return <ValidationComponent {...this.props} {...this.state} {...validationProps} />
    }
  }
}
