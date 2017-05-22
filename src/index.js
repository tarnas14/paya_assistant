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
import SpeechAPI from './containers/SpeechAPI'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {cyan300} from 'material-ui/styles/colors'
import App from './App'
import './index.css'

import Content from './components/Content'
import RedirectToLoginPage from './components/RedirectToLoginPage'

const Logout = () => {
  auth.logout();

  return <Redirect to={'/'} />
}

const MatchWhenAuthorized = ({component: Component, authed, setUser, ...rest}) => (
  <Route {...rest} render={renderProps => (
    authed ? (
      <Component {...renderProps} />
    ) : <RedirectToLoginPage setUser={setUser} />
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

  async componentDidMount () {
    if (auth.loggedIn()) {
      this.setUser(await getBasicUserInfo())
    }
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
      />
      <Switch>
        <MatchWhenAuthorized exact path="/" authed={loggedIn} setUser={this.setUser} component={() => <App user={currentUser}><SpeechAPI><HomeContainer user={currentUser}/></SpeechAPI></App>}/>
        <MatchWhenAuthorized exact path="/logout" authed={loggedIn} setUser={this.setUser} component={Logout}/>
        <Route path="/" component={() => <Content>404 not found</Content>}/>
      </Switch>
    </div>
  }
}

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: cyan300,
  },
  appBar: {
    height: 50,
  },
})

ReactDOM.render(
  <div className="container">
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router>
        <AppWrapper/>
      </Router>
    </MuiThemeProvider>
  </div>,
  document.getElementById('root')
)
