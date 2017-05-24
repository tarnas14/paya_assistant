import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

import SpeechAPIRequired from './containers/SpeechAPI'
import frame from './images/phone.frame.png'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDrawerOpen: false
    }
  }

  handleMenuClick = () => {
    this.setState(state => ({isDrawerOpen: !state.isDrawerOpen}))
  }

  handleMenuClose = () => {
    this.setState({isDrawerOpen: false})
  }

  render() {
    return (
      <div className="App" style={{backgroundImage: `url(${frame}`}}>
        <div className="container">
          <AppBar
            showMenuIconButton={false}
            title="PAYA"
          />
          <SpeechAPIRequired>{this.props.children}</SpeechAPIRequired>
        </div>
      </div>
    )
  }
}

export default App
