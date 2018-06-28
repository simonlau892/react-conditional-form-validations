



# React Conditional Form Validation

This library is design to be used in applications where conditional form validation is required. In particular, validations can be executed based on the form values entered by the user. It is a Higher Order Component (HOC) thats wraps a React form component.

**What can this library do**.
* Supports basic input *field validation* as well as complex *form validations* involving multiple input fields.
* Includes built-in input field and form validators that are commonly used for validating personal details. Additional validators can be added on request.  
* Returns validation errors as props. Errors can either be displayed per input field, as a message summary or a combination of both. The error text is set by the developer.
* Can optionally accept external error messages from the server.
* Can clear error(s) from one or more input fields as the user types.
* Accepts a number of callback functions that enable developers to execute additional actions at each validation stage.
* Supports *dynamic validation*. If the structure of the form is only known at run time, the library can accept validation rules dynamically.

## Content
1.  [How it works](#works)
2.  [How to install](#install)
3.  [Demo](#demo)
4.  [Validators](#validators)
5.  [Validation Rules](#validation-rules)
6.  [Error Messages](#messages)
7.  [Output Props](#OutputProps)
8.  [Input Props](#InputProps)
9.  [API](#API)
10. [Testing](#test)  
11. [Notes](#notes)

##  <a id="works"></a>How it works
This library support two types of validations, *field validation* and *form validation*.

Field validation involves validating a single input field. This type of validation is executed when the  onBlur event occurs. All field validations are also re-run when the submit button is clicked.

Form validation involves validating multiple input fields at a time. These validations can be programmed to run according to the current input values of the form. This type of validation is executed when the submit button is clicked.

The errors from both form and field validations can be cleared when the onChange event is activated.

Refer to the  [demos](#demo) to see it in action.


##  <a id="install"></a>How to install

`npm i react-conditional-validations`

##  <a id="demo"></a>Demo
To see a demo either:

- Clone the repo. Run `npm install`, and then `npm start`. The code is in `src/demo` and the demo can be viewed from `http://localhost:3000/`.
- Alternatively click the following link for a sandbox version:
https://codesandbox.io/embed/wk6wq3jox5

## <a id="validators"></a>Validators
The following is a list of available field and form validators. More validators can be added on request.

### Field Validators

1. **required -**  Check if the input has a defined value. It will return an error if the value is either null, undefined, or it is an empty string.
2. **isInRange(min, max) -** Check to see if the value is between the min and max parameters.
3. **isEmail -**  Check if the value has a pattern of a standard email address.
4. **isNumber -**  Check if the value is a number. Note this validator also accepts '+' and '-' symbols.
5. **isNumberNoSymbol -**  Check if the value is a number and it does not contain '+' or '-' symbols.
6. **isDate -**  Check if the input value in the dd/mm/yyyy format is a valid date and does not exceed today's date.
7. **isDateMonthYear -**  Check if the input value in the mm/yyyy format is a valid date and does not exceed the current month.
8. **isAddress -**  Check if the input value fits a typical address. Accepts letters, numbers and the following symbols `-'/.,#&`.

### Form Validators

1. **notEmpty -**  Check if the given input values are all not empty. If one or more values are empty then it returns an error.
2. **sameValue -** Check if all values are the same 'string' value.
3. **sameValidity -** Check if all values have the same validity (i.e either all are empty or all are present).
4. **minNotEmpty(minNumber) -** Check to see if at least a minimum number of values are not empty. The minNumber parameter sets the minimum value.
5. **checkAUSPostcode -** Check to see if the postcode value is valid according to the given state. Can only be used for Australian addresses. Note: This validator expects the `fields` property in the form rule to be in the following format [country, postcode, state]. See the [Validation Rules](#validation-rules) for more details.


## <a id="validation-rules"></a>Validation Rules
The library accepts validation rules as an array of objects. Each object consist of either a field rule or a form rule. The listing of the rules should 'follow' the structure of the form. So if the phone number field is the first input in the form, then the first rule in the array should be the phone number validation rule.

### Field rule
A field rule has the following structure:

**type [string]:** A string equal to `field`.  
**name [string]:** The name of the input field (name attribute) to be validated.  
**rule [array]** An array off field validator functions. Rules are processed from left to right. The library stop processing when a validator is not met.

Example:

~~~~
validations =
[
   { type: 'field',
    name: 'phoneNumber',
    rule: [isInRange(1, 11), isNumber]
  },
]
~~~~
---
### Form rule
A form rule has the following structure:

**type [string]:** A string equal to `form`.  
**rule [function]:**  The name of the form validator function.  
**fields [array]:** An array of input field names (name attribute)  that are part of the form validation.  
**runConditions [array]** *optional* **:** An array of objects, with each object representing a condition that needs to be met before the validation is executed. Each condition consists of an `attr` property. The `attr` property is an object that details the attributes values of one input element. Attribute tags that are currently supported are `name`, `value`, `id`, `checked` and `type`. More attributes can be added on request. An attribute value can either be a single value or an array of values.
In addition to the attributes property, there is an option to add a `runPolarity` object for each condition. `runPolarity` is an object that can reverse the polarity of the check for each attribute value. See [Demo](#demo).
If runConditions is omitted, then the validation rule will run every time.  
**formMessage[string]** *optional* **:** Is an identifier to set a custom form message. This identifier is used in the message object. If this is omitted then the form message is the list of errors messages for each input field that are affected by this validation rule. If formMessage is set to `false` then no form message will be displayed for this validation rule.  
**fieldMessage[string]** *optional* **:** If fieldMessage is set to `false` then no field message will be displayed for each input for this validation rule.

Example:  
~~~~
validations =
[
  { type: 'form',
    rule: formValidators.notEmpty,
    fields: ['address1', 'city', 'country', 'postcode'],
    runConditions: [
      {attr: {id: 'addressCheckbox', checked: true, type: 'checkbox'}},
      {attr: {name: 'country', value: ['AU', 'NZ', 'US', 'CA']}, runPolarity: {value: -1}}
    ],
  },
 ]
~~~~

## <a id="messages"></a> Error Messages
The library accepts a message object. Each input name has a set of error messages corresponding to the rule type. If the rule type is not found then it will display the default message. The following is an example of a message object. See [Demo](#demo) to see how the message object relates to the rules.

~~~~
messages = {
  'country': {
    default: 'Enter a valid field',
    notEmpty: 'Select a country/territory'
  },
  'address': {
    default: 'Enter a valid field',
    notEmpty: 'Enter a street address',
    isInRange: 'Your address must be less than 50 characters'
  },
  'postcode': {
    default: 'Enter a valid field',
    notEmpty: 'Enter a post/zip code',
    checkAUSPostcode: 'The post/zip code doesn’t look correct, try again'
  },
   'postcodeMessage': {
    default: 'There is an error in the form',
    notEmpty: 'You have chosen a country that requires you to fill in your postcode.'
  }
}
~~~~

## <a id="OutputProps"></a> Output Props

### fieldErrors [object]
An object containing the error message for each field. The key of the object is the name of the field with the word 'Error' appended to the end. The property value is the error message.

### formErrors [object]
An object containing the error message for each form validation as well as some from field validations. The key is the name of the form validation that are set in the rules. If no name is set then the key is the name of the affected input fields with the 'Error' appended to it. The property value is the error message.

### formMessage [array]
An array that contains the error messages from all validation rules . It is similar to the formError prop but without the property keys. This prop is useful if you want to loop through the messages and present them as a list. The order of the message follows the order of the form. If external server errors are passed in, these errors are appended to this array. Refer to [input props](#InputProps) to see how to pass in external server errors.

### isFieldError [boolean]
Whether there are any field errors.

### isFormError [boolean]
Whether there are any form errors.

### isSubmitClicked [boolean]
Whether the submit button is clicked. When use in combination with isFormError, you can activate the scrolling to the error message container on long forms.

### isInputDirty [boolean]
Whether any input has been touched. This prop is useful if you only what to enable the submit button when the one of the input has been touched.

## <a id="InputProps"></a>Input Props

### onChange(event, name, isFieldError, other) [function]
This function is called, once the library has completed its validation activities for the input's onChange event. There following parameter are pass to this function.  

**event [object]:** An input's onchange Event object.  
**name [string]:** The name of the input field.  
**isfieldError [boolean]:** Whether the event resulted in a validation error or not.  
**other [array]** *optional* **:**  Any additional parameters that was passed to the change function is available here.

---

### onBlur(event, name, isfieldError, other) [function]
This function is called, once the library has completed its validation activities for the input's onBlur event. There following parameter are pass to this function.  

**event [object]:** An input's onblur Event object.  
**name [string]:** The name of the input field.  
**isfieldError [boolean]:** Whether the event resulted in a validation error or not.  
**other [Array]** *optional* **:**  Any additional parameters that was passed to the blur function is available here.

---

### onSubmit(other) [function]
This function is only called when the submit button's onclick is fired and there are ***no*** validation errors. If you wish to perform additional actions even when there are errors use the onSubmitError function.

**other [Array]** *optional* **:**  Any additional parameters that was passed to the submit function is available here.

---

### onSubmitError(other) [function]
This function is called when the button's onclick event is fired and there are validation errors.

**other [Array]** *optional* **:**  Any additional parameters that was passed to the onClick function is available here.

---

### serverError [String or Array]
Pass any error message from the server to the formMessage array.

## <a id="API"></a>API

### change(event, fieldname, clearVal, clearMultiple, other).
Is called on an input's onChange event.  

**event [object]:** An input's onchange Event object.  
**fieldName [string]:** The input's name.  
**clearVal [boolean]:** Determine if an exisiting validation error for this input field should be cleared when the onChange event is fired.  
**clearMultiple [Array]:** Clear validation error(s) for other input fields when the onChange event is fired. Should be an array of strings, with the strings being the name of the input fields the error needs to be cleared from. Set it to `null` if not required.  
**other [object]** *optional* **:**  Pass additional parameters to the onChange callback function.

---

### blur(event, fieldname, other)
Is called on an input's onBlur event.

**event [object]:** An input's onBlur Event object.   
**fieldName [string]:** The input's name.  
**other [object]** *optional* **:**  Pass additional parameters to the onBlur callback function.

---

### submit(other)
Is called on the submit button's onClick event.

**other [object]** *optional* **:**  Pass additional parameters to the onSubmit and onSubmitError callback functions.

---

### addVal(rules)
Is used to set the validation rules at runtime. See [validation rules](#validation-rules) to see how the rules are created.

**rules [Array]:** Validation rules.

## <a id="test"></a>Unit Testing
`npm run test`
## <a id="notes"></a>Notes
1. This library is a work in progress, so if you find any bugs or have suggestion for improvements please let us know.
2. To come: Documentation for setting up dynamic validations.
