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

import ElectricitySelector from '../selectors/ElectricitySelector'
import { arrangeBy, binSelector, sortAggregatedLocationsSelector } from '../selectors/data'
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

class ElectricityMapLayout extends React.Component {
  static propTypes = {
    selection: PropTypes.instanceOf(Immutable.Map).isRequired,
    dataPoints: PropTypes.instanceOf(Immutable.Map).isRequired,
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


    // find all highlighted pieces destination
    const destinations = {}
    origins.forEach((destination) => {
      const dataPoint = this.props.dataPoints.get(destination)
      if (typeof dataPoint !== 'undefined') {
        const destinationCountries = dataPoint.get('destinationCountry')
        destinationCountries.forEach((value, key) => {
          if (key !== '') {
            destinations[key] = destinations[key] || []
            destinations[key] = destinations[key].concat(value.toJS())
          }
        })
      }
    })
    this.props.onMapPieceClick({
      country,
      origins,
      destinations,
    })
  }

  getPowerPoolsOutline(key, country, xaxis, yaxis, position, dimensions, mapPieceScale) {
    if (this.isMapPieceSelected(key, country) && country === 'powerpool' && this.props.arrangeBy === 'location') {
      let result = ''
      switch (key) {
        case 'NE-ISO':
          result = (<polygon
            className="powerPoolOutline"
            points="121.5,148.5 143.7,139.3 166,148.5 166,175.3 187.7,186.8 210.5,175.3 232.6,186.5 255.7,175.3
                    278,186.8 278,213.2 255.7,223.8 255.7,250.8 278.1,263.5 278,288.6 255.7,300 233.3,288.6 233.3,263.3 210.5,250.8 187.7,263.3
                    187.7,288.6 166,300 143.8,288.7 121.5,300 99.6,288.6 99.6,263.3 77,251.1 77,224.7 55.2,213.1 55.2,186.8 76.9,175.3 99.6,186.8
                    121.5,175.3 "
          />)
          break
        case 'MN/ND':
          result = (<polygon
            className="powerPoolOutline"
            points="154.5,149.5 176.8,140.3 198.8,149.5 221,140.3 243.7,149.5 243.7,176.3 221,187.8 198.8,175.8
                    176.8,187.8 154.5,176.4 "
          />)
          break
        case 'PJMPP':
          result = (<polygon
            className="powerPoolOutline"
            points="144.3,128.1 167,118.9 189,128.2 211.2,118.9 233.2,128.2 233.2,155.1 255.6,167.5 255.6,194.3
                  233.2,205.8 233.2,232.1 211.5,242.8 211.5,269.8 189.1,282.5 166.7,269.8 166.7,242.8 189,232.2 189,205.8 166.7,194.3
                  166.7,167.5 144.3,155.1 "
          />)
          break
        default:
          result = ''
      }
      return (
        <g transform={powerPoolTransform(xaxis, yaxis, position, dimensions, mapPieceScale)} >
          {result}
        </g>
      )
    }
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
      return (
        <g key={`mapPieceKey_${this.props.country}_${position.get('name')}`}>
          <g
            className="mappiece"
            {...handleInteraction(this.onClick, this.props.country, position.get('name'))}
            aria-label={this.props.Tr('mapTileLabel', humanName, position.get('imports').toLocaleString(), position.get('exports').toLocaleString(), this.props.unit)}
            transform={`scale(${mapPieceScale})`}
          >
            <MapPiece
              data={position}
              dimensions={dimensions}
              legends={MapLayoutGridConstant.getIn([type, 'legends'])}
              bins={this.props.bins}
              styles={styles}
              isMapPieceSelected={this.isMapPieceSelected(position.get('name'), this.props.country)}
              isSelected={isSelected}
              x1={mapPieceTransformStartXaxis(position, dimensions, mapPieceScale)}
              y1={mapPieceTransformStartYaxis(position, dimensions, mapPieceScale)}
            />
          </g>
          {this.getPowerPoolsOutline(position.get('name'), this.props.country, xaxis, yaxis, position, dimensions, mapPieceScale)}
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
  layout: ElectricitySelector.getElectricityMapLayout(state, props),
  selection: ElectricitySelector.getSelectionSettings(state, props),
  dataPoints: sortAggregatedLocationsSelector(state, props),
  arrangeBy: arrangeBy(state, props),
  bins: binSelector(state, props),
  Tr: TrSelector(state, props),
  unit: visualizationSettings(state, props).get('amount'),
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(ElectricityMapLayout)
