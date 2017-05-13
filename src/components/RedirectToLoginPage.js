import React from 'react'
import Content from '../components/Content'
import logo from '../images/logo.png'
import RaisedButton from 'material-ui/RaisedButton'
import './RedirectToLoginPage.css'

const isDev = () => process.env.REACT_APP_IS_DEV === 'true'

export default () => {
  const redirectUri = `${document.location.origin}/login?afterLoginGoTo=${document.location.pathname}`
  const backendRedirectString = `${process.env.REACT_APP_API_LOGIN}?redirectUrl=${encodeURIComponent(redirectUri)}`

  const authroute = `${document.location.origin}/login?afterLoginGoTo=${encodeURIComponent(document.location.pathname)}&token=somethingSomething`

  return <Content className='loginPage'>
    <div className='logo'>
        <img src={logo} style={{width: '100%', maxWidth: '300px'}} alt='tiper <3 payments.' />
    </div>
    <div className='form'>
        <div className='half'>
            <RaisedButton label='Log in to Tiper' fullWidth={true} href={isDev() ? authroute : backendRedirectString} />
        </div>
    </div>
  </Content>
}
