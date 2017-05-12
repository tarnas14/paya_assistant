import React, {Component} from 'react'
import Slider from 'material-ui/Slider';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Content from '../components/Content'
import Scanner from '../components/Scanner'
import {getUserInfoFromQrCodeValue} from '../api'
import avatarImg from '../images/avatar.jpg'

class Tip extends Component {
  constructor (props) {
    super(props)

    this.state = {
      qrCodeValue: null,
      tipValue: 5
    }
  }

  handleQrCode = async (qrCodeValue) => {
    const {userName, description} = await getUserInfoFromQrCodeValue(qrCodeValue)
    this.setState({qrCodeValue, userName, description})
  }

  handleChange = (event, value) => {
    this.setState({tipValue: value})
  }

  giveTheTip = () => {
    alert(JSON.stringify(this.state, null, 4))
  }

  render () {
    if (!this.state.qrCodeValue) {
      return <Scanner onSuccessfulScan={this.handleQrCode} />
    }
    return (
      <Content>
        <Card style={{textAlign: 'start'}}>
          <CardHeader
            avatar={avatarImg}
            title={this.state.userName}
            subtitle={this.state.description}
          />
          <CardText>
            Tip value: <strong>{this.state.tipValue}</strong>
          </CardText>
        </Card>

        <Content>
          <Slider
            min={1}
            max={40}
            step={1}
            onChange={this.handleChange}
            value={this.state.tipValue}
          />
        </Content>

        <RaisedButton
          fullWidth
          label="Give the tip"
          primary
          onTouchTap={this.giveTheTip}
        />
      </Content>
    )
  }
}

export default Tip
