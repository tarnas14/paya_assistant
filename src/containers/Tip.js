import React, {Component} from 'react'
import Slider from 'material-ui/Slider';
import {Card, CardHeader} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
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
      feedback: '',
      iconColor: '#fff',
      confirmDialogOpen: false,
    }
  }

  handleQrCode = async (qrCodeValue) => {
    const {name, description, iconColor} = await getUserInfoFromQrCodeValue(qrCodeValue)
    this.setState({qrCodeValue, name, description, iconColor})
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

  giveTheTip = event => {
    event.preventDefault()
    this.setState({confirmDialogOpen: true})
  }

  handleConfirmDialog = event => {
    event.preventDefault()
    this.setState({confirmDialogOpen: false}, () => {
      alert(JSON.stringify(this.state, null, 4))
    })
  }

  handleCancelDialog = event => {
    event.preventDefault()
    this.setState({confirmDialogOpen: false})
  }

  render () {
    if (!this.state.qrCodeValue) {
      return <Scanner onSuccessfulScan={this.handleQrCode} />
    }
    return (
      <Content>
        <Card style={{textAlign: 'start'}}>
          <CardHeader
            avatar={<Avatar backgroundColor={this.state.iconColor} />}
            title={this.state.name}
            subtitle={this.state.description}
          />
        </Card>

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
