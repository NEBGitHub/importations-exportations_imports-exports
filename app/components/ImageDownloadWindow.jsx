import React from 'react'
import Tr from '../TranslationTable'

import { connect } from 'react-redux'
import Request from 'client-request/promise'
import PropTypes from 'prop-types'

import RouteComputations from '../computations/RouteComputations'

import Constants from '../Constants'

const ReactDOM = require('react-dom')

const CloseModal = require('../actions/modal.js').CloseModal

require('./ImageDownloadWindow.scss')

class ImageDownloadWindow extends React.Component {
  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.saveImageClick = this.saveImageClick.bind(this)
  }

  handleClose() {
    this.props.closeWindowClick()
  }

  makeBitlyPromise() {
    const bitlyEndpoint = RouteComputations.bitlyEndpoint(document.location, this.props.language)
    const shortenUrl = RouteComputations.bitlyParameter(document.location, this.props.language)

    const options = {
      uri: `${bitlyEndpoint}?shortenUrl=${shortenUrl}`,
      json: true,
    }

    return Request(options)
      .then((response) => {
        if (response.body.status_code !== 200) {
          // throw new Error(response.body.status_txt)
          return Constants.get('appHost')
        }
        return response.body.data.url
      })
      .catch(() => Constants.get('appHost'))
  }

  closeButton() {
    return <img
      className="closeButton"
      src="images/hide_(close).svg"
      onClick={this.handleClose}
    />
  }

  heading() {
    return <p
      className="imageDownloadHeading">
      { Tr.getIn(['imageDownload', this.props.language]).toUpperCase() }
      </p>
  }

  imagePreview() {
    const screenshotUrl = `${RouteComputations.screenshotOrigin(location)}/${Constants.get('screenshotPath')}/?pageUrl=${RouteComputations.screenshotParameter(document.location)}&width=${Constants.get('screenshotWidth')}&height=${Constants.get('screenshotHeight')}`
    return <div
      className="imagePreview">
      <img className="imagePreview"
        src={ screenshotUrl }
      />
      </div>
  }

  saveImageClick() {
    const screenshotUrl = `${RouteComputations.screenshotOrigin(location)}/${Constants.get('screenshotPath')}/?pageUrl=${RouteComputations.screenshotParameter(document.location)}&width=${Constants.get('screenshotWidth')}&height=${Constants.get('screenshotHeight')}`
    window.open(screenshotUrl)
  }

  saveImageButton() {
    return <p
      className="saveImage"
      onClick={this.saveImageClick}>
      { Tr.getIn(['saveImage', this.props.language]).toUpperCase() }
    </p>
  }

  bitlyText() {
    this.makeBitlyPromise().then((url) => {
      const vizUrl = `https://apps2.neb-one.gc.ca/${url}`
    })
    return <p
      className="bitlyText">
      { Tr.getIn(['bitlyShare', this.props.language])}
    </p>
  }

  render() {
    return <div
      className="imageDownloadWindow">
      {this.imagePreview()}
      {this.closeButton()}
      {this.heading()}
      {this.bitlyText()}
      {this.saveImageButton()}
    </div>
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  language: state.language,
})

const mapDispatchToProps = dispatch => ({
  closeWindowClick() {
    dispatch(CloseModal())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageDownloadWindow)
