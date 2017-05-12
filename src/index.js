import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import urljs from 'urljs'
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {getBasicUserInfo} from './api'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './App'
import './index.css'

import MyQRCode from './containers/MyQRCode'
import Tip from './containers/Tip'
import Content from './components/Content'

const TOKEN_KEY = 'token'
const auth = {
  login: token => localStorage.setItem(TOKEN_KEY, token),
  logout: () => localStorage.removeItem(TOKEN_KEY),
  loggedIn: () => Boolean(localStorage.getItem(TOKEN_KEY))
}

const Login = ({setUser, location}) => {
  const {token, afterLoginGoTo} = urljs.parseQuery(location)
  if (!token) {
    return <div>dude, get a token first</div>
  }

  setUser(getBasicUserInfo(token))
  auth.login(token)

  const from = afterLoginGoTo || '/'
  return <Redirect to={from} />
}

const Logout = () => {
  auth.logout();

  return <Redirect to={'/'} />
}

const redirectToLoginPage = location => {
  const API_LOGIN = 'http://our-backend/login'
  const redirectUri = `${document.location.origin}/login?afterLoginGoTo=${document.location.pathname}`
  const getFullString = `${API_LOGIN}?redirectUri=${encodeURIComponent(redirectUri)}`

  return <div>
    <div>redirecting to backend to login at <pre>{getFullString}</pre></div>
    <p>they should hit {`${document.location.origin}/login?afterLoginGoTo=${encodeURIComponent(document.location.pathname)}`}&token=somethingSomething</p>
  </div>
}

const MatchWhenAuthorized = ({component: Component, authed, ...rest}) => (
  <Route {...rest} render={renderProps => (
    authed ? (
      <Component {...renderProps} />
    ) : redirectToLoginPage(renderProps.location)
  )}/>
)

MatchWhenAuthorized.propTypes = {
  authed: PropTypes.bool.isRequired
}

const MyCode = (currentUser) => () => <App user={currentUser}><MyQRCode/></App>
const TipHistory = (currentUser) => () => <App user={currentUser}><Content>TipHistory</Content></App>
const Stats = (currentUser) =>  () => <App user={currentUser}><Content>Stats</Content></App>
const MyAccount =  (currentUser) => () => <App user={currentUser}><Content>MyAccount</Content></App>

class AppWrapper extends React.Component {
  constructor() {
    super()
    this.state = {currentUser: null}
  }

  componentDidMount() {
    if (auth.loggedIn()) {
      this.setUser(getBasicUserInfo())
    }
  }

  setUser = user => {
    this.setState({currentUser: user})
  }

  render () {
    const loggedIn = auth.loggedIn()
    const {currentUser} = this.state
    return <div>
      <Switch>
        <Route exact path="/login" render={(props) => <Login {...{...props, setUser: this.setUser}}/>}/>
        <MatchWhenAuthorized exact path="/" authed={loggedIn} component={MyCode(currentUser)}/>
        <MatchWhenAuthorized exact path="/tip" authed={loggedIn} component={() => <App user={currentUser}><Tip/></App>}/>
        <MatchWhenAuthorized exact path="/tiphistory" authed={loggedIn} component={TipHistory(currentUser)}/>
        <MatchWhenAuthorized exact path="/stats" authed={loggedIn} component={Stats(currentUser)}/>
        <MatchWhenAuthorized exact path="/myaccount" authed={loggedIn} component={MyAccount(currentUser)}/>
        <MatchWhenAuthorized exact path="/logout" authed={loggedIn} component={Logout}/>
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
