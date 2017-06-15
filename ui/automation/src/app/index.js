import React from 'react';
import {render} from 'react-dom';
import 'react-fastclick';
import {AUTOMATION_APP_ROUTE, AUTOMATION_BUILDER_ROUTE} from './routes';
import AppShell from './appShell';
import HelloWorld from '../workflow/HelloWorld';
import {BrowserRouter, Switch} from 'react-router-dom';
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";
import {Provider} from 'react-redux';
import createAutomationStore from './store';

import AutomationBundleLoader from '../locales/automationBundleLoader';

// init the localization services
AutomationBundleLoader.changeLocale('en-us'); // todo: LocaleHack - need to figure out how to get to: config.locale.default

const store = createAutomationStore();

const routes = [
    {
        path: AUTOMATION_APP_ROUTE,
        component: AppShell,
        routes: [
            {
                path: AUTOMATION_BUILDER_ROUTE,
                component: HelloWorld
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
                        RouteWithSubRoutes(route, i)
                    )
                )}
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('content'));
