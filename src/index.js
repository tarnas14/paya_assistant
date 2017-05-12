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

import MyQRCode from './containers/MyQRCode'
import Scanner from './components/Scanner'
import Content from './components/Content'

const MyQRCodeRoute = () => <MyQRCode />
const Tip = () => <Scanner />
const TipHistory = () => <Content>TipHistory</Content>
const Stats = () => <Content>Stats</Content>
const MyAccount = () => <Content>MyAccount</Content>

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
