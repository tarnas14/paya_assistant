import React, {Component} from 'react'
import Content from '../components/Content'
import logo from '../images/logo.png'
import RaisedButton from 'material-ui/RaisedButton'
import './RedirectToLoginPage.css'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import urijs from 'urijs'
import { Redirect, } from 'react-router-dom'
import {login as apiLogin, getBasicUserInfo} from '../api'
import auth from '../auth'
import frame from '../images/phone.frame.png'

const isDev = () => process.env.REACT_APP_IS_DEV === 'true'

export default class extends Component {
 
  constructor () {
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

  login = async (e) => {
    e.preventDefault()
    const {username, password} = this.state
    const response = await apiLogin(username, password)
    if (response.token) {
      auth.login(response.token)
    }

    const userInfo = await getBasicUserInfo(username)
    window.location.reload()
    this.props.setUser(userInfo)
    this.setState({redirect: true})
  }

  render () {
    if (this.state.redirect) {
      const from = '/'
      return <Redirect to={from} />
    }

    const redirectUri = `${document.location.origin}/login?afterLoginGoTo=${document.location.pathname}`
    const backendRedirectString = `${process.env.REACT_APP_API_LOGIN}?redirectUrl=${encodeURIComponent(redirectUri)}`

    const authroute = `${document.location.origin}/login?afterLoginGoTo=${encodeURIComponent(document.location.pathname)}&token=somethingSomething`

    const {username, password} = this.props
    return <div className='loginPage' style={{backgroundImage: `url(${frame}`}}><div className='container'>
      <div className='logo'>
          <img src={logo} style={{width: '100%', maxWidth: '300px'}} alt='tiper <3 payments.' />
      </div>
      <div className='form'>
          <div className='half'>
              <div style={{textAlign: 'center'}}>
                <TextField floatingLabelFixed={true} fullWidth={true} floatingLabelText='Nazwa użytkownika' value={username} onChange={this.changeUsername} />
              </div>
              <div style={{textAlign: 'center'}}>
                <TextField floatingLabelFixed={true} fullWidth={true} floatingLabelText='Hasło' value={password} type='password' onChange={this.changePassword} />
             </div>
             <div style={{textAlign: 'right'}}><RaisedButton label="Zaloguj się" primary={true} onClick={this.login}/></div>
          </div>
      </div>
    </div></div>
  }
}
