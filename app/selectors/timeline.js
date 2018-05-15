import { fromJS } from 'immutable'

import { createSelector } from './selectHelper'
import { getVisualizationData, getActivityFilterPredicate, filterByTimelineAndMap, filterByMap } from './core'
import { barChartValues } from './renderData'

import {
  getAggregateKey,
  unitSelector,
  getValueKey,
  filterByHexSelector,
  selectedActivityGroup,
  timelineRange,
  timelinePlayback,
  timeLineScaleSelector,
  groupingBy as timelineGrouping,
} from './data'
import { visualizationContentPosition as visContentSize } from './viewport/'
import { visualizationSettings, selectedVisualization, scaledLinkedSelector } from './visualizationSettings'
import Constants from '../Constants'

export const getScaleKey = (state, props) => props.scaleKey || getValueKey(state, props)

export const mapToValue = (data, key) => data.map(v => v.get(key))

export const aggregateQuarter = createSelector(
  filterByMap,
  getAggregateKey,
  selectedVisualization,
  (points, aggregateKey, vizName) => {
    const valueKeys = []
    const result = aggregateQuarterPoints(points, valueKeys, aggregateKey, vizName)
    return { points: fromJS(result), valueKeys }
  },
)

export const sortTimeline = createSelector(
  barChartValues,
  timelineGrouping,
  (points , grouping) => points,
)

export const timelineScaleBase = createSelector(
  filterByTimelineAndMap,
  getAggregateKey,
  selectedVisualization,
  (points, aggregateKey, vizName) => fromJS(points.reduce((acc, next) => {
    if (vizName === 'crudeOil' && aggregateKey === 'activity' && next.get('destination') === 'ca') {
      return acc
    }

    const period = next.get('period')
    if (!acc.period.min || period < acc.period.min) { acc.period.min = period }
    if (!acc.period.max || period > acc.period.max) { acc.period.max = period }

    const key = next.get(aggregateKey)
    if (!key) { return acc }

    if (!acc.values[period]) { acc.values[period] = {} }
    acc.values[period][key] = (acc.values[period][key] || 0) + next.get('value', 0)

    return acc
  }, { period: {}, values: {} })),
)

export const timelineYearScaleCalculation = createSelector(
  timelineScaleBase,
  scaleBase => ({
    min: parseInt(scaleBase.getIn(['period', 'min'], '2000Q1').substr(0, 4), 10),
    max: parseInt(scaleBase.getIn(['period', 'max'], '2000Q4').substr(0, 4), 10),
  }),
)

export const timeLineScaleValue = createSelector(
  timeLineScaleSelector,
  timelineYearScaleCalculation,
  scaledLinkedSelector,
  (yaxis, xaxis, toggle) => {
    if (toggle.scaleLinked) {
      const result = yaxis.getIn(['exports', 'activityTotal']) > yaxis.getIn(['imports', 'activityTotal']) ?
        yaxis.getIn(['exports', 'activityTotal']) : yaxis.getIn(['imports', 'activityTotal'])
      return fromJS({
        exports: {
          y: {
            min: 0,
            max: result,
          },
          x: {
            min: xaxis.min,
            max: xaxis.max,
          },
        },
        imports: {
          y: {
            min: 0,
            max: result,
          },
          x: {
            min: xaxis.min,
            max: xaxis.max,
          },
        },
      })
    }
    return fromJS({
      exports: {
        x: {
          min: yaxis.getIn(['exports', 'activityTotal']),
          max: yaxis.getIn(['exports', 'activityTotal']),
        },
        y: {
          min: xaxis.min,
          max: xaxis.max,
        },
      },
      imports: {
        x: {
          min: yaxis.getIn(['imports', 'activityTotal']),
          max: yaxis.getIn(['imports', 'activityTotal']),
        },
        y: {
          min: xaxis.min,
          max: xaxis.max,
        },
      },
    })
  },
)

export const timelinePositionCalculation = createSelector(
  sortTimeline,
  timelineGrouping,
  visContentSize,
  timelineYearScaleCalculation,
  (points, grouping, size, yaxisScale) => {
    const scale = yaxisScale
    const groupPadding = Constants.getIn(['timeline', 'groupPadding'])
    const barPadding = Constants.getIn(['timeline', 'barPadding'])
    const totalYears = (scale.max - scale.min)
    let offset = 0
    let lastPoint
    let barWidth
    const labels = []
    let bars = points.get('values')
    if (grouping === 'year') {
      const widthAfterPads = size.width
        - ((totalYears * 4) * barPadding)
      barWidth = widthAfterPads / ((totalYears + 1) * 4)

      for (let y = scale.min; y <= scale.max; y += 1) {
        labels.push({
          offsetX: (offset + ((barWidth + barPadding) * 2)) - (barWidth / 2),
          label: y.toString().substr(-2),
        })
        for (let q = 1; q <= 4; q += 1) {
          if (bars.has(`${y}Q${q}`)) {
            bars = bars.setIn([`${y}Q${q}`, 'offsetX'], offset)
          }
          offset += barPadding + barWidth
        }
        offset += groupPadding
      }
    } else {
      const widthAfterPads = size.width
        - (groupPadding * 3)
        - ((totalYears * 4) * barPadding)
      barWidth = widthAfterPads / ((totalYears + 1) * 4)

      const labelYears = [
        scale.min + 2,
        scale.min + Math.floor(totalYears / 3),
        scale.max - Math.ceil(totalYears / 3),
        scale.max - 2,
      ]
      let quarterStart = 0

      for (let q = 1; q <= 4; q += 1) {
        for (let y = scale.min; y <= scale.max; y += 1) {
          if (labelYears.includes(y)) {
            labels.push({
              offsetX: offset,
              label: y.toString().substr(-2),
              key: `${y}Q${q}`,
            })
          }

          if (bars.has(`${y}Q${q}`)) {
            bars = bars.setIn([`${y}Q${q}`, 'offsetX'], offset)
          }
          offset += barPadding + barWidth
        }

        const dividerOffset = (offset - (barWidth / 2)) + (groupPadding / 2)
        if (q !== 4) {
          labels.push({
            offsetX: dividerOffset,
            label: '|',
            key: `divider-${q}`,
          })
        }
        labels.push({
          offsetX: ((dividerOffset - quarterStart) / 2) + quarterStart,
          label: `Q${q}`,
          fontWeight: 'bold',
        })
        quarterStart = dividerOffset

        offset += groupPadding
      }
    }

    return {
      bars: fromJS(bars),
      points,
      labels: fromJS(labels),
      layout: fromJS({
        width: size.width,
        groupPadding,
        barPadding,
        barWidth,
      }),
    }
  },
)

export const timelineData = createSelector(
  timelineRange,
  timelinePlayback,
  timelineYearScaleCalculation,
  timelinePositionCalculation,
  (range, playback, scale, position) => ({ timelineRange: range, timelinePlayback: playback, ...scale, ...position }),
)

export const timelineSeekPositionSelector = createSelector(
  timelineData,
  visContentSize,
  ({ bars, timelineRange: range }, size) => {
    const start = bars.find(point => (
      point.get('year') >= range.getIn(['start', 'year']) &&
      point.get('quarter') >= range.getIn(['start', 'quarter'])
    ))
    const end = bars.findLast(point => (
      point.get('year') <= range.getIn(['end', 'year']) &&
      point.get('quarter') <= range.getIn(['end', 'quarter'])
    ))
    return {
      start: (typeof start !== 'undefined' ? start.get('offsetX') : 0),
      end: (typeof end !== 'undefined' ? end.get('offsetX') : size.width),
    }
  },
)