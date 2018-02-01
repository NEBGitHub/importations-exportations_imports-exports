import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CanadaMapContainer from './CanadaMapContainer'
import USMapContainer from './USMapContainer'
import PowerPoolContainer from './PowerPoolContainer'
import PowerPoolGrouping from './PowerPoolGrouping'
import ElectricityMapPieceActivityExplanation from './ElectricityMapPieceActivityExplanation'

import BarChart from './BarChart'
import Axis from './Axis'
import ElectricityViewport from '../selectors/viewport/electricity'
import Constants from '../Constants'
import { positionShape } from '../propTypeShapes'

const ElectricityVisualizationContainer = props => (
  <g>
    <CanadaMapContainer
      {...props.canadaMap}
    />
    <BarChart
      {...props.importChart}
      valueKey="imports"
      aggregateKey="activity"
      colour={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
    />
    <BarChart
      {...props.exportChart}
      valueKey="exports"
      aggregateKey="activity"
      flipped
      colour={Constants.getIn(['styleGuide', 'colours', 'ExportDefault'])}
    />
    <Axis
      {...props.axisPosition}
      barWidth={4}
    />
    <USMapContainer
      {...props.usMap}
    />
    <PowerPoolContainer
      {...props.powerPool}
    />
    <PowerPoolGrouping
      {...props.powerPool}
    />
    <ElectricityMapPieceActivityExplanation
      {...props.mapPieceActivityExplanation}
    />
  </g>
)

ElectricityVisualizationContainer.propTypes = {
  xaxis: PropTypes.number.isRequired,
  yaxis: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  canadaMap: PropTypes.shape(positionShape).isRequired,
  usMap: PropTypes.shape(positionShape).isRequired,
  powerPool: PropTypes.shape(positionShape).isRequired,
  importChart: PropTypes.shape(positionShape).isRequired,
  axisPosition: PropTypes.shape(positionShape).isRequired,
  exportChart: PropTypes.shape(positionShape).isRequired,
  mapPieceActivityExplanation: PropTypes.shape(positionShape).isRequired,
}

module.exports = connect((state, props) => ({
  canadaMap: ElectricityViewport.canadaMapPosition(state, props),
  usMap: ElectricityViewport.usMapPosition(state, props),
  powerPool: ElectricityViewport.powerPoolPosition(state, props),
  mapPieceActivityExplanation: ElectricityViewport.mapPieceActivityExplanationPosition(state, props),
  importChart: ElectricityViewport.chartImportPosition(state, props),
  axisPosition: ElectricityViewport.chartAxisPosition(state, props),
  exportChart: ElectricityViewport.chartExportPosition(state, props),
}))(ElectricityVisualizationContainer)
