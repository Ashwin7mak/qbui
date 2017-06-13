import React from "react";
import {render} from "react-dom";
import "react-fastclick";
import {GOVERNANCE_ACCOUNT_ROUTE, GOVERNANCE_ACCOUNT_USERS_ROUTE} from "./routes";
import GovernanceAppShell from "./governanceAppShell";
import AccountUsers from "../account/users/AccountUsersMain";
import {BrowserRouter, Switch} from "react-router-dom";
import RouteWithSubRoutes from "../../../client-react/src/scripts/RouteWithSubRoutes";
import {Provider} from "react-redux";
import createGovernanceStore from "./store";

const store = createGovernanceStore();

const routes = [
    {
        path: GOVERNANCE_ACCOUNT_ROUTE,
        component: GovernanceAppShell,
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
                    RouteWithSubRoutes(route, i)
                    )
                )}
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('content'));
