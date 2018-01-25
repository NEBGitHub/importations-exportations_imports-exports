import React from 'react'

import MapPiece from './MapPiece'
import MapPieceExplanationConstant from '../MapPieceExplanationConstant'

class ElectricityMapPieceActivityExplanation extends React.Component {
  render() {
    return (<g transform={`translate(${this.props.left},${this.props.top})`}>
      <MapPiece
        data={MapPieceExplanationConstant.getIn(['electricity', 'ca', 'datapoint'])}
        dimensions={MapPieceExplanationConstant.getIn(['electricity', 'ca', 'dimensions'])}
        legends={MapPieceExplanationConstant.getIn(['electricity', 'ca', 'legends'])}
        styles={MapPieceExplanationConstant.getIn(['electricity', 'ca', 'styles'])}
        arrowProps={MapPieceExplanationConstant.getIn(['electricity', 'ca', 'arrowProps'])}
        mapPieceProps={MapPieceExplanationConstant.getIn(['electricity', 'ca', 'mapPieceProps'])}
        legend
      />
      <g transform="translate(0,70)">
        <MapPiece
          data={MapPieceExplanationConstant.getIn(['electricity', 'us', 'datapoint'])}
          dimensions={MapPieceExplanationConstant.getIn(['electricity', 'us', 'dimensions'])}
          legends={MapPieceExplanationConstant.getIn(['electricity', 'us', 'legends'])}
          styles={MapPieceExplanationConstant.getIn(['electricity', 'us', 'styles'])}
          arrowProps={MapPieceExplanationConstant.getIn(['electricity', 'us', 'arrowProps'])}
          mapPieceProps={MapPieceExplanationConstant.getIn(['electricity', 'us', 'mapPieceProps'])}
          legend
        />
      </g>
            </g>)
  }
}


module.exports = ElectricityMapPieceActivityExplanation
