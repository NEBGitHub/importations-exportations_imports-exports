const React = require('react')
const ReactRedux = require('react-redux')
const MapPiece = require('./MapPiece.jsx')
const MapLayoutGridConstant = require('../MapLayoutGridConstant.js')
const Immutable = require('immutable')

import { setSelection } from '../actions/visualizationSettings.js'

require('./ElectricityMapLayout.scss')

const ElectrictySelector = require('../selectors/ElectricitySelector.js')
const { sortAggregatedLocationsSelector } = require('../selectors/data.js')

class ElectricityMapLayout extends React.Component {
  mapPieceTransform (xaxis, yaxis, position, dimensions, mapPieceScale){
    let startXaxis = xaxis + (position.get('x') * (mapPieceScale * dimensions.get('width') + dimensions.get('xAxisPadding')))
    let startYaxis = yaxis + (position.get('y') * (mapPieceScale * dimensions.get('height') + dimensions.get('yAxisPadding')))
    return`translate(${startXaxis+','+startYaxis}) scale(${mapPieceScale})`
  }

  onClick(country, originKey){
    const selection = this.props.selection
    let origins = []
    if(selection.get('country') === country){
      const originKeyExists = selection.get('origins').indexOf(originKey)
      if(originKeyExists === -1){
        origins = selection.get('origins').push(originKey).toJS()
      }else{
        origins = selection.get('origins').delete(originKeyExists)
      }
    } else{
      origins = [originKey]
    }


    //find all highlighted pieces destination
    let destinations = {}
    origins.forEach(destination => {
      let dataPoint =  this.props.dataPoints.get(destination)
      if(typeof dataPoint !== 'undefined'){
        let destinationCountries = dataPoint.get('destinationCountry')
        destinationCountries.forEach((value, key) => {
          if(key !== ''){
            destinations[key] = destinations[key]||[]
            destinations[key] = destinations[key].concat( value.toJS() )  
          }
        })
      }  
    })
    this.props.onMapPieceClick({
      country: country,
      origins: origins,
      destinations : destinations,
    })
  }

  isMapPieceSelected(key, country){
    let isSelected = this.props.selection.get('origins').indexOf(key)
    let result = false 
    if(isSelected !== -1){
      return true
    } 
    return this.props.selection.getIn(['destinations', country], new Immutable.List()).includes(key)
  }

  isSelected(){
    let length = this.props.selection.get('origins').count() + this.props.selection.get('destinations').count()
    return (length > 0)
  }


  render(){
    //Data from constant file
    const type = this.props.importExportVisualization
    
    //fetching nested values
    const mapLayoutGrid = MapLayoutGridConstant.getIn([type, this.props.country])
    
    const dimensions = mapLayoutGrid.get('dimensions')
    const styles = mapLayoutGrid.get('styles')
    const layout = this.props.layout
    const mapPieceScale = mapLayoutGrid.get('mapPieceScale')
    const xaxis = this.props.left
    const yaxis = this.props.top
    const isSelected = this.isSelected()
    return layout.map( (position,key) =>{

      return <g  className='mappiece' key = { key } onClick={this.onClick.bind(this, this.props.country, position.get('name'))} transform={this.mapPieceTransform(xaxis, yaxis, position, dimensions, mapPieceScale)} >
                <MapPiece 
                data = { position } 
                dimensions = { dimensions }
                legends = {MapLayoutGridConstant.getIn([type,'legends'])}
                styles = { styles }
                isMapPieceSelected = {this.isMapPieceSelected(position.get('name'), this.props.country)}
                isSelected = {isSelected}
                />
            </g>
    })
  }
}

const mapDispatchToProps = { onMapPieceClick: setSelection }

const mapStateToProps = (state,props) => {
  return {
    importExportVisualization: state.importExportVisualization,
    layout: ElectrictySelector.getElectrictyMapLayout(state,props),
    selection: ElectrictySelector.getSelectionSettings(state,props),
    dataPoints: sortAggregatedLocationsSelector(state)
  }
}


module.exports = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
  )(ElectricityMapLayout)
