import React from 'react';

import Fluxxor from 'fluxxor';
import AppsList from './appsList';
import './apps.css';
import {I18nMessage} from '../../utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppsHeader = React.createClass({

    render: function() {
        return <I18nMessage message={'apps.header'}/>;
    }
});

var App = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("AppsStore")],

    getStateFromFlux: function() {
        let flux = this.getFlux();
        return {
            apps: flux.store("AppsStore").getState(),
        };
    },


    render: function() {
        return (
            <div className="apps-container">
                <h4><AppsHeader /></h4>
                <AppsList data={this.state.apps}/>
            </div>
        );
    }
});

export default App;
