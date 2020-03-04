import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import {createBrowserHistory} from 'history';

import App from 'App';
import ScrollToTop from 'components/ScrollToTop';

export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  document.getElementById('root')
);

