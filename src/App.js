import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Scanner from './components/Scanner'
import QRDisplay from './components/QRDisplay'
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

  render() {
    return (
      <div className="App">
        <AppBar
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleMenuClick}
          title="Tiper"
        />
        <Drawer open={this.state.isDrawerOpen}>
          <MenuItem>Tip</MenuItem>
          <MenuItem>Tip History</MenuItem>
          <MenuItem>Stats</MenuItem>
          <MenuItem>My Account</MenuItem>
        </Drawer>
        <Scanner />
        <QRDisplay value="some-test-value-123" />
      </div>
    )
  }
}

export default App
