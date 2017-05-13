import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'

class MyQRCode extends Component {
  render () {
    return (
      <Content>
        <QRDisplay guid={this.props.guid} />
      </Content>
    )
  }
}

export default MyQRCode
