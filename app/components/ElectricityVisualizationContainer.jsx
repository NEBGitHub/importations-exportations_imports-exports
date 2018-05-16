import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Constants from '../Constants'
import Tr from '../TranslationTable'

import CanadaMapContainer from './CanadaMapContainer'
import USMapContainer from './USMapContainer'
import PowerPoolContainer from './PowerPoolContainer'
import PowerPoolGrouping from './PowerPoolGrouping'
import ElectricityMapPieceActivityExplanation from './ElectricityMapPieceActivityExplanation'

import BarChart from './BarChart'
import Axis from './Axis'

import { amount } from '../selectors/data'
import * as ElectricityViewport from '../selectors/viewport/electricity'
import { showImportsSelector, showExportsSelector } from '../selectors/visualizationSettings'
// import { legendMapPosition } from '../selectors/viewport/menus'
import { positionShape } from '../propTypeShapes'
import DetailBreakdown from './DetailBreakdown'
import DetailTotal from './DetailTotal'
import ConfidentialCount from './ConfidentialCount'
import MissingDataCount from './MissingDataCount'
import DetailSidebar from './DetailSidebar'

const nameMappingsUSAndPools = Tr.getIn(['country', 'us'])
  .merge(Tr.getIn(['country', 'powerpool']))

const ElectricityVisualizationContainer = (props) => {
  const weighted = props.unit === 'CAN$/MW.h' ? 'weighted' : false
  return (<g>
    <CanadaMapContainer {...props.canadaMap} valueAverage={weighted} />

    {!props.showImports ? null : (
      <React.Fragment>
        <BarChart
          {...props.importChart}
          valueKey="activity"
          activityValueKey="imports"
          groupBy="period"
          valueAverage={weighted}
          colour={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
          tabIndex={Constants.getIn(['tabIndex', 'start', 'visualization', 'timeline'])}
        />
        <DetailSidebar {...props.canadaMap}>
          <DetailBreakdown
            {...props.canadaMap}
            filterActivity="imports"
            groupBy="activity"
            valueKey="destinationKey"
            valueAverage={weighted}
            showGroup="imports"
            color={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
            trContent={Tr.getIn(['detailBreakDown', 'electricity', 'imports'])}
            nameMappings={Tr.getIn(['country', 'ca'])}
          />
        </DetailSidebar>
        <DetailSidebar {...props.importChart}>
          <div className="verticalAlign">
            <div className="centered">
              <MissingDataCount
                valueKey="destinationKey"
                filterActivity="imports"
                groupBy="activity"
                valueAverage={weighted}
                country="ca"
              />
              <ConfidentialCount
                valueKey="destinationKey"
                filterActivity="imports"
                groupBy="activity"
                valueAverage={weighted}
                country="ca"
              />
              <DetailTotal
                type="imports"
                filterActivity="imports"
                showGroup="imports"
                groupBy="activity"
                valueKey="activity"
                valueAverage={weighted}
                country="ca"
              />
            </div>
          </div>
        </DetailSidebar>
      </React.Fragment>
    )}

    <Axis
      {...props.axisPosition}
      barWidth={4}
      tabIndex={Constants.getIn(['tabIndex', 'start', 'visualization', 'timeline'])}
    />
    {!props.showExports ? null : (
      <React.Fragment>
        <BarChart
          {...props.exportChart}
          valueKey="activity"
          activityValueKey="exports"
          groupBy="period"
          valueAverage={weighted}
          flipped
          colour={Constants.getIn(['styleGuide', 'colours', 'ExportDefault'])}
          tabIndex={Constants.getIn(['tabIndex', 'start', 'visualization', 'timeline'])}
        />
        <DetailSidebar {...props.exportChart}>
          <div className="verticalAlign">
            <div className="centered">
              <DetailTotal
                type="exports"
                filterActivity="exports"
                showGroup="exports"
                groupBy="activity"
                valueKey="activity"
                valueAverage={weighted}
                country="us"
              />
              <ConfidentialCount
                valueKey="destinationKey"
                filterActivity="exports"
                groupBy="activity"
                valueAverage={weighted}
                country="us"
              />
              <MissingDataCount
                valueKey="destinationKey"
                filterActivity="exports"
                groupBy="activity"
                valueAverage={weighted}
                country="us"
              />
            </div>
          </div>
        </DetailSidebar>
        <DetailSidebar {...props.usMap}>
          <DetailBreakdown
            {...props.usMap}
            groupBy="activity"
            valueKey="destinationKey"
            valueAverage={weighted}
            showGroup="exports"
            trContent={Tr.getIn(['detailBreakDown', 'electricity', 'exports'])}
            nameMappings={nameMappingsUSAndPools}
          />
        </DetailSidebar>
      </React.Fragment>
    )}
    <USMapContainer {...props.usMap} valueAverage={weighted} />
    <PowerPoolContainer {...props.powerPool} />
    <PowerPoolGrouping {...props.powerPool} />
    {/*
    <ElectricityMapPieceActivityExplanation
      {...props.mapPieceActivityExplanation}
    />
    */}
  </g>)
}

ElectricityVisualizationContainer.propTypes = {
  canadaMap: PropTypes.shape(positionShape).isRequired,
  usMap: PropTypes.shape(positionShape).isRequired,
  /*
  xaxis: PropTypes.number.isRequired,
  yaxis: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  powerPool: PropTypes.shape(positionShape).isRequired,
  */
  importChart: PropTypes.shape(positionShape).isRequired,
  axisPosition: PropTypes.shape(positionShape).isRequired,
  exportChart: PropTypes.shape(positionShape).isRequired,
  /*mapPieceActivityExplanation: PropTypes.shape(positionShape).isRequired,
  */
  showImports: PropTypes.bool.isRequired,
  showExports: PropTypes.bool.isRequired,
}

export default connect((state, props) => ({
  canadaMap: ElectricityViewport.canadaMapPosition(state, props),
  usMap: ElectricityViewport.usMapPosition(state, props),
  importChart: ElectricityViewport.chartImportPosition(state, props),
  powerPool: ElectricityViewport.powerPoolPosition(state, props),
  // mapPieceActivityExplanation: legendMapPosition(state, props),
  axisPosition: ElectricityViewport.chartAxisPosition(state, props),
  exportChart: ElectricityViewport.chartExportPosition(state, props),
  unit: amount(state, props),
  showImports: showImportsSelector(state, props),
  showExports: showExportsSelector(state, props),
}))(ElectricityVisualizationContainer)
