import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import './DetailBreakDown.scss'
import Tr from '../TranslationTable'
import { humanNumber } from '../utilities'

const DetailBreakdownRow = props => (
  <tr className="detailBreakDownText">
    <td width="95%">
      {props.label}&nbsp;
      {humanNumber(props.value, props.language)}&nbsp;
      {Tr.getIn(['amounts', props.unit, props.language])}&nbsp;
      {((props.value / props.total) * 100).toFixed(2)}%&nbsp;
    </td>
    <td width="5%" className="progress-bar">
      <span
        style={{ ...props.progressBarStyle, width: `${(props.value / props.total) * 100}%` }}
      />
    </td>
  </tr>
)

DetailBreakdownRow.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  progressBarStyle: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  language: PropTypes.string.isRequired,
}

export default connect(({ language }) => ({ language }))(DetailBreakdownRow)