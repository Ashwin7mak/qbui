import React from 'react';
import {render} from 'react-dom';
import {Router, Route} from 'react-router-dom';
import 'react-fastclick';
import {GOVERNANCE_ACCOUNT_ROUTE, GOVERNANCE_ACCOUNT_USERS_ROUTE} from './routes';
import AppShell from './appShell';
import AccountUsers from '../account/users/AccountUsers';
import {BrowserRouter, Switch} from 'react-router-dom';
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";
import {Provider} from 'react-redux';
import createGovernanceStore from './store';

import GovernanceBundleLoader from '../locales/governanceBundleLoader';

// init the localization services
GovernanceBundleLoader.changeLocale('en-us'); // todo: LocaleHack - need to figure out how to get to: config.locale.default

const store = createGovernanceStore();

const routes = [
    {
        path: GOVERNANCE_ACCOUNT_ROUTE,
        component: AppShell,
        routes: [
            {
                path: GOVERNANCE_ACCOUNT_USERS_ROUTE,
                component: AccountUsers
            }
        ]
    }
];

render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                {/*  within Switch 1st match wins
                 includes all the above top level routes and passed on the child routes in the properties
                 note if an entry it is without a path to match
                 the route has to come after specific routes
                 */}
                {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                    )
                )}
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('content'));

// render((
//     <Provider store={store}>
//         <Router>
//             <Route path={GOVERNANCE_ACCOUNT_ROUTE} component={AppShell}>
//                <Route path={GOVERNANCE_ACCOUNT_USERS_ROUTE} component={AccountUsers} />
//             </Route>
//         </Router>
//     </Provider>
// ), document.getElementById('content'));
