import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import 'react-fastclick';
import {GOVERNANCE_USERS_ROUTE} from './routes';
import AccountUsers from '../account/users/AccountUsers';

import {Provider} from 'react-redux';
import createGovernanceStore from './store';

const store = createGovernanceStore();


render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path={GOVERNANCE_USERS_ROUTE} component={AccountUsers} />
        </Router>
    </Provider>
), document.getElementById('content'));
