import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton';

class MyQRCode extends Component {
  renderInfoAboutIncomingAccount = () => {
    return <div>
      <p>To receive tips you have to first set up an incoming account</p>
      <Link to={'/myAccount'}><RaisedButton primary label="Your account settings"></RaisedButton></Link>
    </div>
  }

  render () {
    return (
      <Content>
        {this.props.currentUser && !this.props.currentUser.hasIncomingAccount && this.renderInfoAboutIncomingAccount()}
        {!this.props.currentUser && <RefreshIndicator
          size={40}
          left={0}
          top={40}
          status="loading"
          style={{
            display: 'inline-block',
            position: 'relative',
          }}
        />}
        {this.props.urrentUser && this.props.currentUser.hasIncomingAccount && <QRDisplay guid={this.props.currentUser.guid} />}
      </Content>
    )
  }
}

export default MyQRCode
