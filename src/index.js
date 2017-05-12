import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {
  Switch,
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
import Scanner from './components/Scanner'
import Content from './components/Content'

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

const goToLogin = () => {
  document.location = 'http://psy.pl'
  return null
}

const MatchWhenAuthorized = ({component: Component, authed, ...rest}) => console.log() || (
  <Route {...rest} render={renderProps => (
    authed ? (
      <Component {...renderProps} />
    ) : goToLogin()
  )}/>
)

MatchWhenAuthorized.propTypes = {
  authed: PropTypes.bool.isRequired
}

const Tip = () => <App><Scanner/></App>
const MyCode = () => <App><MyQRCode/></App>
const TipHistory = () => <App><Content>TipHistory</Content></App>
const Stats = () => <App><Content>Stats</Content></App>
const MyAccount = () => <App><Content>MyAccount</Content></App>
const Logout = (logout) => <div><button onClick={logout}>log out here</button></div>

class AppWrapper extends React.Component {
  constructor() {
    super()
    this.state = {
      loggedIn: Boolean(localStorage.getItem('loggedIn'))
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
      <Switch>
        <Route exact path="/login" render={(props) => <Login {...props} login={this.logIn.bind(this)}/>}/>
        <MatchWhenAuthorized exact path="/" authed={loggedIn} component={MyCode}/>
        <MatchWhenAuthorized exact path="/tip" authed={loggedIn} component={Tip}/>
        <MatchWhenAuthorized exact path="/tiphistory" authed={loggedIn} component={TipHistory}/>
        <MatchWhenAuthorized exact path="/stats" authed={loggedIn} component={Stats}/>
        <MatchWhenAuthorized exact path="/myaccount" authed={loggedIn} component={MyAccount}/>
        <MatchWhenAuthorized exact path="/logout" authed={loggedIn} component={Logout.bind(undefined, this.logOut.bind(this))}/>
        <Route path="/" component={() => <Content>you have reached the tipping point... AHAHAH YOU GET IT? TIPPING POINT<br/>(404 not found)</Content>}/>
      </Switch>
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
