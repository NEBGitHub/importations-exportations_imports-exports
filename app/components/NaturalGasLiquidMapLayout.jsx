import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import PropTypes from 'prop-types'

import MapPiece from './MapPiece'
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
import { handleInteractionWithTabIndex } from '../utilities'

import './NaturalGasLiquidMapLayout.scss'

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
    const { selection } = this.props
    let origins = []
    if (selection.get('country') === country) {
      const originKeyExists = selection.get('origins').indexOf(originKey)
      if (originKeyExists === -1) {
        origins = selection.get('origins').push(originKey).toJS()
      } else {
        origins = selection.get('origins').delete(originKeyExists)
      }
    } else {
      origins = [originKey]
    }
    this.props.onMapPieceClick({
      country,
      origins,
    })
  }

  isMapPieceSelected(key, country) {
    if(this.props.country !== this.props.selection.get('country')){return false}
    return this.props.selection.get('origins').includes(key)
  }
  isSelected() {
    if(this.props.country !== this.props.selection.get('country')){return false}
    const count = this.props.selection.get('origins').count()
    return (count > 0)
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
    const tabIndex = Constants.getIn(['tabIndex', 'start', 'visualization', 'caMap'])
    return layout.map((position) => {
      const humanName = this.props.Tr(['country', this.props.country, position.get('name')])
      if(typeof humanName === 'undefined'){
        return null
      }
      return (
        <g key={`mapPieceKey_${this.props.country}_${position.get('name')}`}>
          <g
            className="mappiece"
            {...handleInteractionWithTabIndex(tabIndex, this.onClick, this.props.country, position.get('name'))}
            aria-label={this.props.Tr('mapTileLabel', humanName, position.getIn(['subType',productSubType,'imports'],0).toLocaleString(), position.getIn(['subType',productSubType,'exports'], 0).toLocaleString(), this.props.unit)}
            transform={`scale(${mapPieceScale})`}
          >
            <MapPiece
              data={position}
              dataKey={['subType',productSubType]}
              dimensions={dimensions}
              legends={MapLayoutGridConstant.getIn([type, 'legends'])}
              bins={this.props.bins}
              styles={styles}
              isMapPieceSelected={this.isMapPieceSelected(position.get('name'), this.props.country)}
              isSelected={isSelected}
              mapPieceKey='name'
              mapPieceStyleClass = 'mapPieceText'
              isOrigin={(this.props.selection.get('country') === this.props.country)}
              x1={mapPieceTransformStartXaxis(position, dimensions, mapPieceScale)}
              y1={mapPieceTransformStartYaxis(position, dimensions, mapPieceScale)}
              containerX={this.props.left}
              containerY={this.props.top}
            />
          </g>
        </g>
      )
    })
  }
  renderATLQOutline(){
    if(this.props.arrangeBy !== 'location'){ return null}
    return <polygon
     transform="scale(0.88 0.94) translate(296 31)"
     className="ATLQOutline"
     points="56.49 0.56 84.57 15.56 114.25 0.56 142.43 15.56 142.43 42.81 169.22 56.74 169.22 85.56 142.43 99.06 114.25 85.56 84.57 99.06 56.49 85.56 25.89 99.06 0.5 85.56 0.5 56.74 26.89 42.81 26.89 15.56 56.49 0.56"/>
  }
  renderDetailBreakdown(data) {
    const detailBreakdownData = Constants.getIn(['detailBreakDown', this.props.country])
    
    if (!detailBreakdownData.get('required', false)) { return null }
   
    const subTypeTotal = this.props.layout.reduce((acc, nextValue) => {
      if(this.props.selection.get('origins').count() > 0 && !this.props.selection.get('origins').includes(nextValue.get('name'))) { return acc}
      const subType = nextValue.get('subType')
      subType.forEach((subTypeVal, subTypeKey) => {
        if(subTypeKey !== 'propaneButane'){
          if(!acc[subTypeKey]){
            acc[subTypeKey] = subTypeVal.get(detailBreakdownData.get('type'))
          } else {
            acc[subTypeKey] += subTypeVal.get(detailBreakdownData.get('type'))
          }
        }
      })
      return acc
    }, {})
    const nameMappings = Tr.getIn(['subType'])
    return (<DetailBreakdown
      data={Immutable.fromJS(subTypeTotal).sort((a, b) => (b - a))}
      type={detailBreakdownData.get('type')}
      trContent={Tr.getIn(['detailBreakDown', this.props.importExportVisualization, detailBreakdownData.get('type')])}
      veritcalPosition={detailBreakdownData.get('displayPosition')}
      color={detailBreakdownData.get('color')}
      height={detailBreakdownData.get('height')}
      showDefault={detailBreakdownData.get('showDefault', false)}
      nameMappings={nameMappings}
      defaultContent=''
    />)
    
  }

  renderDetailSidebar() {
    return (<DetailSidebar top={this.props.top} height={Constants.getIn(['detailBreakDown', this.props.country, 'height'], 0)}>
      {this.renderDetailBreakdown(this.props.detailBreakDownData)}
    </DetailSidebar>)
  }

  render() {
    return (<g>
      <g transform={`scale(${this.props.viewport.get('changeWidthRatio')} ${this.props.viewport.get('changeHeightRatio')})`}>
        {this.renderMapPiece()}
        {this.renderATLQOutline()}
      </g>
      {this.renderDetailSidebar()}
    </g>)
  }
}

const mapDispatchToProps = { onMapPieceClick: setSelection }

const mapStateToProps = (state, props) => ({
  viewport: state.viewport,
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
