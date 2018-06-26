/* eslint-disable no-undef, no-unused-vars, import/first */
import React from 'react'
import dataMock from '../__mocks__/dataMock.js'
import FormWithData from '../__mocks__/formMockWithData.js'
import FormWithoutData from '../__mocks__/formMockWithoutData.js'
import message from '../__data__/validationMessage.js'
import { rules } from '../__data__/validationRules.js'
import validationWrapper from '../../lib'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'

const props = {
  onChange: jest.fn(),
  onBlur: jest.fn(),
  onSubmit: jest.fn(),
  onSubmitError: jest.fn()
}

describe('In the validation library', () => {
  let wrapper
  // =====================================================
  describe('when the blur event is activated', () => {
    beforeAll(() => {
      const el = () => validationWrapper(message, rules)(FormWithoutData)
      const HOC = el()
      wrapper = mount(<HOC {...props} />)
    })
    beforeEach(() => {
      jest.resetAllMocks()
      wrapper.find('.mainInput').simulate('blur')
    })
    afterAll(() => {
      wrapper.unmount()
    })
    describe('and the input value violates a field validation rule then', () => {
      beforeAll(() => {
        wrapper.setProps({
          mainValue: {'target': {'value': 'not a number'}},
          secondValue: {'target': {'value': '123456'}}
        })
      })
      test('the isFieldError prop should be true. [3.1.1.0]', () => {
        expect(wrapper.find(FormWithoutData).props().isFieldError).toBe(true)
      })
      test('the fieldError object should contain the correct error. [3.1.1.1]', () => {
        const fieldErrorObj = {'mainInputError': 'The code doesn’t look correct, try again it violates a field rule'}
        expect(wrapper.find(FormWithoutData).props().fieldErrors).toEqual(fieldErrorObj)
      })
      test('the onBlur callback function should be called one time. [3.1.1.2]', () => {
        expect(wrapper.props().onBlur).toHaveBeenCalledTimes(1)
      })
      test('the onBlur callback function should be called with the correct parameters. [3.1.1.3]', () => {
        expect(wrapper.props().onBlur).toHaveBeenCalledWith({'target': {'value': 'not a number'}}, 'mainInput', true, [dataMock])
      })
    })
  })
  describe('when the submit event is activated', () => {
    describe('and the input value violates either a form or field validation rule then', () => {
      beforeAll(() => {
        const el = () => validationWrapper(message, rules)(FormWithoutData)
        const HOC = el()
        wrapper = mount(<HOC {...props} />, { attachTo: document.body })
      })
      beforeEach(() => {
        jest.resetAllMocks()
        wrapper.find('.testButton').simulate('click')
      })
      afterAll(() => {
        wrapper.detach()
        wrapper.unmount()
      })
      test('the isFormError prop should be true. [3.2.2.0]', () => {
        expect(wrapper.find(FormWithoutData).props().isFormError).toBe(true)
      })
      test('the isFieldError prop should be true. [3.2.2.1]', () => {
        expect(wrapper.find(FormWithoutData).props().isFieldError).toBe(true)
      })
      test('the formError object should contain the correct error. [3.2.2.2]', () => {
        const formErrorObj = {
          'mainInputError': 'The code doesn’t look correct, it violates a form rule',
          'secondInputError': 'The code doesn’t look correct, it violates a form rule'
        }
        expect(wrapper.find(FormWithoutData).props().formErrors).toEqual(formErrorObj)
      })
      test('the fieldError object should contain the correct error. [3.2.2.3]', () => {
        const fieldErrorObj = {
          'mainInputError': 'The code doesn’t look correct, it violates a form rule',
          'secondInputError': 'The code doesn’t look correct, it violates a form rule'
        }
        expect(wrapper.find(FormWithoutData).props().fieldErrors).toEqual(fieldErrorObj)
      })
      test('the formMessage array should contain the correct message. [3.2.2.4]', () => {
        const formMessage = ['The code doesn’t look correct, it violates a form rule', 'The code doesn’t look correct, it violates a form rule']
        expect(wrapper.find(FormWithoutData).props().formMessage).toEqual(formMessage)
      })
      test('the onSubmitError callback should be called one time. [3.2.2.5]', () => {
        expect(wrapper.props().onSubmitError).toHaveBeenCalledTimes(1)
      })
      test('the onSubmit callback should be called zero time. [3.2.2.6]', () => {
        expect(wrapper.props().onSubmit).toHaveBeenCalledTimes(0)
      })
    })
    describe('and the input value does not violates a form/field validation rule then', () => {
      beforeAll(() => {
        const el = () => validationWrapper(message, rules)(FormWithData)
        const HOC = el()
        wrapper = mount(<HOC {...props} />, { attachTo: document.body })
      })
      beforeEach(() => {
        jest.resetAllMocks()
        wrapper.find('.testButton').simulate('click')
      })
      afterAll(() => {
        wrapper.detach()
        wrapper.unmount()
      })
      test('the isFormError prop should be false. [3.2.3.0]', () => {
        expect(wrapper.find(FormWithData).props().isFormError).toBe(false)
      })
      test('the isFieldError prop should be false. [3.2.3.1]', () => {
        expect(wrapper.find(FormWithData).props().isFieldError).toBe(false)
      })
      test('the formError object should not contain any error. [3.2.3.2]', () => {
        const formErrorObj = {}
        expect(wrapper.find(FormWithData).props().formErrors).toEqual(formErrorObj)
      })
      test('the fieldError object should not contain any error. [3.2.3.3]', () => {
        const fieldErrorObj = {}
        expect(wrapper.find(FormWithData).props().fieldErrors).toEqual(fieldErrorObj)
      })
      test('the formMessage array should be empty. [3.2.3.4]', () => {
        const formMessage = []
        expect(wrapper.find(FormWithData).props().formMessage).toEqual(formMessage)
      })
      test('the onSubmitError callback should be called zero time. [3.2.3.5]', () => {
        expect(wrapper.props().onSubmitError).toHaveBeenCalledTimes(0)
      })
      test('the onSubmit callback should be called one time. [3.2.3.6]', () => {
        expect(wrapper.props().onSubmit).toHaveBeenCalledTimes(1)
      })
    })
  })
  describe('when the on change event is activated', () => {
    beforeAll(() => {
      const el = () => validationWrapper(message, rules)(FormWithoutData)
      const HOC = el()
      wrapper = mount(<HOC {...props} />)
    })
    afterAll(() => {
      wrapper.unmount()
    })
    describe('and there are existing field validation errors on the main and secondary inputs and', () => {
      describe('the clearVal property is set to true and clearMultiple is null then', () => {
        beforeAll(() => {
          wrapper.find('.testButton').simulate('click')
        })
        beforeEach(() => {
          jest.resetAllMocks()
          wrapper.setProps({
            mainValue: {'target': {'value': '1'}},
            clearVal: true,
            clearMultiple: null
          })
          wrapper.find('.mainInput').simulate('change')
        })
        test('the isFieldError prop should be null. [3.3.1.1.0]', () => {
          expect(wrapper.find(FormWithoutData).props().isFieldError).toBe(null)
        })
        test('the fieldError object should contain an error message for the second input but not for the main input. [3.3.1.1.1]', () => {
          const fieldErrorObj = {
            'mainInputError': null,
            'secondInputError': 'The code doesn’t look correct, it violates a form rule'
          }
          expect(wrapper.find(FormWithoutData).props().fieldErrors).toEqual(fieldErrorObj)
        })
        test('the onChange callback function should be called one time. [3.3.1.1.2]', () => {
          expect(wrapper.props().onChange).toHaveBeenCalledTimes(1)
        })
        test('the onChange callback function should be called with the correct parameters. [3.3.1.1.3]', () => {
          expect(wrapper.props().onChange).toHaveBeenCalledWith({'target': {'value': '1'}}, 'mainInput', null, [dataMock])
        })
      })
      describe('the clearVal property is set to true and clearMultiple is set to clear the second input ', () => {
        beforeAll(() => {
          wrapper.find('.testButton').simulate('click')
        })
        beforeEach(() => {
          jest.resetAllMocks()
          wrapper.setProps({
            mainValue: {'target': {'value': 'not a number'}},
            clearVal: true,
            clearMultiple: ['secondInput']
          })
          wrapper.find('.mainInput').simulate('change')
        })
        test('the isFieldError prop should be null. [3.3.1.2.0]', () => {
          expect(wrapper.find(FormWithoutData).props().isFieldError).toBe(null)
        })
        test('the fieldError object should contain no error message for the second input and the main input. [3.3.1.2.1]', () => {
          const fieldErrorObj = {
            'mainInputError': null,
            'secondInputError': null
          }
          expect(wrapper.find(FormWithoutData).props().fieldErrors).toEqual(fieldErrorObj)
        })
        test('the onChange callback function should be called one time. [3.3.1.2.2]', () => {
          expect(wrapper.props().onChange).toHaveBeenCalledTimes(1)
        })
        test('the onChange callback function should be called with the correct parameters. [3.3.1.2.3]', () => {
          expect(wrapper.props().onChange).toHaveBeenCalledWith({'target': {'value': 'not a number'}}, 'mainInput', null, [dataMock])
        })
      })
    })
  })
  describe('when validation rules are added dynamically', () => {
    beforeAll(() => {
      const el = () => validationWrapper(message)(FormWithoutData)
      const HOC = el()
      // const spy = jest.spyOn(HOC.prototype, 'addDynamicValidation')
      wrapper = mount(<HOC {...props} />, { attachTo: document.body })
    })
    afterAll(() => {
      wrapper.detach()
      wrapper.unmount()
    })
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // test('the addDynamicValidation function should be called once', () => {
    //   const spyOn = jest.spyOn(wrapper.instance(), 'addDynamicValidation')
    //   wrapper.update()
    //   wrapper.find(FormWithoutData).props().addVal(rules)
    //   expect(spyOn).toHaveBeenCalled()
    // })

    test('the HOC state should contain the validation rules. [3.4.0]', () => {
      wrapper.find(FormWithoutData).props().addVal(rules)
      expect(wrapper.state().dynamicVal).toEqual(rules)
    })
    describe('and when the blur event is activated', () => {
      beforeEach(() => {
        jest.resetAllMocks()
        wrapper.find('.mainInput').simulate('blur')
      })
      describe('and the input value violates a field validation rule then', () => {
        beforeAll(() => {
          wrapper.setProps({
            mainValue: {'target': {'value': 'not a number'}},
            secondValue: {'target': {'value': '123456'}}
          })
        })
        test('the isFieldError prop should be true. [3.4.0.0.0]', () => {
          expect(wrapper.find(FormWithoutData).props().isFieldError).toBe(true)
        })
        test('the fieldError object should contain the correct error. [3.4.0.0.1]', () => {
          const fieldErrorObj = {'mainInputError': 'The code doesn’t look correct, try again it violates a field rule'}
          expect(wrapper.find(FormWithoutData).props().fieldErrors).toEqual(fieldErrorObj)
        })
      })
    })
    describe('when the submit event is activated', () => {
      describe('and the input value violates either a form or field validation rule then', () => {
        beforeEach(() => {
          jest.resetAllMocks()
          wrapper.find('.testButton').simulate('click')
        })
        test('the isFormError prop should be true. [3.4.1.0.0]', () => {
          expect(wrapper.find(FormWithoutData).props().isFormError).toBe(true)
        })
        test('the isFieldError prop should be true. [3.4.1.0.1]', () => {
          expect(wrapper.find(FormWithoutData).props().isFieldError).toBe(true)
        })
        test('the formError object should contain the correct error. [3.4.1.0.2]', () => {
          const formErrorObj = {
            'mainInputError': 'The code doesn’t look correct, it violates a form rule',
            'secondInputError': 'The code doesn’t look correct, it violates a form rule'
          }
          expect(wrapper.find(FormWithoutData).props().formErrors).toEqual(formErrorObj)
        })
        test('the fieldError object should contain the correct error. [3.4.1.0.3]', () => {
          const fieldErrorObj = {
            'mainInputError': 'The code doesn’t look correct, it violates a form rule',
            'secondInputError': 'The code doesn’t look correct, it violates a form rule'
          }
          expect(wrapper.find(FormWithoutData).props().fieldErrors).toEqual(fieldErrorObj)
        })
        test('the formMessage array should contain the correct message. [3.4.1.0.4]', () => {
          const formMessage = ['The code doesn’t look correct, it violates a form rule', 'The code doesn’t look correct, it violates a form rule']
          expect(wrapper.find(FormWithoutData).props().formMessage).toEqual(formMessage)
        })
      })
    })
  })
  describe('when external server errors are passed in', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      const el = () => validationWrapper(message)(FormWithoutData)
      const HOC = el()
      wrapper = mount(<HOC {...props} />)
      wrapper.setState({ isSubmitClicked: true })
    })
    afterEach(() => {
      wrapper.unmount()
    })
    test('and it is of type string then the formMessage Array should contain the correct server message. [3.5.0]', () => {
      const newProps = {'serverError': 'this is a server error', ...props}
      wrapper.instance().componentWillReceiveProps(newProps)
      expect(wrapper.state().formMessage).toEqual(expect.arrayContaining(['this is a server error']))
    })
    test('and it is of type array then the formMessage Array should contain the correct server messages. [3.5.1]', () => {
      const newProps = {'serverError': ['this is a server error', 'this is a server error2'], ...props}
      wrapper.instance().componentWillReceiveProps(newProps)
      expect(wrapper.state().formMessage).toEqual(expect.arrayContaining(['this is a server error', 'this is a server error2']))
    })
  })
})
