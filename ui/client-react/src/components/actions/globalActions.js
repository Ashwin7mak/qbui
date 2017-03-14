import React, {PropTypes, Component} from 'react';
import Fluxxor from "fluxxor";

/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/
import ReDefaultTopNavGlobalActions from '../../../../reuse/client/src/components/reTopNav/reDefaultTopNavGlobalActions';

let FluxMixin = Fluxxor.FluxMixin(React);

const GlobalActions = React.createClass({
    mixins: [FluxMixin],

    changeLocale: function(locale) {
        let flux = this.getFlux();
        flux.actions.changeLocale(locale);
    },

    render() {
        return <ReDefaultTopNavGlobalActions changeLocale={this.changeLocale} {...this.props} />;
    }
});

export default GlobalActions;
