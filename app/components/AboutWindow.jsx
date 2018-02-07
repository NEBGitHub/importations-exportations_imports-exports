import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Tr from '../TranslationTable'
import { handleInteraction } from '../utilities'
import './AboutWindow.scss'

class AboutWindow extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  }

  closeButton() {
    return (<img
      className="closeButton"
      src="images/about_close.svg"
      alt={Tr.getIn(['aboutWindow', 'closeWindow', this.props.language])}
      {...handleInteraction(this.props.closeModal)}
    />)
  }

  heading() {
    return (
      <p className="aboutHeading">
        {Tr.getIn(['aboutWindow', 'heading', this.props.language])}
      </p>
    )
  }

  intro() {
    return (
      <div className="aboutBodyText">
        <p className="intro">
          <span>
            {Tr.getIn(['aboutWindow', 'p1', this.props.language])}
          </span>
        </p>
        <p>
          <span>
            {Tr.getIn(['aboutWindow', 'p2', this.props.language])}
          </span>
        </p>
        <p>
          <span>
            {Tr.getIn(['aboutWindow', 'p3', this.props.language])}
          </span>
        </p>
        <p>
          <span>
            {Tr.getIn(['aboutWindow', 'p4', this.props.language])}
          </span>
        </p>
      </div>
    )
  }

  contributors() {
    return (
      <div className="contributorsSection">
        <p className="aboutHeading">
          <span>
            { Tr.getIn(['aboutWindow', 'contributors', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'dataSource', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'dataNamesfromNEB', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'coordination', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'nebCoordinators', this.props.language])}
          </span>
        </p>
      </div>
    )
  }

  dataVisualization() {
    return (
      <div className="dataVisSection">
        <p className="aboutHeading">
          <span>
            { Tr.getIn(['aboutWindow', 'dataVisualization', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'leadDesignResearch', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'leadDesigners', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'coordination', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'coordi', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'design', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'designers', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'leadTechnical', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'vizworx', this.props.language])}
          </span>
        </p>
        <p className="aboutSubheading">
          <span>
            { Tr.getIn(['aboutWindow', 'technical', this.props.language])}
          </span>
        </p>
        <p className="aboutBodyText">
          <span>
            { Tr.getIn(['aboutWindow', 'technicalTeam', this.props.language])}
          </span>
        </p>
      </div>
    )
  }

  render() {
    return (
      <div id="aboutWindow" className="aboutWindow">
        { this.closeButton() }
        { this.heading() }
        { this.intro() }
        { this.contributors() }
        { this.dataVisualization() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  language: state.language,
  viewport: state.viewport,
  showAboutWindow: state.showAboutWindow,
})

export default connect(mapStateToProps)(AboutWindow)
