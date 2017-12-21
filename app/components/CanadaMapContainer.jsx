const React = require('react')
const ReactRedux = require('react-redux')

const MapLayout = require('./MapLayout.jsx')

class CanadaMapContainer extends React.Component {
  render(){
    //Scale is temporary adjustment as it's too small if we use dimensions mentioned in the desien document
    ////TODO: scale map dynamically when screen size change
    return <g transform='scale(1.4)'> <MapLayout
              xaxis={this.props.xaxis} 
              yaxis = {this.props.yaxis}
              country = 'ca'
              />
            </g>
  }
}

const mapStateToProps = state => {
  return {
    viewport: state.viewport

  }
}


module.exports = ReactRedux.connect(mapStateToProps)(CanadaMapContainer)