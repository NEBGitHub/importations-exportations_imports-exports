const React = require('react')
const ReactRedux = require('react-redux')
const PropTypes = require('prop-types')

const Constants = require('../Constants.js')
const Tr = require('../TranslationTable.js')
const WorkspaceComputations = require('../computations/WorkspaceComputations.js')

const MenuBarOption = require('./MenuBarOption.jsx')

const { setArrangeBy } = require('../actions/visualizationSettings')
const { visualizationSettings } = require('../selectors/visualizationSettings')

require('./ElectricitySortMenu.scss')

const ElectricitySortMenu = (props) => {
  const titleYaxis = WorkspaceComputations.electricitySortMenuY() - 30
  return (
    <g>
      <text
        x={Constants.getIn(['electricitySortStatesStyle', 'title', 'import', 'xPadding'])}
        y={titleYaxis}
        fill={Constants.getIn(['electricitySortStatesStyle', 'title', 'import', 'color'])}
        className="ElectricitySortMenuTitle"
      >
        {Tr.getIn(['electricitySortStates', 'title', 'import', props.language])}
      </text>
      <text
        x={Constants.getIn(['electricitySortStatesStyle', 'title', 'ampersand', 'xPadding'])}
        y={titleYaxis}
        className="ElectricitySortMenuTitle"
      >
        {Tr.getIn(['electricitySortStates', 'title', 'ampersand', props.language])}
      </text>
      <text
        x={Constants.getIn(['electricitySortStatesStyle', 'title', 'export', 'xPadding'])}
        y={titleYaxis}
        fill={Constants.getIn(['electricitySortStatesStyle', 'title', 'export', 'color'])}
        className="ElectricitySortMenuTitle"
      >
        {Tr.getIn(['electricitySortStates', 'title', 'export', props.language])}
      </text>
      <MenuBarOption
        key="electricitySortStateMenu"
        yaxis={WorkspaceComputations.electricitySortMenuY()}
        options={Constants.get('electricitySortStates')}
        onOptionClick={props.setArrangeBy}
        selectedOption={props.arrangeBy}
        optionXaxisPadding={Constants.getIn(['menuBarOptions', 'optionXaxisPadding'])}
        optionPadding={Constants.getIn(['menuBarOptions', 'optionPadding'])}
        trKey="electricitySortStates"
        color={Constants.getIn(['electricitySortStatesStyle', 'color'])}
        lineWidth={Constants.getIn(['electricitySortStatesStyle', 'lineWidth'])}
        language={props.language}
      />
    </g>
  )
}

ElectricitySortMenu.propTypes = {
  language: PropTypes.string.isRequired,
  setArrangeBy: PropTypes.func.isRequired,
  arrangeBy: PropTypes.string.isRequired,
}

const mapStateToProps = (state, props) => ({
  viewport: state.viewport,
  language: state.language,
  arrangeBy: visualizationSettings(state, props).get('arrangeBy'),
})

const mapDispatchToProps = { setArrangeBy }

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ElectricitySortMenu)
