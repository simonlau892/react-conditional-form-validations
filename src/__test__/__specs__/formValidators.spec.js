/* eslint-disable no-undef, no-unused-vars, import/first */
import React from 'react'
import { formValidators } from '../../lib'
//import {errorMsgFunctions} from '../../lib'

const {
  sameValidity,
  sameValue,
  notEmpty,
  checkAUSPostcode,
  minNotEmpty } = formValidators

  // const {
  //   sameValidity,
  //   sameValue,
  //   notEmpty,
  //   checkAUSPostcode,
  //   minNotEmpty } = errorMsgFunctions

  const errorMsgFunction = () => {}

describe('The form validator`s', () => {
  describe('notEmpty function should', () => {
    test('returns null if the inputs are not empty. [2.1.0]', () => {
      const fieldNames = ['mainInput', 'secondInput']
      const formData = [{name: 'mainInput', value: 'ee'}, {name: 'secondInput', value: 'ee'}]
      const result = notEmpty(fieldNames, formData)
      expect(result).toEqual(null)
    })
    test('return the correct error object if inputs are empty. [2.1.1]', () => {
      const fieldNames = ['mainInput', 'secondInput']
      const formData = [{name: 'mainInput', value: ''}, {name: 'secondInput', value: ''}]
      const returnObj = {"fields": ["mainInput", "secondInput"], "validator": expect.any(Function)}
      const result = notEmpty(fieldNames, formData)
      expect(result).toEqual(returnObj)
    })
  })
  describe('sameValidity function should', () => {
    test('returns null if both inputs have the same validaity. [2.2.0]', () => {
      const fieldNames = ['mainInput', 'secondInput']
      const formData = [{name: 'mainInput', value: ''}, {name: 'secondInput', value: ''}]
      const result = sameValidity(fieldNames, formData)
      expect(result).toEqual(null)
    })
    test('returns the correct error object if the inputs have different validities. [2.2.1]', () => {
      const fieldNames = ['mainInput', 'secondInput']
      const formData = [{name: 'mainInput', value: ''}, {name: 'secondInput', value: 'ttt'}]
      const returnObj = {"fields": ["mainInput"], "validator": expect.any(Function)}
      const result = sameValidity(fieldNames, formData)
      expect(result).toEqual(returnObj)
    })
  })
  describe('sameValue function should', () => {
    test('returns null if both inputs have the same values. [2.3.0]', () => {
      const fieldNames = ['mainInput', 'secondInput']
      const formData = [{name: 'mainInput', value: 'tt'}, {name: 'secondInput', value: 'tt'}]
      const result = sameValue(fieldNames, formData)
      expect(result).toEqual(null)
    })
    test('returns the correct error object if the inputs have different values. [2.3.1]', () => {
      const fieldNames = ['mainInput', 'secondInput']
      const formData = [{name: 'mainInput', value: 'bb'}, {name: 'secondInput', value: 'ttt'}]
      const returnObj = {"fields": ["mainInput", "secondInput"], "validator": expect.any(Function)}
      const result = sameValue(fieldNames, formData)
      expect(result).toEqual(returnObj)
    })
  })

  describe('checkAUSPostcode function should', () => {
    test('returns null if postcode is in the correct state range and the country is Australia. [2.4.0]', () => {
      const fieldNames = ['country', 'state', 'postcode']
      const formData = [{name: 'country', value: 'AU'}, {name: 'state', value: 'NSW'}, {name: 'postcode', value: '2020'}]
      const result = checkAUSPostcode(fieldNames, formData)
      expect(result).toEqual(null)
    })
    test('returns the correct error message if postcode is not in the correct state range and the country is Australia. [2.4.1]', () => {
      const fieldNames = ['country', 'state', 'postcode']
      const formData = [{name: 'country', value: 'AU'}, {name: 'state', value: 'NSW'}, {name: 'postcode', value: '6000'}]
      const returnObj = {"fields": ["postcode"], "validator": expect.any(Function)}
      const result = checkAUSPostcode(fieldNames, formData)
      expect(result).toEqual(returnObj)
    })
    test('not run if the country is not Australia. [2.4.2]', () => {
      const fieldNames = ['country', 'state', 'postcode']
      const formData = [{name: 'country', value: 'USA'}, {name: 'state', value: 'NSW'}, {name: 'postcode', value: '6000'}]
      const result = checkAUSPostcode(fieldNames, formData)
      expect(result).toEqual(null)
    })
  })
  describe('minNotEmpty function should', () => {
    test('return null if the minimum number of non-empty inputs are met. [2.5.0]', () => {
      const fieldNames = ['mainInput', 'secondInput', 'thirdInput']
      const formData = [{name: 'mainInput', value: 'tt'}, {name: 'secondInput', value: 'tt'}, {name: 'thirdInput', value: 'hh'}]
      const result = minNotEmpty(3)(fieldNames, formData)
      expect(result).toEqual(null)
    })
    test('return the correct error object if the number of empty inputs are greater than the minimum set. [2.5.1]', () => {
      const fieldNames = ['mainInput', 'secondInput', 'thirdInput']
      const formData = [{name: 'mainInput', value: 'tt'}, {name: 'secondInput', value: 'tt'}, {name: 'thirdInput', value: ''}]
      const returnObj = {"fields": ["thirdInput"], "validator": expect.any(Function)}
      const result = minNotEmpty(3)(fieldNames, formData)
      expect(result).toEqual(returnObj)
    })
  })
})
