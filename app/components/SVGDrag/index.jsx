import React from 'react'
import PropTypes from 'prop-types'

import './SVGDrag.scss'

const stopEvent = (e) => {
  e.stopPropagation()
  e.preventDefault()
}

const getPosition = (e) => {
  const baseEventPosition = e.touches ? e.touches[0] : e
  return {
    x: baseEventPosition.clientX,
    y: baseEventPosition.clientY,
  }
}

class SVGDrag extends React.PureComponent {
  static get propTypes() {
    return {
      invertedX: PropTypes.bool,
      invertedY: PropTypes.bool,
      dragStop: PropTypes.func,
      adjustOffset: PropTypes.func,
      children: PropTypes.node.isRequired,
    }
  }

  static get defaultProps() {
    return {
      invertedX: false,
      invertedY: false,
      dragStop: null,
      adjustOffset: null,
    }
  }

  constructor(props) {
    super(props)

    // Don't use state, as we're not actually rendering based on it
    this.isDragging = false

    this.state = {
      dragStart: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
    }

    this.onDragStart = this.onDragStart.bind(this)
    this.onDragMove = this.onDragMove.bind(this)
    this.onDragStop = this.onDragStop.bind(this)
  }

  onDragStart(e) {
    stopEvent(e)
    this.isDragging = true
    this.setState({
      dragStart: getPosition(e),
      offset: { x: 0, y: 0 },
    })

    // Bind events to the window to assist in dragging when the mouse
    // moves off of the drag handle
    window.addEventListener('mousemove', this.onDragMove)
    window.addEventListener('mouseup', this.onDragStop)
    window.addEventListener('touchmove', this.onDragMove)
    window.addEventListener('touchend', this.onDragStop)
  }

  onDragMove(e) {
    // Don't handle the mouse moving if we're not dragging
    if (this.isDragging === false) { return }
    stopEvent(e)

    const position = getPosition(e)
    this.setState({
      offset: this.adjustOffset({
        x: position.x - this.state.dragStart.x,
        y: position.y - this.state.dragStart.y,
      }),
    })
  }

  onDragStop(e) {
    stopEvent(e)
    this.isDragging = false

    window.removeEventListener('mousemove', this.onDragMove)
    window.removeEventListener('mouseup', this.onDragStop)
    window.removeEventListener('touchmove', this.onDragMove)
    window.removeEventListener('touchend', this.onDragStop)

    if (typeof this.props.dragStop === 'function') {
      const { invertedX, invertedY } = this.props
      this.props.dragStop({
        x: this.state.offset.x * (invertedX ? -1 : 1),
        y: this.state.offset.y * (invertedY ? -1 : 1),
      })
    }

    this.setState({
      offset: { x: 0, y: 0 },
    })
  }

  adjustOffset(offset) {
    const newOffset = (typeof this.props.adjustOffset === 'function')
      ? this.props.adjustOffset(offset)
      : offset

    const { invertedX, invertedY } = this.props
    return {
      x: newOffset.x * (invertedX ? -1 : 1),
      y: newOffset.y * (invertedY ? -1 : 1),
    }
  }

  render() {
    const { offset } = this.state
    return (
      <g
        onMouseDown={this.onDragStart}
        onMouseMove={this.onDragMove}
        onMouseUp={this.onDragStop}
        onTouchStart={this.onDragStart}
        onTouchMove={this.onDragMove}
        onTouchEnd={this.onDragStop}
        transform={`translate(${offset.x} ${offset.y})`}
        className="SVGDrag"
      >
        {this.props.children}
      </g>
    )
  }
}

module.exports = SVGDrag
