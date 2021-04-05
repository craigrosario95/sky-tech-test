import React from 'react';
import { createBrowserHistory } from "history";
import {Router, Route, Switch} from 'react-router-dom';
import './main.scss';
import HelpArticles from './views/HelpArticles';

const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/:query?" component={HelpArticles} />
        </Switch>
      </Router>
    );
  }
}

export default App;