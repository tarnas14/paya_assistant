import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QrReader from 'react-qr-reader'

class Scanner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      delay: 500,
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan (data) {
    if (!data) {
      return
    }
    this.props.onSuccessfulScan(data)
  }

  handleError (error) {
    alert(error)
  }

  render () {
    const previewStyle = {
      objectFit: 'fill',
      width: '100%',
    }

    return(
      <div>
        <QrReader
          delay={this.state.delay}
          facingMode="rear"
          onError={this.handleError}
          onScan={this.handleScan}
          style={previewStyle}
        />
      </div>
    )
  }
}

Scanner.propTypes = {
  onSuccessfulScan: PropTypes.func.isRequired
}

export default Scanner;
