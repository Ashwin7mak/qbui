import React from 'react';
import ReactIntl from 'react-intl';
import Locale from '../locales/locales';

import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

import Logger from '../utils/logger';
var logger = new Logger();

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedNumber = ReactIntl.FormattedNumber;
var FormattedDate = ReactIntl.FormattedDate;
var FormattedTime = ReactIntl.FormattedTime;
var FormattedRelative = ReactIntl.FormattedRelative;

// private constants
const I18N_MESSAGE = 10;
const I18N_NUMBER = 20;
const I18N_DATE = 30;
const I18N_TIME = 31;
const I18N_RELATIVE = 32;

var Display = React.createClass({
    mixins: [IntlMixin],
    render: function() {
        // message returned is as a string if the property type argument is invalid or undefined..
        switch (this.props.type) {
            case I18N_MESSAGE:
                return (<FormattedMessage {...this.props} message={this.getIntlMessage(this.props.message)}/>);
            case I18N_NUMBER:
                return (<FormattedNumber {...this.props}/>);
            case I18N_DATE:
                return (<FormattedDate {...this.props} />);
            case I18N_TIME:
                return (<FormattedTime {...this.props}/>);
            case I18N_RELATIVE:
                return (<FormattedRelative {...this.props}/>);
            default:
                logger.warn('Invalid/undefined i18n property type.  Returning as a FormattedMessage.  Input properties: ' + JSON.stringify(this.props.i18nProps));
        }

        return (<FormattedMessage {...this.props} message={this.getIntlMessage(this.props.message)}/>);
    }
});

export var I18nDate = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState()
        };
    },

    render: function() {
        const i18n = Locale.getI18nBundle();
        return (<Display {...i18n} {...this.props} type={I18N_DATE}/>);
    }
});

export var I18nMessage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore')],
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState()
        };
    },
    render: function() {
        const i18n = Locale.getI18nBundle();
        return (<Display {...i18n} {...this.props} type={I18N_MESSAGE}/>);
    }
});

export var I18nNumber = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore')],
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState()
        };
    },
    render: function() {
        const i18n = Locale.getI18nBundle();
        return (<Display {...i18n} {...this.props} type={I18N_NUMBER}/>);
    }
});

export var I18nTime = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore')],
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState()
        };
    },
    render: function() {
        const i18n = Locale.getI18nBundle();
        return (<Display {...i18n} {...this.props} type={I18N_TIME}/>);
    }
});

export var I18nRelative = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore')],
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState()
        };
    },
    render: function() {
        const i18n = Locale.getI18nBundle();
        return (<Display {...i18n} {...this.props} type={I18N_RELATIVE}/>);
    }
});

