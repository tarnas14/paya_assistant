import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'
import RefreshIndicator from 'material-ui/RefreshIndicator';

class MyQRCode extends Component {
  render () {
    const canDisplay = this.props.currentUser && this.props.currentUser.guid
    return (
      <Content>
        {!canDisplay && <RefreshIndicator
          size={40}
          left={0}
          top={40}
          status="loading"
          style={{
            display: 'inline-block',
            position: 'relative',
          }}
        />}
        {canDisplay && <QRDisplay guid={this.props.currentUser.guid} />}
      </Content>
    )
  }
}

export default MyQRCode
