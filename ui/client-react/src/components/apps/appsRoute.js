import React from 'react';

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);

import M5AppHomePage from '../app/m5AppHomePage';

/**
 * placeholder for my apps route
 */
let AppsRoute = React.createClass({
    mixins: [FluxMixin],

    componentDidMount() {
        // no title for now...
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();
    },
    render: function() {
        return <M5AppHomePage />;
    }
});

export default AppsRoute;
