import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import PropTypes from 'prop-types'

import NaturalGasLiquidMapPiece from './NaturalGasLiquidMapPiece'
import MapLayoutGridConstant from '../MapLayoutGridConstant'
import Constants from '../Constants'
import Tr from '../TranslationTable'
import TrSelector from '../selectors/translate'
import { visualizationSettings } from '../selectors/visualizationSettings'

import { setSelection } from '../actions/visualizationSettings'
import './ElectricityMapLayout.scss'

import { getElectricityMapLayout, getSelectionSettings } from '../selectors/NaturalGasSelector'
import { arrangeBy, binSelector, sortAggregatedLocationsSelector, subType } from '../selectors/data'
import DetailSidebar from './DetailSidebar'
import DetailBreakdown from './DetailBreakdown'
import { handleInteraction } from '../utilities'

const mapPieceTransformStartXaxis = (position, dimensions, mapPieceScale) => (position.get('x') * ((mapPieceScale * dimensions.get('width')) + dimensions.get('xAxisPadding')))
const mapPieceTransformStartYaxis = (position, dimensions, mapPieceScale) => (position.get('y') * ((mapPieceScale * dimensions.get('height')) + dimensions.get('yAxisPadding')))

const powerPoolTransform = (xaxis, yaxis, position, dimensions, mapPieceScale) => {
  const startXaxis = xaxis + (position.get('x') * ((mapPieceScale * dimensions.get('width')) + dimensions.get('xAxisPadding')))
  const startYaxis = yaxis + (position.get('y') * ((mapPieceScale * dimensions.get('height')) + dimensions.get('yAxisPadding')))
  return `translate(${`${startXaxis},${startYaxis}`}) scale(${mapPieceScale})`
}

class NaturalGasLiquidMapLayout extends React.Component {
  static propTypes = {
    selection: PropTypes.instanceOf(Immutable.Map).isRequired,
    onMapPieceClick: PropTypes.func.isRequired,
    arrangeBy: PropTypes.string.isRequired,
    importExportVisualization: PropTypes.string.isRequired,
    layout: PropTypes.instanceOf(Immutable.List).isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired,
  }

  onClick = (country, originKey) => {
    return null
  }

  isMapPieceSelected(key, country) {
    const isSelected = this.props.selection.get('origins').indexOf(key)
    if (isSelected !== -1) { return true }
    return this.props.selection.getIn(['destinations', country], new Immutable.List()).includes(key)
  }
  isSelected() {
    const length = this.props.selection.get('origins').count() + this.props.selection.get('destinations').count()
    return (length > 0)
  }

  renderMapPiece() {
    const productSubType = this.props.sType === ''?'propaneButane':this.props.sType
    // Data from constant file
    const type = this.props.importExportVisualization

    // fetching nested values
    const mapLayoutGrid = MapLayoutGridConstant.getIn([type, this.props.country])

    const dimensions = mapLayoutGrid.get('dimensions')
    const styles = mapLayoutGrid.get('styles')
    const { layout } = this.props
    const mapPieceScale = mapLayoutGrid.get('mapPieceScale')
    const xaxis = this.props.left
    const yaxis = this.props.top
    const isSelected = this.isSelected()
    return layout.map((position) => {
      const humanName = this.props.Tr(['country', this.props.country, position.get('name')])
      if(typeof humanName === 'undefined'){
        return null
      }
      return (
        <g key={`mapPieceKey_${this.props.country}_${position.get('name')}`}>
          <g
            className="mappiece"
            {...handleInteraction(this.onClick, this.props.country, position.get('name'))}
            aria-label={this.props.Tr('mapTileLabel', humanName, position.getIn(['subType',productSubType,'imports'],0).toLocaleString(), position.getIn(['subType',productSubType,'exports'], 0).toLocaleString(), this.props.unit)}
            transform={`scale(${mapPieceScale})`}
          >
            <NaturalGasLiquidMapPiece
              data={position}
              dimensions={dimensions}
              legends={MapLayoutGridConstant.getIn([type, 'legends'])}
              bins={this.props.bins}
              styles={styles}
              productSubType={productSubType}
              isMapPieceSelected={this.isMapPieceSelected(position.get('name'), this.props.country)}
              isSelected={isSelected}
              x1={mapPieceTransformStartXaxis(position, dimensions, mapPieceScale)}
              y1={mapPieceTransformStartYaxis(position, dimensions, mapPieceScale)}
            />
          </g>
        </g>
      )
    })
  }

  renderDetailBreakdown(data) {
    const detailBreakdownData = Constants.getIn(['detailBreakDown', this.props.country])
    if (typeof detailBreakdownData !== 'undefined' && detailBreakdownData.get('required', false)) {
      return (<DetailBreakdown
        data={data}
        type={detailBreakdownData.get('type')}
        trContent={Tr.getIn(['detailBreakDown', this.props.importExportVisualization, detailBreakdownData.get('type')])}
        veritcalPosition={detailBreakdownData.get('displayPosition')}
        color={detailBreakdownData.get('color')}
        height={detailBreakdownData.get('height')}
        showDefault={detailBreakdownData.get('showDefault', false)}
      />)
    }
    return null
  }

  renderDetailSidebar() {
    return (<DetailSidebar top={this.props.top} height={Constants.getIn(['detailBreakDown', this.props.country, 'height'], 0)}>
      {this.renderDetailBreakdown(this.props.detailBreakDownData)}
    </DetailSidebar>)
  }

  render() {
    return (<g>
      {this.renderMapPiece()}
      {this.renderDetailSidebar()}
    </g>)
  }
}

const mapDispatchToProps = { onMapPieceClick: setSelection }

const mapStateToProps = (state, props) => ({
  importExportVisualization: state.importExportVisualization,
  layout: getElectricityMapLayout(state, props),
  selection: getSelectionSettings(state, props),
  sType: subType(state,props),
  arrangeBy: arrangeBy(state, props),
  bins: binSelector(state, props),
  Tr: TrSelector(state, props),
  unit: visualizationSettings(state, props).get('amount'),
})

export default connect(mapStateToProps, mapDispatchToProps)(NaturalGasLiquidMapLayout)
