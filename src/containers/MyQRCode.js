import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'

class MyQRCode extends Component {
  render () {
    return (
      <QRDisplay value="some-test-value-123" />
    )
  }
}

export default MyQRCode
