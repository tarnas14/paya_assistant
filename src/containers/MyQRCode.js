import React, {Component} from 'react'
import QRDisplay from '../components/QRDisplay'
import Content from '../components/Content'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import Loading from '../components/Loading'

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
        {!this.props.currentUser && <Loading/>}
        {this.props.currentUser && this.props.currentUser.hasIncomingAccount && <QRDisplay guid={this.props.currentUser.guid} />}
      </Content>
    )
  }
}

export default MyQRCode
