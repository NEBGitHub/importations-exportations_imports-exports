const fromJS = require('immutable').fromJS

const Types = {
  BARGRAPH_SCALE_LINKED: 'bargraph.scaleLinked',
  TIMELINE_FILTER: 'timeline.filter',
}

const bargraphScaleLinked = linked => ({
  type: Types.BARGRAPH_SCALE_LINKED,
  payload: { linked },
})

const timelineFilter = (side, point) => ({
  type: Types.TIMELINE_FILTER,
  payload: { side, point },
})

const initialState = fromJS({
  barGraphScaleLinked: true,
  timelineRange: { start: 0, end: 100 },
  timelineGroup: 'year',
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.BARGRAPH_SCALE_LINKED:
      return state.set('barGraphScaleLinked', action.payload.linked)
    case Types.TIMELINE_FILTER:
      return state.setIn(['timelineRange', action.payload.side], action.payload.point)
    default: return state
  }
}

module.exports = {
  Types,
  bargraphScaleLinked,
  timelineFilter,
  reducer,
}
