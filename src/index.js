import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './App'
import './index.css'

import MyQRCode from './containers/MyQRCode'
import Tip from './containers/Tip'
import Content from './components/Content'

const TipHistory = () => <Content>TipHistory</Content>
const Stats = () => <Content>Stats</Content>
const MyAccount = () => <Content>MyAccount</Content>
const Logout = (logout) => <div><button onClick={logout}>log out here</button></div>

class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      pleaseRedirect: false
    }
  }

  login = () => {
    this.props.login(() => this.setState({pleaseRedirect: true}))
  }

  render () {
    const from = (this.props.location && this.props.location.state) || '/'
    const {pleaseRedirect} = this.state
    if (pleaseRedirect) {
      return <Redirect to={from} />
    }

    return <button onClick={this.login}>log in pl0x</button>
  }
}

const MatchWhenAuthorized = ({component: Component, authed, ...rest}) => (
  <Route {...rest} render={renderProps => (
    authed ? (
      <Component {...renderProps} />
    ) : (
      <Redirect to={ {
        pathname: '/login',
        state: {from: renderProps.location}
      } } />
    )
  )}/>
)

MatchWhenAuthorized.propTypes = {
  authed: PropTypes.bool.isRequired
}

class AppWrapper extends React.Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false
    }
  }

  logIn = (cb) => {
    this.setState({loggedIn: true}, cb)
  }

  logOut = () => {
    this.setState({loggedIn: false})
  }

  render () {
    const {loggedIn} = this.state
    return <div>
      <Route pattern="/login" render={() => <Login login={this.logIn.bind(this)}/>}/>
      <MatchWhenAuthorized path="/" authed={loggedIn} component={App}/>
      <MatchWhenAuthorized exact path="/" authed={loggedIn} component={MyQRCode}/>
      <MatchWhenAuthorized path="/tip" authed={loggedIn} component={Tip}/>
      <MatchWhenAuthorized path="/tiphistory" authed={loggedIn} component={TipHistory}/>
      <MatchWhenAuthorized path="/stats" authed={loggedIn} component={Stats}/>
      <MatchWhenAuthorized path="/myaccount" authed={loggedIn} component={MyAccount}/>
      <MatchWhenAuthorized path="/logout" authed={loggedIn} component={Logout.bind(undefined, this.logOut.bind(this))}/>
    </div>
  }
}

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
      <AppWrapper/>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
)
