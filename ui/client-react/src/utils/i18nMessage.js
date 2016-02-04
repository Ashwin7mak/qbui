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

var DisplayI18n = React.createClass({
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

//  Instead of creating a mixin to handle the flux lifecycle events needed in each i18n component(Date, Number, etc),
//  created a wrapper class to handle the events and render the component that is passed as a parameter.
class I18nFlux {

    static renderMessage(Component) {

        const fluxState = React.createClass({
            mixins: [FluxMixin, StoreWatchMixin('NavStore')],
            getStateFromFlux() {
                let flux = this.getFlux();

                return {
                    nav: flux.store('NavStore').getState()
                };
            },
            render() {
                const i18n = Locale.getI18nBundle();
                return (<Component {...i18n} {...this.props}/>);
            }
        });
        return fluxState;
    }
}

//  Render a date using current locale setting
var I18nDate = I18nFlux.renderMessage(
    React.createClass({
        render: function() {
            // convert dash delimited dates to slash delimited for FireFox
            let value = this.props.value.replace(/-/g, '/');
            return (<DisplayI18n {...this.props} value={value} type={I18N_DATE}/>);
        }
    })
);

//  Render a string message using current locale setting
var I18nMessage = I18nFlux.renderMessage(

    React.createClass({
        render: function() {
            return (<DisplayI18n {...this.props} type={I18N_MESSAGE}/>);
        }
    })
);

//  Render a number using current locale setting
var I18nNumber = I18nFlux.renderMessage(
    React.createClass({
        render: function() {
            return (<DisplayI18n {...this.props} type={I18N_NUMBER}/>);
        }
    })
);

//  Render time using current locale setting
var I18nTime = I18nFlux.renderMessage(
    React.createClass({
        render: function() {
            return (<DisplayI18n {...this.props} type={I18N_TIME}/>);
        }
    })
);

var I18nRelative = I18nFlux.renderMessage(
    React.createClass({
        render: function() {
            return (<DisplayI18n {...this.props} type={I18N_RELATIVE}/>);
        }
    })
);

//  export the 5 support i18n data types
export {I18nMessage, I18nDate, I18nTime, I18nNumber, I18nRelative};

