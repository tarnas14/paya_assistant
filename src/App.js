import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import {Link} from 'react-router-dom'

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

  handleMenuClose = () => {
    this.setState({isDrawerOpen: false})
  }

  render() {
    return (
      <div className="App">
        <AppBar
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.handleMenuClick}
          title="Tiper"
        />
        <Drawer
          docked={false}
          onRequestChange={open => this.setState({isDrawerOpen: open})}
          open={this.state.isDrawerOpen}
        >
          <MenuItem
            containerElement={<Link to="/tip" />}
            onTouchTap={this.handleMenuClose}
            primaryText="Tip"
          />
          <MenuItem
            containerElement={<Link to="/tiphistory" />}
            primaryText="History"
            onTouchTap={this.handleMenuClose}
          />
          <MenuItem
            containerElement={<Link to="/stats" />}
            primaryText="Stats"
            onTouchTap={this.handleMenuClose}
          />
          <MenuItem
            containerElement={<Link to="/myaccount" />}
            primaryText="MyAccount"
            onTouchTap={this.handleMenuClose}
          />
          <MenuItem
            containerElement={<Link to="/logout" />}
            primaryText="Logout"
            onTouchTap={this.handleMenuClose}
          />
        </Drawer>
        <QRDisplay value="some-test-value-123" />
        {this.props.children}
      </div>
    )
  }
}

export default App
