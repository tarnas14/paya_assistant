import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
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
import HomeContainer from './containers/Home'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {purple500} from 'material-ui/styles/colors'
import App from './App'
import './index.css'

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

class AppWrapper extends React.Component {
  constructor() {
    super()
    this.state = {
      error: '',
      currentUser: null
    }
  }

  async componentDidMount() {
    // if (auth.loggedIn()) {
      this.setUser(await getBasicUserInfo())
    // }
  }

  setUser = user => {
    this.setState({currentUser: user})
  }

  setError = e => this.setState({error: e})

  render () {
    const loggedIn = auth.loggedIn()
    const {currentUser} = this.state
    return <div>
      <Snackbar
        open={Boolean(this.state.error)}
        message={`ERROR: ${this.state.error}`}
        autoHideDuration={4000}
      />
      <Route exact path="/index.html" authed={loggedIn} component={() => <App user={currentUser}><HomeContainer setError={this.setError} user={currentUser}/></App>}/>
      {/*
      <Switch>
        <Route exact path="/login" render={(props) => <Login {...props}/>}/>
        <MatchWhenAuthorized exact path="/" authed={loggedIn} component={() => <App user={currentUser}><HomeContainer user={currentUser}/></App>}/>
        <MatchWhenAuthorized exact path="/logout" authed={loggedIn} component={Logout}/>
        <Route path="/" component={() => <Content>you have reached the tipping point... AHAHAH YOU GET IT? TIPPING POINT<br/>(404 not found)</Content>}/>
      </Switch>*/}
    </div>
  }
}

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: purple500,
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
