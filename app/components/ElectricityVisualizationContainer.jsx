const React = require('react')
const PropTypes = require('prop-types')
const { connect } = require('react-redux')

const CanadaMapContainer = require('./CanadaMapContainer.jsx')
const USMapContainer = require('./USMapContainer.jsx')
const PowerPoolContainer = require('./PowerPoolContainer.jsx')
const PowerPoolGrouping = require('./PowerPoolGrouping.jsx')
const ExplanationPopovers = require('./ExplanationPopovers.jsx')
const ElectrictyMapPieceActivityExplantion = require('./ElectrictyMapPieceActivityExplantion.jsx')
const BarChart = require('./BarChart')
const Axis = require('./Axis')
const ElectricityViewport = require('../selectors/viewport/electricity')
const Constants = require('../Constants')
const { positionShape } = require('../propTypeShapes')

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
    <Axis
      {...props.axisPosition}
      barWidth={4}
    />
    <BarChart
      {...props.exportChart}
      valueKey="exports"
      aggregateKey="activity"
      flipped
      colour={Constants.getIn(['styleGuide', 'colours', 'ExportDefault'])}
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
    <ExplanationPopovers
      xaxis={props.xaxis}
      yaxis={props.yaxis + props.height}
    />
    <ElectrictyMapPieceActivityExplantion
      {...props.mapPieceActivityExplantion}
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
  mapPieceActivityExplantion: PropTypes.shape(positionShape).isRequired,
}

module.exports = connect((state, props) => ({
  canadaMap: ElectricityViewport.canadaMapPosition(state, props),
  usMap: ElectricityViewport.usMapPosition(state, props),
  powerPool: ElectricityViewport.powerPoolPosition(state, props),
  mapPieceActivityExplantion: ElectricityViewport.mapPieceActivityExplantionPosition(state, props),
  importChart: ElectricityViewport.chartImportPosition(state, props),
  axisPosition: ElectricityViewport.chartAxisPosition(state, props),
  exportChart: ElectricityViewport.chartExportPosition(state, props),
}))(ElectricityVisualizationContainer)
