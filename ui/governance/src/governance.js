import React, {PropTypes, Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {Provider, connect} from 'react-redux';

import {GOVERNANCE_HOME_ROUTE} from '../../client-react/src/constants/urlConstants';
import Main from './components/main/main';

import 'react-fastclick';

render((
    <Router history={browserHistory}>
        <Route path={GOVERNANCE_HOME_ROUTE} component={Main} />
    </Router>
), document.getElementById('content'));