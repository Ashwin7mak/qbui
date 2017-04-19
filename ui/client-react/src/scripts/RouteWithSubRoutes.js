import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import _ from 'lodash';

const RouteWithSubRoutes = (route, key, extraProps) => {
    let exact = _.get(route, 'exact', false) ? {exact:true} : {}; // include exact true if specified to be exact
    return (
        <Route key={key}  path={route.path}
            {...exact}
            location={route.location}
            render={props => {
                // pass the sub-routes down to keep nesting
                // props (history, location, match) are passed to all routes ,
                // and add any additional props in extraProps
                return <route.component {...props} routes={route.routes} {...extraProps} />;
            }}
        />);
};

export default RouteWithSubRoutes;

