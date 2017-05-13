import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'

class MyQRCode extends Component {
  render () {
    return (
      <Content>
        <QRDisplay value="591671ac724e86.75366481" />
      </Content>
    )
  }
}

export default MyQRCode
