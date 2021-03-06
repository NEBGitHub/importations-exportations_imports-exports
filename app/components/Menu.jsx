import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TextBox from './TextBox'
import Constants from '../Constants'
import { handleInteractionWithTabIndex, analyticsReporter } from '../utilities'
import { setActiveMenu } from '../actions/activeMenu'
import TrSelector from '../selectors/translate'
import Tr from '../TranslationTable'

import ExplanationDot from './ExplanationDot'

import './Menu.scss'

class Menu extends React.PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.shape({
        render: PropTypes.node.isRequired,
        aria: PropTypes.string.isRequired,
      }),
      PropTypes.bool,
    ]),
    expanded: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    selected: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number,
    name: PropTypes.string.isRequired,
    setActiveMenu: PropTypes.func.isRequired,
    showExplanations: PropTypes.bool.isRequired,
    Tr: PropTypes.func.isRequired,
  }

  static defaultProps = {
    title: null,
    expanded: false,
    left: 0,
    selected: '',
  }

  onChange = (option) => {
    this.props.onChange(option)
    this.showAnalytics(`${this.props.name} ${option}`)
    this.props.setActiveMenu('')
  }

  toggleMenu = () => {
    this.props.setActiveMenu(this.props.expanded ? '' : this.props.name)
  }

  importExportExplanation() {
    let textString = `${this.props.Tr(['explanations', 'importExport'])}`
    const xPosition = (this.props.language === 'en') ? 173 : 220
    if (this.props.selectedEnergy === 'naturalGas') {
      textString = `${this.props.Tr(['explanations', 'importExportMenuNaturalGas'])}`
    }
    if (this.props.name !== 'activity'
      || this.props.selectedEnergy === 'crudeOil'
      || this.props.selectedEnergy === 'refinedPetroleumProducts') { return }
    return (<g>
      <ExplanationDot
        scale="scale(0.3)"
        lineStroke="1.8"
        textBoxWidth={130}
        linePath="
          M142.16,
          173.94l24.26,
          36.69a40.12,
          40.12,0,0,0,
          33.47,
          18H515.2"
        xPosition={xPosition}
        yPosition={61}
        lineX={142.16}
        lineY={173.94}
        textX={10}
        textY={20}
        containerX={this.props.left + 2}
        containerY={this.props.top - 50}
        text={textString}
        name={`${this.props.selectedEnergy} importExportExplanation`}
      />
            </g>)
  }

  amountExplanation() {
    let textString = `${this.props.Tr(['explanations', 'amount'])}`
    if (this.props.selectedEnergy === 'crudeOilExports' || this.props.selectedEnergy === 'crudeOilImports') {
      textString = `${this.props.Tr(['explanations', 'amountCrude'])}`
    }
    if (this.props.selectedEnergy === 'naturalGas') {
      textString = `${this.props.Tr(['explanations', 'amountNaturalGas'])}`
    }
    if (this.props.selectedEnergy === 'naturalGasLiquids') {
      textString = `${this.props.Tr(['explanations', 'amountNaturalGasLiquids'])}`
    }
    if (this.props.selectedEnergy === 'refinedPetroleumProducts') {
      textString = `${this.props.Tr(['explanations', 'amountRefinedPetroleumProducts'])}`
    }
    let yPosition = 240
    if (this.props.expanded && (this.props.setActiveMenu !== 'amount')) {
      yPosition = 228
    }
    if (this.props.name !== 'amount') { return }
    return (<g>
      <ExplanationDot
        scale="scale(1 -1) translate(0 -100)"
        lineStroke="1"
        textBoxWidth={190}
        linePath="
          M142.16,
          173.94l24.26,
          36.69a40.12,
          40.12,0,0,0,
          33.47,
          18H378.2"
        xPosition={182}
        yPosition={yPosition}
        lineX={142.16}
        lineY={173.94}
        textX={45}
        textY={48}
        containerX={2}
        containerY={-102}
        text={textString}
        name={`${this.props.selectedEnergy} amountExplanation`}
      />
            </g>)
  }

  arrangedByExplanation() {
    const xPosition = (this.props.language === 'en') ? 140 : 177
    if (this.props.name !== 'arrangedBy' && this.props.selectedEnergy !== 'refinedPetroleumProducts') { return }
    return (<g>
      <ExplanationDot
        scale="scale(1 -1) translate(0 -100)"
        lineStroke="1"
        textBoxWidth={190}
        linePath="
          M142.16,
          173.94l24.26,
          36.69a40.12,
          40.12,0,0,0,
          33.47,
          18H378.2"
        xPosition={xPosition}
        yPosition={220}
        lineX={142.16}
        lineY={173.94}
        textX={45}
        textY={48}
        containerX={2}
        containerY={-104}
        text={`${this.props.Tr(['explanations', 'arrangeByRefinedPetroleumProducts'])}`}
        name="arrangedByRefinedPetroleumProductsExplanation"
      />
            </g>)
  }

  renderTitle() {
    if (this.props.title === false) { return null }
    let suffix = 'of'
    if (this.props.language !== 'en' || this.props.name !== 'activity') { suffix = '' }
    const { Tr } = this.props
    const tabIndex = this.getTabIndex()
    const prefix = Tr(['menu', this.props.name, 'prefix'])
    const title = {
      render: (this.props.title && this.props.title.render) || (
        <tspan>
          {prefix ? `${prefix} ` : ''}
          <tspan className="bold">{Tr(['menu', this.props.name, 'options', this.props.selected])}</tspan>
        </tspan>
      ),
      aria: (this.props.title && this.props.title.aria) || [
        prefix || '',
        Tr(['menu', this.props.name, 'options', this.props.selected]),
      ].join(' '),
    }
    const expandIcon = (this.props.options.length > 1)
      ? <tspan className="bold" aria-hidden> {this.props.expanded ? '-' : '+'}</tspan>
      : null
    return (
      <g
        role="menu"
        aria-expanded={this.props.expanded}
        aria-label={title.aria}
        {...handleInteractionWithTabIndex(tabIndex, this.toggleMenu)}
        transform={`translate(${Constants.getIn(['menuBar', 'textLabelOffset'])} ${Constants.getIn(['menuBar', 'barHeight']) / 2})`}
      >
        <TextBox
          boxStyles={{ fill: 'none' }}
        >
          {title.render} {suffix}
          {expandIcon}
        </TextBox>
      </g>
    )
  }
  getTabIndex() {
    return Constants.getIn(['tabIndex', 'start', 'menuBar'])
  }
  renderOptions() {
    if (!this.props.expanded) { return null }
    const { Tr } = this.props
    const tabIndex = this.getTabIndex()
    const styleClass = this.props.name !== 'amount' ? 'menuOption' : ''
    const options = this.props.options
      .filter(v => (v !== this.props.selected))
      .map(option => (
        <tspan
          x={0}
          dy={Constants.getIn(['menuBar', 'optionHeight'])}
          className={styleClass}
          key={option}
          {...handleInteractionWithTabIndex(tabIndex, this.onChange, option)}
          role="menuitem"
        >
          <tspan className="optionText">{Tr(['menu', this.props.name, 'options', option])}</tspan>
        </tspan>
      ))

    const textOffset = Constants.getIn(['menuBar', 'textLabelOffset'])
      + Constants.getIn(['menuBar', 'expandedMenuTextMargin'])

    return (
      <g transform={`translate(${textOffset} 8)`}>
        <text>
          {options}
        </text>
      </g>
    )
  }

showAnalytics(label) {
    const eventDetail = label
    analyticsReporter(
      Constants.getIn(['analytics', 'category', 'menuBar']),
      Constants.getIn(['analytics', 'action', 'clicked']),
      eventDetail,
  )
}

  render() {
    return (<g>
      <g transform={`translate(${this.props.left - 10} ${this.props.top})`} className="menuGroup">
        {this.renderTitle()}
        {this.renderOptions()}
      </g>
      {this.amountExplanation()}
      {this.importExportExplanation()}
      {this.arrangedByExplanation()}
    </g>
    )
  }
}

export default connect(
  (state, props) => ({
    expanded: (state.activeMenu === props.name),
    Tr: TrSelector(state, props),
    language: state.language,
    showExplanations: state.showExplanations,
    selectedEnergy: state.importExportVisualization,
    expandCollapseExplanation: state.expandCollapseExplanation,
  }),
  { setActiveMenu },
)(Menu)
