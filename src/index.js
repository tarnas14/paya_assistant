import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import urijs from 'urijs'
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {getBasicUserInfo} from './api'
import auth from './auth'
import TipHistoryContainer from './containers/TipHistory'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {amber900} from 'material-ui/styles/colors'
import App from './App'
import './index.css'

import MyQRCode from './containers/MyQRCode'
import Tip from './containers/Tip'
import Content from './components/Content'
import redirectToLoginPage from './components/RedirectToLoginPage'

const Login = ({location}) => {
  const {token, afterLoginGoTo} = urijs.parseQuery(location.search)
  if (!token) {
    return <div>dude, get a token first</div>
  }

  auth.login(token)

  const from = afterLoginGoTo || '/'
  return <Redirect to={from} />
}

const Logout = () => {
  auth.logout();

  return <Redirect to={'/'} />
}

const MatchWhenAuthorized = ({component: Component, authed, ...rest}) => (
  <Route {...rest} render={renderProps => (
    authed ? (
      <Component {...renderProps} />
    ) : redirectToLoginPage()
  )}/>
)

MatchWhenAuthorized.propTypes = {
  authed: PropTypes.bool.isRequired
}

const MyCode = currentUser => () => <App user={currentUser}><MyQRCode currentUser={currentUser}/></App>
const TipHistory = currentUser => () => <App user={currentUser}><TipHistoryContainer currentUser={currentUser}/></App>
const Stats = currentUser =>  () => <App user={currentUser}><Content>Stats</Content></App>
const MyAccount =  currentUser => () => <App user={currentUser}><Content>MyAccount</Content></App>

class AppWrapper extends React.Component {
  constructor() {
    super()
    this.state = {currentUser: null}
  }

  async componentDidMount() {
    if (auth.loggedIn()) {
      this.setUser(await getBasicUserInfo())
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
        <Route exact path="/login" render={(props) => <Login {...props}/>}/>
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

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: amber900,
  },
  appBar: {
    height: 50,
  },
})

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router>
      <AppWrapper/>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
)
