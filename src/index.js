import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import './index.css';

import MyQRCode from './components/containers/MyQRCode'
import Scanner from './components/Scanner'

const MyQRCodeRoute = () => <MyQRCode />
const Tip = () => <Scanner />
const TipHistory = () => <div>TipHistory</div>
const Stats = () => <div>Stats</div>
const MyAccount = () => <div>MyAccount</div>

const AppWrapper = () => (
  <div>
    <Route path="/" component={App} />
    <Route exact path="/" component={MyQRCodeRoute} />
    <Route path="/tip" component={Tip} />
    <Route path="/tiphistory" component={TipHistory} />
    <Route path="/stats" component={Stats} />
    <Route path="/myaccount" component={MyAccount} />
  </div>
)

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
      <div>
        <Route path="/" component={AppWrapper} />
      </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
