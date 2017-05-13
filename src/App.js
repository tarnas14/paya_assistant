import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import User from './components/User'

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye'
import Assessment from 'material-ui/svg-icons/action/assessment'
import AccountBox from 'material-ui/svg-icons/action/account-box'
import EuroSymbol from 'material-ui/svg-icons/editor/monetization-on'
import Time from 'material-ui/svg-icons/device/access-time'
import Divider from 'material-ui/Divider'
import FontIcon from 'material-ui/FontIcon'

import {Link} from 'react-router-dom'

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
          <User user={this.props.user}/>
          <MenuItem
            style={{textAlign: 'left'}}
            leftIcon={<RemoveRedEye />}
            containerElement={<Link to="/" />}
            onTouchTap={this.handleMenuClose}
            primaryText="My QR Code"
          />
          <MenuItem
            leftIcon={<EuroSymbol/>}
            style={{textAlign: 'left'}}
            containerElement={<Link to="/tip" />}
            onTouchTap={this.handleMenuClose}
            primaryText="Tip"
          />
          <MenuItem
            style={{textAlign: 'left'}}
            leftIcon={<Time/>}
            containerElement={<Link to="/tiphistory" />}
            primaryText="History"
            onTouchTap={this.handleMenuClose}
          />
          <MenuItem
            style={{textAlign: 'left'}}
            leftIcon={<Assessment />}
            containerElement={<Link to="/stats" />}
            primaryText="Stats"
            onTouchTap={this.handleMenuClose}
          />
          <MenuItem
            style={{textAlign: 'left'}}
            leftIcon={<AccountBox />}
            containerElement={<Link to="/myaccount" />}
            primaryText="MyAccount"
            onTouchTap={this.handleMenuClose}
          />
          <Divider/>
          <MenuItem
            style={{textAlign: 'left'}}
            leftIcon={<FontIcon/>}
            containerElement={<Link to="/logout" />}
            primaryText="Logout"
            onTouchTap={this.handleMenuClose}
          />
        </Drawer>
        {this.props.children}
      </div>
    )
  }
}

export default App
