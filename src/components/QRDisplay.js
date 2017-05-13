import React, {Component} from 'react'
import PropTypes from 'prop-types'
const QRCode = require('qrcode.react')

class QRDisplay extends Component {
  render () {
    return (
      <QRCode value={this.props.guid} size={256} />
    )
  }
}

QRDisplay.propTypes = {
  guid: PropTypes.string.isRequired
}

export default QRDisplay
