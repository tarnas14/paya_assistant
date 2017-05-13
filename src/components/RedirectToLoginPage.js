import React from 'react'
import Content from '../components/Content'
import logo from '../images/logo.png'
import RaisedButton from 'material-ui/RaisedButton'
import config from '../config'

export default () => {
  console.log(config)
  const redirectUri = `${document.location.origin}/login?afterLoginGoTo=${document.location.pathname}`
  const backendRedirectString = `${config.apiLogin}?redirectUri=${encodeURIComponent(redirectUri)}`

  const authroute = `${document.location.origin}/login?afterLoginGoTo=${encodeURIComponent(document.location.pathname)}&token=somethingSomething`

  return <Content>
    <img src={logo} alt='tiper <3 payments.' />
    <div style={{marginTop: '20px'}}><RaisedButton label='Log in' primary={true} href={config.dev ? authroute : backendRedirectString} /></div>
  </Content>
}
