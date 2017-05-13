import React from 'react'
import Content from '../components/Content'
import logo from '../images/logo.png'
import RaisedButton from 'material-ui/RaisedButton'
import config from '../config'

const isDev = () => process.env.NODE_ENV === 'development'

export default () => {
  const redirectUri = `${document.location.origin}/login?afterLoginGoTo=${document.location.pathname}`
  const backendRedirectString = `${process.env.REACT_APP_API_LOGIN}?redirectUri=${encodeURIComponent(redirectUri)}`

  const authroute = `${document.location.origin}/login?afterLoginGoTo=${encodeURIComponent(document.location.pathname)}&token=somethingSomething`

  return <Content>
    <img src={logo} alt='tiper <3 payments.' />
    <div style={{marginTop: '20px'}}><RaisedButton label='Log in' primary={true} href={isDev() ? authroute : backendRedirectString} /></div>
  </Content>
}
