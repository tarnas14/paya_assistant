import React, {Component} from 'react'
import {login} from '../api'
import urijs from 'urijs'
import { Redirect, } from 'react-router-dom'
import auth from '../auth'
import Content from '../components/Content'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'

export default class extends Component {
  constructor() {
    super()
    this.state = {
      redirect: false,
      username: '',
      password: '',
    }
  }

  changeUsername = e => {
    e.preventDefault() 
    this.setState({username: e.currentTarget.value})
  }
  
  changePassword = e => {
    e.preventDefault() 
    this.setState({password: e.currentTarget.value})
  }

  render() {
    if (this.state.redirect) {
      const {location} = this.props
      const {afterLoginGoTo} = urijs.parseQuery(location.search)

      const from = afterLoginGoTo || '/'
      return <Redirect to={from} />
    }

    const {username, password} = this.state
    return <Content>
      <Paper>
        <TextField value={username} onChange={this.changeUsername} />
        <TextField value={password} type='password' onChange={this.changePassword} />
      </Paper>
    </Content>
  }
}
