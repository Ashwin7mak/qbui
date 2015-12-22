import React from 'react';

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * placeholder for my apps route
 */
let AppsRoute = React.createClass({
    mixins: [FluxMixin],

    contextTypes: {
        breakpoint: React.PropTypes.string
    },
    render: function() {

        return (<div>
            <div>Apps go here... {this.context.breakpoint}</div>
        </div>);
    }
});

export default AppsRoute;
