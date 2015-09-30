import React from 'react';
import ReactIntl from 'react-intl';

import Fluxxor from 'fluxxor';
import AppsList from './appsList';

//  load the locale
import { Locale, getI18nBundle } from '../../locales/locales';
let i18n = getI18nBundle();

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var App = React.createClass( {
    mixins: [FluxMixin, StoreWatchMixin("AppsStore")],

    getStateFromFlux: function (){
        var flux = this.getFlux();
        return {
            apps: flux.store("AppsStore").getState(),
        };
    },

    render: function() {
        return (
            <div>
                <p><h4>Your QuickBase Applications</h4></p>
                <AppsList {...i18n} data={this.state.apps}/>
            </div>
        );
    }
});

export default App;