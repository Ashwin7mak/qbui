import React from 'react';

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * placeholder for my apps route
 */
let AppsRoute = React.createClass({
    mixins: [FluxMixin],

    componentDidMount() {
        // no title for now...
        let flux = this.getFlux();
        flux.actions.setTopTitle();
    },
    render: function() {

        return (<div>
            <div>Apps go here...</div>
        </div>);
    }
});

export default AppsRoute;
