import React from 'react';
import ReactIntl from 'react-intl';

import Fluxxor from 'fluxxor';
import AppsList from './appsList';

import './apps.css';

//  load the locale
import { Locale, getI18nBundle } from '../../locales/locales';
let i18n = getI18nBundle();

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppsHeader = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return <FormattedMessage message={this.getIntlMessage('apps.header')}/>
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
            <div className='apps-container'>
                <p><h4><AppsHeader {...i18n}/></h4></p>
                <AppsList {...i18n} data={this.state.apps}/>
            </div>
        );
    }
});

export default App;