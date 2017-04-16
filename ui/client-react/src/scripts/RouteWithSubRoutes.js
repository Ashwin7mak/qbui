import React from 'react';
import {Route} from 'react-router-dom';
import _ from 'lodash';

const RouteWithSubRoutes = (routeConfig) => {
    let exact = _.get(routeConfig, 'exact', false) ? {exact:true} : {}; // include exact true if specified to be exact
    return (
        <Route path={routeConfig.path}
               {...exact}
               location={routeConfig.location}
                render={props => {
                    // pass the sub-routes down to keep nesting
                    // props (history, location, match) are passed to all routes ,
                    return <routeConfig.component {...props} {...routeConfig.props} routes={routeConfig.routes}/>;
                }}
        />);
};

export default RouteWithSubRoutes;

