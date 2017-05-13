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
import {Redirect, Link} from 'react-router-dom'
import Loading from '../components/Loading'
import Paper from 'material-ui/Paper';

const initialState = {
  recipientGuid: null,
  amount: 5,
  message: '',
  confirmDialogOpen: false,
  scan: false,
  isRedirecting: false,
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

    const response = await giveTip({
      recipientGuid: this.state.recipientGuid,
      amount: this.state.amount,
      message: this.state.message,
    })

    if (response.error) {
      alert('Error occured during giving a tip')

      this.setState({isRedirecting: true})

      return
    }

    this.setState({successFulTip: true})
  }

  handleCancelDialog = event => {
    event.preventDefault()
    this.setState({confirmDialogOpen: false})
  }

  doScan = event => {
    event.preventDefault()
    this.setState({scan: true})
  }

  render () {
    if (!this.props.currentUser) {
      return <Loading />
    }

    if (!this.props.currentUser.hasOutgoingAccount) {
      return <div>
        <p>To tip you have to first set up an outgoing account</p>
        <Link to={'/myAccount'}><RaisedButton primary label="Your account settings"></RaisedButton></Link>
      </div>
    }

    if (this.state.isRedirecting) {
      return (
        <Redirect to={'/'} />
      )
    }

    if (this.state.successFulTip) {
      return (
        <Content>
          <Paper>
            <Content>
              <p>Thanks for the tip!</p>
              <blockquote><p>"My favorite things in life don't cost any money. It's really clear that the most precious resource we all have is time."</p><p style={{textAlign: 'text-right'}}>~Steve Jobs</p></blockquote>
              <FlatButton
                label="Go back"
                primary={true}
                onTouchTap={() => this.setState({isRedirecting: true})}
              />
            </Content>
          </Paper>
        </Content>
      )
    }

    if(!this.state.scan) {
      return <RaisedButton label="Leave a tip!" primary onClick={this.doScan} style={{backgroundColor: 'rgb(255, 111, 0)', marginTop: '60px', padding: '20px'}}/>
    }

    if (!this.state.recipientGuid && this.state.scan) {
      return <Scanner onSuccessfulScan={this.handleQrCode} />
    }

    return (
      <Content>
        <User user={this.state.user}/>

        <Content>
          <TextField floatingLabelText="Tip value" readOnly value={this.state.amount} inputStyle={{fontSize: '2em', textAlign: 'center'}} />
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
