import React, {PropTypes, Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {Provider, connect} from 'react-redux';
import 'react-fastclick';
import {GOVERNANCE_USERS_ROUTE} from './routes';
import AccountUsers from '../account/users/AccountUsers';

render((
    <Router history={browserHistory}>
        <Route path={GOVERNANCE_USERS_ROUTE} component={AccountUsers} />
    </Router>
), document.getElementById('content'));
