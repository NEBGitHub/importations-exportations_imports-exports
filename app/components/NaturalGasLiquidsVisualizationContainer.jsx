import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import ExplanationPopovers from './ExplanationPopovers'
import BarChart from './BarChart'
import Axis from './Axis'
import * as NaturalGasLiquidsViewport from '../selectors/viewport/naturalGasLiquids'
import Constants from '../Constants'
import USPadd from './Padds/USPadd'
import CanadaMapContainer from './CanadaMapContainer'
import {activityExplanationPosition} from '../selectors/viewport/menus'
import NaturalGasLiquidsMapPieceActivityExplanation from './NaturalGasLiquidsMapPieceActivityExplanation'

class NaturalGasLiquidsVisualizationContainer extends React.Component {
  render() {
    return (<g>
      <CanadaMapContainer
        {...this.props.canadaMap}
      />
      <BarChart
        {...this.props.importChart}
        valueKey="imports"
        aggregateKey="activity"
        colour={Constants.getIn(['styleGuide', 'colours', 'ImportDefault'])}
      />
      <Axis
        {...this.props.axisPosition}
        barWidth={4}
      />
      <BarChart
        {...this.props.exportChart}
        valueKey="exports"
        aggregateKey="activity"
        flipped
        colour={Constants.getIn(['styleGuide', 'colours', 'ExportDefault'])}
      />
      <ExplanationPopovers
        xaxis={this.props.xaxis}
        yaxis={this.props.yaxis + this.props.height}
      />
       <USPadd 
        {...this.props.usPaddChart}
      />
      <NaturalGasLiquidsMapPieceActivityExplanation
      {...this.props.mapPieceActivityExplanation}
    />
    </g>)
  }
}

export default connect((state, props) => ({
  canadaMap: NaturalGasLiquidsViewport.canadaImportMap(state, props),
  importChart: NaturalGasLiquidsViewport.chartImportPosition(state, props),
  axisPosition: NaturalGasLiquidsViewport.chartAxisPosition(state, props),
  exportChart: NaturalGasLiquidsViewport.chartExportPosition(state, props),
  usPaddChart: NaturalGasLiquidsViewport.usPaddPosition(state, props),
  mapPieceActivityExplanation: activityExplanationPosition(state, props),
}))(NaturalGasLiquidsVisualizationContainer)
