import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'


import StackedChart from './StackedChart'
import BarChart from './BarChart'
import Axis from './Axis'
import DetailSidebar from './DetailSidebar'
import DetailBreakdown from './DetailBreakdown'
import DetailBreakdownHeader from './DetailBreakdownHeader'
import * as CrudeOilViewport from '../selectors/viewport/crudeOilImports'
import Constants from '../Constants'
import { positionShape } from '../propTypeShapes'
import WorldMapContainer from './WorldMapContainer'
import CAImportPadd from './Padds/CAImportPadd'
import { legendMapPosition } from '../selectors/viewport/menus'
// import CrudeOilPieceActivityExplanation from './CrudeOilPieceActivityExplanation'
import Tr from '../TranslationTable'

const categoryColours = Constants.getIn(['styleGuide', 'categoryColours'])
const CrudeOilImportsVisualizationContainer = props => (
  <g>
    <CAImportPadd {...props.canadaPaddChart} />
    <BarChart
      {...props.importChart}
      valueKey="activity"
      activityValueKey="imports"
      groupBy="period"
      colour={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
      tabIndex={Constants.getIn(['tabIndex', 'start', 'visualization', 'timeline'])}
    />
    <DetailSidebar
      {...props.importChart}
    >
      <DetailBreakdown
        height="100%"
        groupBy="activity"
        showGroup="imports"
        valueKey="destination"
        valueAverage
        color={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
        trContent={Tr.getIn(['detailBreakDown', 'crudeOilImports', 'imports'])}
        nameMappings={Tr.getIn(['Padd', 'ca'])}
      />
    </DetailSidebar>
    <Axis
      {...props.axisPosition}
      barWidth={4}
      canChangeScale={false}
      tabIndex={Constants.getIn(['tabIndex', 'start', 'visualization', 'timeline'])}
    />
    <WorldMapContainer {...props.worldChartPosition} />
    <DetailSidebar
      {...props.worldChartPosition}
    >
      <DetailBreakdown
        height="100%"
        groupBy="activity"
        showGroup="imports"
        valueKey="destination"
        valueAverage
        color={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
        trContent={Tr.getIn(['detailBreakDown', 'crudeOilImports', 'imports'])}
        nameMappings={Tr.getIn(['Padd', 'us'])}
      />
    </DetailSidebar>
    {/*
    <CrudeOilPieceActivityExplanation
      {...props.mapPieceActivityExplanation}
    />
    */}
  </g>
)

CrudeOilImportsVisualizationContainer.propTypes = {
  xaxis: PropTypes.number.isRequired,
  yaxis: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  importChart: PropTypes.shape(positionShape).isRequired,
  axisPosition: PropTypes.shape(positionShape).isRequired,
}

export default connect((state, props) => ({
  importChart: CrudeOilViewport.chartImportPosition(state, props),
  axisPosition: CrudeOilViewport.chartAxisPosition(state, props),
  canadaPaddChart: CrudeOilViewport.canadaPaddPosition(state, props),
  worldChartPosition: CrudeOilViewport.worldChartPosition(state, props),
  mapPieceActivityExplanation: legendMapPosition(state, props),
}))(CrudeOilImportsVisualizationContainer)
