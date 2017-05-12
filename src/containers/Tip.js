import React, {Component} from 'react'
import Slider from 'material-ui/Slider'
import User from '../components/User'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Content from '../components/Content'
import Scanner from '../components/Scanner'
import {getUserInfoFromQrCodeValue} from '../api'

const MAX_CHARACTERS = 140

class Tip extends Component {
  constructor (props) {
    super(props)

    this.state = {
      qrCodeValue: null,
      tipValue: 5,
      feedback: ''
    }
  }

  handleQrCode = async (qrCodeValue) => {
    const user = await getUserInfoFromQrCodeValue(qrCodeValue)
    this.setState({qrCodeValue, user})
  }

  handleSliderChange = (event, value) => {
    this.setState({tipValue: value})
  }

  handleFeedbackChange = (event, value) => {
    this.setState(state => {
      if (value.length >= MAX_CHARACTERS) {
        return
      }
      return {feedback: value}
    })
  }

  giveTheTip = (event) => {
    event.preventDefault()
    alert(JSON.stringify(this.state, null, 4))
  }

  render () {
    if (!this.state.qrCodeValue) {
      return <Scanner onSuccessfulScan={this.handleQrCode} />
    }
    return (
      <Content>
        <User user={this.state.user}/>

        <Content>
          Tip value:<br />
          <TextField readOnly value={this.state.tipValue} />
          <Slider
            min={1}
            max={40}
            step={1}
            onChange={this.handleSliderChange}
            value={this.state.tipValue}
          />
          <TextField
            fullWidth
            hintText="Leave feedback"
            multiLine
            rows={2}
            rowsMax={4}
            onChange={this.handleFeedbackChange}
            value={this.state.feedback}
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
