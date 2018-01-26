import { createSelector } from 'reselect'

import { activityOptions, arrangeByOptions, amountOptions } from '../menus'
import Constants from '../../Constants'

const menuHeightCalc = name => (prev, active, options) => ({
  ...prev,
  top: prev.top + prev.height,
  height: (
    Constants.getIn(['menuBar', 'barHeight']) +
    Constants.getIn(['menuBar', 'verticalPadding']) +
    ((active === name) ? ((options.length - 1) * Constants.getIn(['menuBar', 'optionHeight'])) : 0)
  ),
})

const activeMenu = state => state.activeMenu

const basePosition = () => ({
  top: 54,
  left: 0,
  width: Constants.getIn(['menuBar', 'width']),
  height: 0,
})

export const activityPosition = createSelector(
  basePosition,
  activeMenu,
  activityOptions,
  menuHeightCalc('activity'),
)

export const visSelectorPosition = createSelector(
  activityPosition,
  prev => ({
    ...prev,
    top: prev.top + prev.height,
    height: (
      (Constants.getIn(['menuBar', 'visualizationPadding']) * 5)
    ),
  }),
)

export const arrangeByPosition = createSelector(
  visSelectorPosition,
  activeMenu,
  arrangeByOptions,
  menuHeightCalc('arrangeBy'),
)

export const amountPosition = createSelector(
  arrangeByPosition,
  activeMenu,
  amountOptions,
  menuHeightCalc('amount'),
)
