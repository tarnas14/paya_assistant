import React, {Component} from 'react'
import Slider from 'material-ui/Slider'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import User from '../components/User'
import FlatButton from 'material-ui/FlatButton'
import Content from '../components/Content'
import Scanner from '../components/Scanner'
import {getUserInfoFromQrCodeValue, giveTip} from '../api'

const initialState = {
  recipientGuid: null,
  amount: 5,
  message: '',
  confirmDialogOpen: false,
}

const MAX_CHARACTERS = 140

class Tip extends Component {
  constructor (props) {
    super(props)

    this.state = initialState
  }

  handleQrCode = async (recipientGuid) => {
    const user = await getUserInfoFromQrCodeValue(recipientGuid)
    this.setState({recipientGuid, user})
  }

  handleSliderChange = (event, value) => {
    this.setState({amount: value})
  }

  handleFeedbackChange = (event, value) => {
    this.setState(state => {
      if (value.length >= MAX_CHARACTERS) {
        return
      }
      return {message: value}
    })
  }

  giveTheTip = event => {
    event.preventDefault()
    this.setState({confirmDialogOpen: true})
  }

  handleConfirmDialog = async event => {
    event.preventDefault()
    console.log(JSON.stringify(this.state, null, 4))
    await giveTip({
      recipientGuid: this.state.recipientGuid,
      amount: this.state.amount,
      message: this.state.message,
    }, () => {
      alert('Some kind of error')
    })

    this.setState({successFulTip: true})

    this.setState(initialState)
  }

  handleCancelDialog = event => {
    event.preventDefault()
    this.setState({confirmDialogOpen: false})
  }

  render () {
    if (this.state.successFulTip) {
      return (
        <Content>
          <p>"My favorite things in life don't cost any money. It's really clear that the most precious resource we all have is time." ~Steve Jobs</p>
          <br />
          <p>Thanks for the tip!</p>
          <br />
          <FlatButton
            label="Go back"
            primary={true}
            onTouchTap={() => window.location = '/'}
          />
        </Content>
      )
    }
    if (!this.state.recipientGuid) {
      return <Scanner onSuccessfulScan={this.handleQrCode} />
    }
    return (
      <Content>
        <User user={this.state.user}/>

        <Content>
          Tip value:<br />
          <TextField readOnly value={this.state.amount} />
          <Slider
            min={1}
            max={40}
            step={1}
            onChange={this.handleSliderChange}
            value={this.state.amount}
          />
          <TextField
            fullWidth
            hintText="Leave a message"
            multiLine
            rows={2}
            rowsMax={4}
            onChange={this.handleFeedbackChange}
            value={this.state.message}
          />
        </Content>

        <RaisedButton
          fullWidth
          label="Give the tip"
          primary
          onTouchTap={this.giveTheTip}
        />

        <Dialog
          title="Give the tip?"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.handleCancelDialog}
            />,
            <FlatButton
              label="Confirm"
              primary={true}
              onTouchTap={this.handleConfirmDialog}
            />
          ]}
          modal={true}
          open={this.state.confirmDialogOpen}
        />
      </Content>
    )
  }
}

export default Tip
