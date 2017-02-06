/**
 * Created by rbeyer on 2/6/17.
 */
import React, {PropTypes} from 'react';
import './appProperties.scss';

const AppProperties = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        app: PropTypes.object.isRequired
    },

    render() {
        return (
            <div>
                Duder
            </div>
        );
    }

});

export default AppProperties;