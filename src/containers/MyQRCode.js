import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'

class MyQRCode extends Component {
  render () {
    return (
      <Content>
        <QRDisplay value="some-test-value-123" />
      </Content>
    )
  }
}

export default MyQRCode
