import React from 'react';
import Fluxxor from "fluxxor";
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';

let FluxMixin = Fluxxor.FluxMixin(React);

const GlobalActions = React.createClass({
    mixins: [FluxMixin],

    changeLocale: function(locale) {
        let flux = this.getFlux();
        flux.actions.changeLocale(locale);
    },

    render() {
        return <DefaultTopNavGlobalActions
            changeLocale={this.changeLocale}
            shouldOpenMenusUp={this.props.position === 'left'}
            {...this.props}
        />;
    }
});

export default GlobalActions;
