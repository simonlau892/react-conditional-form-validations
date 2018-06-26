
# React Form Validation HOC

This library provides validation functionalities for React forms. It is a Higher Order Component (HOC) thats wraps a form component.

**What can this library do**.
* Supports basic input field validation as well as complex form validations involving multiple input fields. Form validations can be customised to run only in certain scenarios.
* Has built in input field and form validators that are commonly used for validating personal details. More validators can be added on request.  
* Returns validation errors as props. Errors can either be displayed per input field or in conjunction with a main message. The error texts are set by the developer.
* Various state information are available, including whether any inputs have being touched or when the submit button has been clicked.
* Can optionally accept external form error messages from the server.
* Can clear error(s) from one or more input fields as the user types.
* Accepts a number of callback functions that enable developers to execute additional actions at each validation stage.
* Supports dynamic validation. If the structure of the form is only known at run time, the library can accept validation rules dynamically.

## Content
1.  [How to install](#install)
2.  [How to use](#use)
3.  [Basic Setup](#setup)
4.  [Validators](#validators)
5. [Validation Rules](#validation-rules)
6. [Error Messages](#messages)
7. [Output Props](#OutputProps)
8. [Input Props](#InputProps)
9. [API](#API)  
10. [Notes](#notes)

##  <a id="install"></a>How to install

#### to be determined....

##  <a id="use"></a>How to use
1. Pass  the input's onChange, the input's onBlur and the button's onClick callbacks to the form component. See [input props](#InputProps).
2. Create validation rules file. See [validation rules](#validation-rules).
3. Create error message file. See [error message](#messages).
4. Import library, validation rules file and message file into form component.
5. For each input element that needs validation, call the library's corresponding API functions for each  DOM event. See [API](#API).  For example:
`<input name={'email'} onBlur={(e) => props.blur(e, e.target.name)} onChange={(e) => props.change(e, e.target.name, true, null)} />`
6. Connect the submit button onClick event to the library's submit function. See [API](#API).  For example:
`<Button onClick={(e) => props.submit(e)} />`
7. Return the form component wrapped inside the library. The rules and error messages are passed as parameters. For example:
`export default validationWrapper(errorMessages, rules)(Form)`


##  <a id="setup"></a>Basic Setup

### Form architecture (Recommended)
The library is agnostic to the form's architecture. Nevertheless the following is a suggested pattern when using this library.

```
project  
│
└───form1
│     │ - parent.js
│     | - view.js
│     |── validation
│       │ - rules.js
│       │ - messages.js             
│   
└───form2
     │ - parent.js
     | - view.js
     |── validation
       │ - rules.js
       │ - messages.js

```

 **Parent.js**:
 This file renders view.js. This file should contain the input's onChange and onBlur callbacks as well as the button's onClick callback. The library will run these callbacks once it has completed its validation work for each of these events. These callbacks are passes as props to view.js.  

  **view.js**:
 This file renders the form. It imports the validation library, the rules file and the messages file. It return the form as a wrapped HOC with the rules and messages passed as parameters.

  **rules.js**:
 This file contains the form's validation rules. Refer to [validation rules](#validation-rules) to see how the rules are created.

  **messages.js**:
 This file contains the validation messages. Refer to [Error Messages](#messages) to see how the message are created.

## <a id="validators"></a>Validators
The following is a list of available field and form validators. More can be added on request.

### Field Validators

1. **required -**  Check if the value has a truthy value or not. It will return an error if value is either null, undefined, NaN, empty string, 0 or false.
2. **isInRange(min, max) -** Check to see if the value is between the min and max parameter.
3. **isEmail -**  Check if the value has a pattern of a standard email address.
4. **isNumber -**  Check if the value is a number. Note this also accepts '+' and '-'.
5. **isNumberNoSymbol -**  Check if the value is a number and does not accept '+' or '-'.
6. **isDate -**  Check if a date string in the dd/mm/yyyy format is a valid date and does not exceed today's date.
7. **isDateMonthYear -**  Check if a date string in the mm/yyyy format is a valid date and does not exceed the current month.

### Form Validators

1. **notEmpty -**  Check if all given values are not empty. If one more values are empty then it return an error.
2. **sameValue -** Check if all values are the same 'Sting' value.
3. **sameValidity -** Check if all values have the same validity (i.e either all are empty or all are present).
4. **minNotEmpty(minNumber) -** Check to see if at least a minimum number of values are not empty. The minNumber parameter sets the minimum value.
5. **checkAUSPostcode -** Check to see if the postcode value is valid according to the given state. Can only be used for Australian's addresses. Note: This validator expects the `fields` property in the validation rules to be in the following format [country, postcode, state]. See the next section for more details.


## <a id="validation-rules"></a>Validation Rules
The library accepts validation rules as an array of objects. Each object consist of either a field rule or a form rule. The rules should 'follow' the structure of the form. So if the phone number field is the first input in the form, then the first object of the array should be the phone number validation rule.

### Field rule
A field rule has the following structure:

**type [string]:** A string equal to `field`.  
**name [string]:** The name of the input field to be validated.  
**rule [Array]** An array off field validator functions. Rules are processed from left to right. The library stop processing when a validator is not meet.

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
**fields [Array]:** An array of input field names that are part of the form validation.  
**runConditions [Array]** *optional* **:** An array of objects, with each object detailing a state of an input element. The form validation is only executed if all states are met. The state of an input is defined by its attribute values. Attributes supported are name, value, id, checked and type. More attributes can be added on request. An attribute value can either be a single value or an array of values. If runConditions is omitted, then the validation will run every time.  
**runMethod [Array]** *optional* **:** If an attribute value in the runCondition is an array, then there is an option to reverse the polarity of the check. The length of runMethod should match the length of runConditions. `1` is set if the polarity is to remain, `-1` if the polarity should be reverse. `0` is given if the state has no array values. If you wish to change the polarity of a single value, then create a one element array.  
**formMessage[string]** *optional* **:** Is an identifier to set a custom form message. This identifier is used in the message object. If this is omitted the form message is the list of errors messages from fields that are affected by the validation. If formMessage is set to `false` then no form message will be displayed.

Example:  
The following is the form validations for an address form. The address form contains five fields with the following names 'country', 'address', 'suburb', 'state', 'postcode'. The address fields needs to be validated if the user 'checks' the *post to address* checkbox. If it is checked then all values except the postcode needs to be filled. This validation check is represented in the first object of the array. If the country is either Australia, New Zealand, US or Canada then the postcode needs to be filled in too. This validation check is represented in the second object of the array.

The validation rule `notEmpty` is used in both cases. The run condition in both cases first check if the checkbox with id equal to 'postToAddress' has been checked. If this is pass then in the first case the library checks if the input with name 'country' is **not** equal to either Australia, New Zealand, US or Canada. In the second case it check if it does equal to these countries. The polarity is reverse in the first case because the run method is set to `-1`.

The second case, has a custom form message set, so a unique message  is displayed. This message is set in the message object (see next section). The form message of the first case will display the error message of each of the the affected input fields.

~~~~
validations =
[
  { type: 'form',
    'rule': notEmpty,
    'fields': ['country', 'address', 'suburb', 'state'],
    'runConditions': [
    {id: 'postToAddress', checked: true, type: 'checkbox'},
    {name: 'country', value: ['AU', 'NZ', 'US', 'CA']}
    ],
    runMethod: [0, -1]
  },
  { type: 'form',
    'rule': notEmpty,
    'fields': ['country', 'address', 'suburb', 'state', 'postcode'],
    'runConditions': [
    {id: 'postToAddress', checked: true, type: 'checkbox'},
    {name: 'country', value: ['AU', 'NZ', 'US', 'CA']}
    ],
    runMethod: [0, 1]
    formMessage: 'postcodeMessage'
  }
 ]
~~~~

## <a id="messages"></a> Error Messages
The library accepts a message object. Each input name has a set of error messages corresponding to the rule type. If the rule type is not found then it will display the default message.  The following is an example of a message object for the validation rules given in the previous section. 'postcodeMessage' is a custom message as explained in the previous section.

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
  'suburb': {
    default: 'Enter a valid field',
    notEmpty: 'Enter a suburb/town/city',
    isInRange: 'Your suburb/town/city must be less than 50 characters'
  },
  'state': {
    default: 'Enter a valid field',
    notEmpty: 'Enter a state'
  },
  'postcode': {
    default: 'Enter a valid field',
    notEmpty: 'Enter a post/zip code',
    checkAUSPostcode: `The post/zip code doesn’t look correct, try again`
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
An object containing the error message for each form validation. The key is the name of the form validation that are set in the rules. If no name is set then the key is the name of the affected input fields with the 'Error' appended to it. The property value is the error message.

### formMessage [Array]
An array that contains the form error messages. It is similar to the formError prop but without the property keys. This prop is useful if you want to loop through the messages and present them as a list. The order of the message follows the order of the form. If external server errors are passed in, these errors are appended to this array. Refer to [input props](#InputProps) to see how to pass in server errors.

### isFieldError [boolean]
Whether there are any field errors.

### isFormError [boolean]
Whether there are any form errors.

### isSubmitClicked [boolean]
Whether the submit button is clicked. When use in combination with the isFormError prop, you can activate the scrolling to the error message container on long forms.

### isInputDirty [boolean]
Whether any input has been touched. This prop is useful if you only what to enable the submit button when the one of the input has been touched.

## <a id="InputProps"></a>Input Props

### onChange(event, name, isFieldError, other) [function]
This function is called, once the library has completed its validation activities for the input's onChange event. There following parameter are pass to this function.  

**event [object]:** An input's onblur Event object.  
**name [string]:** The name of the input field.  
**isfieldError [boolean]:** Whether the event resulted in a validation error or not.  
**other [Array]** *optional* **:**  Any additional parameters that was passed to the change function is available here.

---

### onBlur(event, name, isfieldError, other) [function]
This function is called, once the library has completed its validation activities for the input's onBlur event. There following parameter are pass to this function.  

**event [object]:** An input's onblur Event object.  
**name [string]:** The name of the input field.  
**isfieldError [boolean]:** Whether the event resulted in a validation error or not.  
**other [Array]** *optional* **:**  Any additional parameters that was passed to the blur function is available here.

---

### onSubmit(other) [function]
This function is only called when the button's onClick is fired and there are ***no*** validation errors. If you wish to perform additional action even when there are errors use the onSubmitError function.

**other [Array]** *optional* **:**  Any additional parameters that was passed to the submit function is available here.

---

### onSubmitError(other) [function]
This function is called when the button's onClick event is fired and there are validation errors.

**other [Array]** *optional* **:**  Any additional parameters that was passed to the onClick function is available here.

---

### serverError [String or Array]
Pass any error message from the server to the formMessage array.

## <a id="API"></a>API

### change(event, fieldname, clearVal, clearMultiple, other).
Is called on an input's onChange event.  

**event [object]:** An input's onclick Event object.  
**fieldName [string]:** An input's name.  
**clearVal [boolean]:** Determine if the validation error for this input field should be cleared when the onChange event is fired.  
**clearMultiple [Array]:** Clear validation error(s) for other input fields when the onChange event is fired. Should be an array of strings, with the strings being the name of the input fields the error needs to be cleared from. Set it to `null` if not required.  
**other [object]** *optional* **:**  Pass additional parameters to the onChange callback function.

---

### blur(event, fieldname, other)
Is called on an input's onBlur event.

**event [object]:** An input's onEvent object.  
**fieldName [string]:** An input's name.  
**other [object]** *optional* **:**  Pass additional parameters to the onBlur callback function.

---

### submit(other)
Is called on the button's onClick event.

**other [object]** *optional* **:**  Pass additional parameters to the onSubmit callback function.

---

### addVal(rules)
Is used to set the validation rules at runtime. See [validation rules](#validation-rules) to see how the rules are created.

**rules [Array]:** An input's onclick Event object.  


## <a id="notes"></a>Notes
1. This library is a work in progress, so if you find any bugs or have suggestion for improvements please let us know.
2. To come: Documents for setting up dynamic validations and unit testing.
