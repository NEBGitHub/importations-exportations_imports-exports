import React from 'react'
import { connect } from 'react-redux'
import ElectricityMapLayout from './ElectricityMapLayout.jsx'
import Immutable from 'immutable'

class USMapContainer extends React.Component {
  render() {
    const detailBreakDownData = Immutable.fromJS({
      "WA": 9589756,
      "VA": 465467,
      "ID": 4678971,
      "OR": 5548646 
    })
    // Scale is temporary adjustment as it's too small if we use dimensions mentioned in the design document
    // //TODO: scale map dynamically when screen size change
    return (<g transform="scale(1.4) translate(0 -70)"> <ElectricityMapLayout
      left={this.props.left}
      top={this.props.top}
      country="us"
      detailBreakDownData={detailBreakDownData}
    />
            </g>)
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,

})


module.exports = connect(mapStateToProps)(USMapContainer)
