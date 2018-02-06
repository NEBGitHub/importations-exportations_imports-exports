import { createSelector } from 'reselect'
import Immutable from 'immutable'

import { aggregateLocationPaddSelector, arrangeBy } from './data'
import MapLayoutGridConstant from '../MapLayoutGridConstant'
import Constants from '../Constants'
import { visualizationSettings } from './visualizationSettings'

// get import data for the electricity visualization
// rows from the CSV
const selectedVisualization = state => state.importExportVisualization

export const getSelectionSettings = createSelector(
  visualizationSettings,
  settings => settings.get('selection'),
)

const getCountry = (state, props) => props.country

const getElectricityMapLayoutConstants = createSelector(
  selectedVisualization,
  getCountry,
  (visualization, country) => MapLayoutGridConstant.getIn([visualization, country, 'layout']),
)

const getColumns = createSelector(
  selectedVisualization,
  getCountry,
  (visualization, country) => MapLayoutGridConstant.getIn([visualization, country, 'defaultColumns']),
)

const getPadding = createSelector(
  selectedVisualization,
  getCountry,
  (visualization, country) => MapLayoutGridConstant.getIn([visualization, country, 'sortingRowPadding']),
)

export const getPointsByCountry = createSelector(
  aggregateLocationPaddSelector,
  getCountry,
  (points, country) => points.filter(point => point.get('country') === country),
)

const getElectricityImportAndExport = createSelector(
  getPointsByCountry,
  getCountry,
  (points, country) => {
    // append missing states or provinces
    // fetch list of the states and province from the 
    const statesOrProvinces = Constants.getIn(['dataloader', 'mapping', 'country', country])
    if (typeof statesOrProvinces !== 'undefined') {
      let missingstatesOrProvincesMap = {}
      statesOrProvinces.entrySeq().forEach((stateOrProvince) => {
        if (typeof points.get(stateOrProvince[1]) === 'undefined') {
          const originKey = stateOrProvince[1]
          missingstatesOrProvincesMap[originKey] = {
            country,
            destination: originKey,
            subType: {
               Butane: { imports: 0, exports: 0 }, Propane: { imports: 0, exports: 0 }, propaneButane: { imports: 0, exports: 0 },
            },
            totalCount: 0,
            confidentialCount: 0,
          }
        }
      })
      missingstatesOrProvincesMap = Immutable.fromJS(missingstatesOrProvincesMap)
      return points.merge(missingstatesOrProvincesMap)
    }
    return points
  },
)

const createSortedLayout = createSelector(
  getElectricityImportAndExport,
  getColumns,
  getPadding,
  (data, columns, rowPadding) => {
    let row = 0
    let column = 0
    const sortedArray = []
    data.forEach((statesOrProvinces) => {
      if (column >= columns) {
        column = 0
        row += 1
        if (row % 2 === 1) {
          columns -= 1
        }
      }
      let x = row + column
      if (row !== 0) {
        x += (row * rowPadding)
      }
      sortedArray.push({
        name: statesOrProvinces.get('destination'),
        subType: statesOrProvinces.get('subType') || { Butane: { imports: 0, exports: 0 }, Propane: { imports: 0, exports: 0 }, propaneButane: { imports: 0, exports: 0 } },
        totalCount: statesOrProvinces.get('totalCount') || 0,
        confidentialCount: statesOrProvinces.get('confidentialCount') || 0,
        x,
        y: row,
      })

      // Column value is updated for the next iteration
      column += 1
    })
    return Immutable.fromJS(sortedArray)
  },
)

const parseLocationData = createSelector(
  getElectricityImportAndExport,
  getElectricityMapLayoutConstants,
  (data, layout) => {
    const resultList = []
    if (data.size > 0 && typeof layout !== 'undefined') {
      layout.forEach((statesOrProvinces) => {
        console.log(statesOrProvinces.get('originKey'))
        const originKey = statesOrProvinces.get('originKey')
        const result = {
          name: originKey,
          subType: data.getIn([originKey, 'subType']) || { Butane: { imports: 0, exports: 0 }, Propane: { imports: 0, exports: 0 }, propaneButane: { imports: 0, exports: 0 } },
          x: statesOrProvinces.get('x'),
          y: statesOrProvinces.get('y'),
          totalCount: data.getIn([originKey,'totalCount']) || 0,
          confidentialCount: data.getIn([originKey, 'confidentialCount']) || 0,
        }
        resultList.push(result)
      })
    }
    return Immutable.fromJS(resultList)
  },
)


export const getElectricityMapLayout = createSelector(
  createSortedLayout,
  parseLocationData,
  arrangeBy,
  (sortedPoints, locationPoints, sortBy) => {
    switch (sortBy) {
      case 'exports':
      case 'imports':
        return sortedPoints
      case 'location':
      default:
        return locationPoints
    }
  },
)
