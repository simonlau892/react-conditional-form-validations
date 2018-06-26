/* eslint-disable no-undef, no-unused-vars, import/first */
import React from 'react'
import {fieldValidators} from '../../lib'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'

const {
  required,
  isInRange,
  isEmail,
  isNumber,
  isNumberNoSymbol,
  isDate,
  isDateMonthYear,
  isAddress} = fieldValidators

const name = 'testname'

const message = {
  'testname': {
    required: `required not met`,
    isInRange: `isInRange not met`,
    isEmail: `isEmail not met`,
    isNumber: `isNumber not met`,
    isNumberNoSymbol: `isNumberNoSymbol not met`,
    valueUndefined: `valueUndefined not met`,
    isDate: `isDate not met`,
    isDateMonthYear: `isDateMonthYear not met`,
    isAddress: `isAddress not met`
  }
}

describe('The field validator', () => {
  describe('Required function should', () => {
    test('returns null if value is present. [1.1.0]', () => {
      const value = 0
      const result = required(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value is not present. [1.1.1]', () => {
      const value = ''
      const result = required(value)
      const error = result(name, message)
      const errorMsg = 'required not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.1.2]', () => {
      const value = ''
      const result = required(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isInRange function should', () => {
    test('returns null if value is within the given range. [1.2.0]', () => {
      const value = 'test'
      const result = isInRange(2, 6)(value)
      expect(result).toEqual(null)
    })
    test('returns null if value is undefined [1.2.1]', () => {
      const value = ''
      const result = isInRange(2, 6)(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value is not in range. [1.2.2]', () => {
      const value = 'i like unit testing'
      const result = isInRange(2, 6)(value)
      const error = result(name, message)
      const errorMsg = 'isInRange not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.2.3]', () => {
      const value = 'i like unit testing'
      const result = isInRange(2, 6)(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isEmail function should', () => {
    test('returns null if value matches the email regex. [1.3.0]', () => {
      const value = 'test@testing.com'
      const result = isEmail(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value does not match the email regex. [1.3.1]', () => {
      const value = 'i like unit testing'
      const result = isEmail(value)
      const error = result(name, message)
      const errorMsg = 'isEmail not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.3.2]', () => {
      const value = 'i like unit testing'
      const result = isEmail(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isNumber function should', () => {
    test('returns null if value matchs a number. [1.4.0]', () => {
      const value = '+162727'
      const result = isNumber(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value does not match a number. [1.4.1]', () => {
      const value = '1576&()'
      const result = isNumber(value)
      const error = result(name, message)
      const errorMsg = 'isNumber not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.4.2]', () => {
      const value = '1576&()'
      const result = isNumber(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isNumberNoSymbol function should', () => {
    test('returns null if value matchs a number and has no symbols. [1.5.0]', () => {
      const value = '162727'
      const result = isNumberNoSymbol(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value does not match a number or contains symbol. [1.5.1]', () => {
      const value = '+1576'
      const result = isNumberNoSymbol(value)
      const error = result(name, message)
      const errorMsg = 'isNumberNoSymbol not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.5.2]', () => {
      const value = '+1576'
      const result = isNumberNoSymbol(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isDate function should', () => {
    test('returns null if value matchs a valid date. [1.6.0]', () => {
      const value = '12/12/1999'
      const result = isDate(value)
      expect(result).toEqual(null)
    })
    test('returns null if value does not match a valid date. [1.6.1]', () => {
      const value = '22/30/1999'
      const result = isDate(value)
      const error = result(name, message)
      const errorMsg = 'isDate not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns null if value is undefined. [1.6.2]', () => {
      const value = ''
      const result = isDate(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value is not in the correct format. [1.6.3]', () => {
      const value = 'EE/AA/CCCC'
      const result = isDate(value)
      const error = result(name, message)
      const errorMsg = 'isDate not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns correct error message if value represent a future date. [1.6.4]', () => {
      const date = new Date()
      const year = date.getFullYear()
      const value = `'12/12/${year + 1}`
      const result = isDate(value)
      const error = result(name, message)
      const errorMsg = 'isDate not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns null if its a leap year and the day is set to the 29th of Feb. [1.6.5]', () => {
      const value = '29/02/2016'
      const result = isDate(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if its leap year and the day is greater than 29th of Feb. [1.6.6]', () => {
      const value = '30/02/2016'
      const result = isDate(value)
      const error = result(name, message)
      const errorMsg = 'isDate not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns correct error message if its not a leap year and the day is set to the 29th of Feb. [1.6.7]', () => {
      const value = '29/02/2017'
      const result = isDate(value)
      const error = result(name, message)
      const errorMsg = 'isDate not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.6.8]', () => {
      const value = '29/02/2017'
      const result = isDate(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isDateMonthYear function should. [1.7.0]', () => {
    test('returns null if value matchs a valid date', () => {
      const value = '12/1999'
      const result = isDateMonthYear(value)
      expect(result).toEqual(null)
    })
    test('returns null if value is undefined. [1.7.1]', () => {
      const value = ''
      const result = isDateMonthYear(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value is not in the correct format. [1.7.2]', () => {
      const value = 'AA/BBBB'
      const result = isDateMonthYear(value)
      const error = result(name, message)
      const errorMsg = 'isDateMonthYear not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns correct error message if value does not contain a valid month. [1.7.3]', () => {
      const value = '13/1999'
      const result = isDateMonthYear(value)
      const error = result(name, message)
      const errorMsg = 'isDateMonthYear not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns correct error message if value is not a valid date. [1.7.4]', () => {
      const date = new Date()
      const year = date.getFullYear()
      const value = `'12/${year + 1}`
      const result = isDateMonthYear(value)
      const error = result(name, message)
      const errorMsg = 'isDateMonthYear not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns correct error message if value represent a future date. [1.7.5]', () => {
      const value = '12/3000'
      const result = isDateMonthYear(value)
      const error = result(name, message)
      const errorMsg = 'isDateMonthYear not met'
      expect(error).toEqual(errorMsg)
    })
    test('returns default error message if there is no message. [1.7.6]', () => {
      const value = '12/3000'
      const result = isDateMonthYear(value)
      const error = result(name, {'testname': {default: 'Enter a valid response'}})
      const errorMsg = 'Enter a valid response'
      expect(error).toEqual(errorMsg)
    })
  })
  describe('isAddress function should', () => {
    test('returns null if value matches the QantasAddress regex. [1.8.0]', () => {
      const value = 'a-z A-Z0-9-\'/.,#&'
      const result = isAddress(value)
      expect(result).toEqual(null)
    })
    test('returns correct error message if value does not match the email regex. [1.8.1]', () => {
      const value = '*%$@'
      const result = isAddress(value)
      const error = result(name, message)
      const errorMessage = 'isAddress not met'
      expect(error).toEqual(errorMessage)
    })
  })
})
