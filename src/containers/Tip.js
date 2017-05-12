import React, {Component} from 'react'
import Slider from 'material-ui/Slider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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
      </Content>
    )
  }
}

export default Tip
