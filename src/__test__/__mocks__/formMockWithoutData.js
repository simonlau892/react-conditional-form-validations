import React, {Component} from 'react'
import dataMock from './dataMock.js'
export class TestFormWithoutData extends Component {
  render () {
    return (
      <div className='testForm'>
        <input
          name={'mainInput'}
          className={'mainInput'}
          value={null}
          onBlur={(e) => this.props.blur(this.props.mainValue, 'mainInput', dataMock)}
          onChange={(e) => this.props.change(this.props.mainValue, 'mainInput', this.props.clearVal, this.props.clearMultiple, dataMock)}
          />
        <input
          name={'secondInput'}
          className={'secondInput'}
          value={null}
          onBlur={(e) => this.props.blur(this.props.secondValue, 'secondInput', dataMock)}
          onChange={(e) => this.props.change(this.props.secondValue, 'secondInput', this.props.clearVal, this.props.clearMultiple, dataMock)}
            />
        <button className={'testButton'} onClick={(e) => (this.props.submit(dataMock))} />
      </div>
    )
  }
}
export default TestFormWithoutData
