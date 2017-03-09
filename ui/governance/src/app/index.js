import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import 'react-fastclick';
import {GOVERNANCE_BASE_ROUTE, GOVERNANCE_USERS_ROUTE} from './routes';
import NavShell from '../navShell/navShell';
import AccountUsers from '../account/users/AccountUsers';

render((
    <Router history={browserHistory}>
        <Route component={NavShell}>
            <Route path={GOVERNANCE_USERS_ROUTE} component={AccountUsers} />
        </Route>
    </Router>
), document.getElementById('content'));
