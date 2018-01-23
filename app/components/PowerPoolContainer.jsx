const React = require('react')
const ReactRedux = require('react-redux')
const PropTypes = require('prop-types')

const ElectricityMapLayout = require('./ElectricityMapLayout.jsx')

class PowerPoolContainer extends React.Component {
  render() {
    // Scale is temporary adjustment as it's too small if we use dimensions mentioned in the design document
    // TODO: scale map dynamically when screen size change
    return (<g transform="scale(1.2) translate(0 -70)">
      <ElectricityMapLayout
        left={this.props.left}
        top={this.props.top}
        country="powerpool"
      />
            </g>)
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
})

module.exports = ReactRedux.connect(mapStateToProps)(PowerPoolContainer)
