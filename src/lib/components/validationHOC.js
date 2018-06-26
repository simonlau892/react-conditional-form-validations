// theirs
import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

    // retrieve all the attributes of all input element on form
    retrieveFormData = () => {
      let formData = []
      const formInputs = document.querySelectorAll('input')
      Array.prototype.forEach.call(formInputs, (field) => {
        const {name, value, id, checked, type} = field
        formData.push({ name, value, id, checked, type })
      })
      return formData
    }

    // validate a field rule
    validateFieldRule (name, value) {
      const fieldValidations = this.state.dynamicVal || validation
      const rule = fieldValidations.find((item) => {
        return item.name === String(name) && item.type === 'field'
      })

      if (rule) {
        let rulesArray = rule['rule']
        let errorObj = {}
        for (let rule of rulesArray) {
          let errorMessageFunc = rule(value)
          if (errorMessageFunc) {
            errorObj[`${name}Error`] = errorMessageFunc(name, messages)
            break
          }
        }

        if (rule['formMessage'] !== 'false' || rule['formMessage'] === undefined) {
          this.setfieldErrors(errorObj)
          this.setformErrors(errorObj)
        } else {
          this.setfieldErrors(errorObj)
        }
      }
    }

    // validate a form rule
    validateFormRule (rule, formData) {
      let isConditionsMet
      if (rule['runConditions']) {
        isConditionsMet = this.validateRunConditions(rule['runConditions'], formData)
      } else {
        // If 'runCondtions' key is not present then run the validation rule
        isConditionsMet = true
      }

      if (isConditionsMet) {
        let result = rule['rule'](rule.fields, formData)
        if (result) {
          let errorObj
          if(rule['formMessage'] && rule['formMessage'] === 'false') {
            errorObj = result['fields'].reduce((acc, name) => {
              acc['field'][`${name}Error`] = result['validator'](name, messages)
              return acc
            }, {field: {}})
          }

          if(rule['formMessage'] && rule['formMessage'] !== 'false') {
            let formMessage = rule['formMessage']
            errorObj = result['fields'].reduce((acc, name) => {
              acc['field'][`${name}Error`] = result['validator'](name, messages)
              acc['form'][`${formMessage}`] = result['validator'](formMessage, messages)
              return acc
            }, {field: {}, form: {}})
          }

          if(rule['formMessage'] && rule['fieldMessage'] === 'false' && rule['formMessage'] !== 'false') {
            let formMessage = rule['formMessage']
              errorObj = {field: {}, form: {[formMessage]: result['validator'](formMessage, messages)}}
          }

          if(rule['formMessage'] === undefined) {
            errorObj = result['fields'].reduce((acc, name) => {
              acc['field'][`${name}Error`] = result['validator'](name, messages)
              acc['form'][`${name}Error`] = result['validator'](name, messages)
              return acc
            }, {field: {}, form: {}})
          }

          this.setfieldErrors(errorObj.field)
          this.setformErrors(errorObj.form)
        }
      }
    }

    // validate run conditions
    validateRunConditions = (runConditions, formData) => {
      let allConditionResults = runConditions.map((condition, index) => {
        let attributes = condition['attr']
        // Match the run condition to the input state in formData
        let firstKey = Object.keys(attributes)[0]
        const matchedData = formData.find((inputState) => String(inputState[firstKey]) === String(attributes[firstKey]))
        if (matchedData) {
          const oneConditionResult = Object.keys(attributes).map((item) => {
            // check if condition item has an array of values
            if (Object.prototype.toString.call(attributes[item]) === '[object Array]') {
              // check is runPolarity exists and whether it should be reversed
              if (condition['runPolarity'] && condition['runPolarity'][item] === -1) {
                return attributes[item].every((elem) => elem !== matchedData[item])
              } else {
                // run default check
                return attributes[item].some((elem) => elem === matchedData[item])
              }
            } else {
              if (condition['runPolarity'] && condition['runPolarity'][item] === -1) {
                return attributes[item] !== matchedData[item]
              } else {
                // run defualt check
                return attributes[item] === matchedData[item]
              }
            }
          })
          const isConditionMet = oneConditionResult.filter((item) => (item === false)).length <= 0
          return isConditionMet
        } else {
          return false
        }
      })
      const areAllConditionsMet = allConditionResults.filter((item) => (item === false)).length <= 0
      return areAllConditionsMet
    }

    // validate all rules
    validateRules () {
      // Retrieve all input data from form
      const formData = this.retrieveFormData()
      // Get validation rules
      const validationsRules = this.state.dynamicVal || validation || null
      // Run each rule
      if (validationsRules) {
        for (let rule of validationsRules) {
          if (rule['type'] === 'field') {
            let isFieldValid = formData.find((item) => item.name === String(rule.name))
            if (isFieldValid) {
              this.validateFieldRule(rule.name, isFieldValid.value)
            }
          }
          if (rule['type'] === 'form') {
            this.validateFormRule (rule, formData)
          }
        }
      }
    }

    change = (event, name, reset = false, fieldNames = null, ...other) => {
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
      this.validateFieldRule(name, value)
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
      this.validateRules()
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
