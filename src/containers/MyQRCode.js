import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'

class MyQRCode extends Component {
  render () {
    const canDisplay = this.props.currentUser && this.props.currentUser.guid
    return (
      <Content>
        {!canDisplay && <div>cannot display qr code</div>}
        {canDisplay && <QRDisplay value={this.props.currentUser.guid} />}
      </Content>
    )
  }
}

export default MyQRCode
