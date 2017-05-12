import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import './index.css';

const AppWrapper = () => (
  <div>
    <Route path="/" component={App}/>
    <Route path="/tiphistory" component={App}/>
    <Route path="/stats" component={App}/>
    <Route path="/myaccount" component={App}/>
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
