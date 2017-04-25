/**
 * Created by rbeyer on 2/6/17.
 */
import React from 'react';
import AppProperties from './appProperties';

const AppPropertiesRoute = React.createClass({

    render() {
        return (
            <AppProperties appId={this.props.match.params.appId}
                           selectedApp={this.props.app}
            />
        );
    }

});

export default AppPropertiesRoute;
