import React from 'react';
import {Route} from 'react-router-dom';
import _ from 'lodash';

const RouteWithSubRoutes = (route, key, extraProps) => {
    let exact = _.get(route, 'exact', false) ? {exact:true} : {}; // include exact true only if specified to be exact
    return (
        <Route key={key}  path={route.path}
            {...exact}
            location={route.location}
            render={props => {
                // pass the sub-routes down to keep nesting routes
                // props (history, location, match) get passed to all routes on render,
                // and add any additional props setup in extraProps
                return <route.component {...props} routes={route.routes} {...extraProps} />;
            }}
        />);
};

export default RouteWithSubRoutes;

