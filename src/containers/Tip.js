import React, {Component} from 'react'
import Slider from 'material-ui/Slider';
import Content from '../components/Content'
import Scanner from '../components/Scanner'

class Tip extends Component {
  constructor (props) {
    super(props)

    this.state = {
      qrCodeValue: null
    }
  }

  handleQrCode = (qrCodeValue) => {
    console.log('QR CODE VALUE', qrCodeValue)
    this.setState({qrCodeValue})
  }

  render () {
    if (!this.state.qrCodeValue) {
      return <Scanner onSuccessfulScan={this.handleQrCode} />
    }
    return (
      <Content>
        <TipSlider />
      </Content>
    )
  }
}

class TipSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tipValue: 5
    }
  }

  handleChange = (event, value) => {
    this.setState({tipValue: value})
  }

  render () {
    return (
      <Content>
        Give a tip to Tom <br />
        Tip value: {this.state.tipValue} <br />
        <Slider
          min={1}
          max={40}
          step={1}
          onChange={this.handleChange}
          value={this.state.tipValue}
        />
      </Content>
    )
  }
}

export default Tip
