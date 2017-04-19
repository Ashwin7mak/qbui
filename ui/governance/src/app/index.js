import React from 'react';
import {render} from 'react-dom';
import {Router, Route} from 'react-router-dom';
import 'react-fastclick';
import {GOVERNANCE_ACCOUNT_ROUTE, GOVERNANCE_ACCOUNT_USERS_ROUTE} from './routes';
import AppShell from './appShell';
import AccountUsers from '../account/users/AccountUsers';

import {Provider} from 'react-redux';
import createGovernanceStore from './store';

import GovernanceBundleLoader from '../locales/governanceBundleLoader';

// init the localization services
GovernanceBundleLoader.changeLocale('en-us'); // todo: LocaleHack - need to figure out how to get to: config.locale.default

const store = createGovernanceStore();

render((
    <Provider store={store}>
        <Router>
            <Route path={GOVERNANCE_ACCOUNT_ROUTE} component={AppShell}>
               <Route path={GOVERNANCE_ACCOUNT_USERS_ROUTE} component={AccountUsers} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('content'));
