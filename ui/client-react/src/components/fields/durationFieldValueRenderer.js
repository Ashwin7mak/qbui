import React from 'react';
import './fields.scss';
import {DURATION_CONSTS} from '../../../../common/src/constants';
import durationFormatter from '../../../../common/src/formatter/durationFormatter';
import Locale from '../../locales/locales';
import {I18nMessage, I18nNumber, IntlNumberOnly} from '../../utils/i18nMessage';

/**
 * # DurationFieldValueRenderer
 *
 * A read only rendering of a duration value. The value is a millisecond number which
 * is rendered according to the defined scale attribute. `classes` can be optionally passed in for
 * custom styling. `includeUnits` also can be set to true to include the units with the
 * formatted value. includeUnits only applies to scales that are not Smart Units and
 * not time (hh:mm:ss) formatted scale types. Smart units always include the units when formatted.
 */
const DurationFieldValueRenderer = React.createClass({
    displayName: 'DurationFieldValueRenderer',
    propTypes: {
        /**
         *  raw duration value in milliseconds */
        value: React.PropTypes.number,

        /**
         *  optional, specifies the value for display,
         *  uses this value instead of formatting supplied value
         *  unless the scale is smartunits then the
         *  value is formatted and resulting units localized  */
        display: React.PropTypes.string,

        /**
         *  optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * optional include the units string with display value  */
        includeUnits:  React.PropTypes.bool,

        /**
         *  field attributes {scale : '...'} see ../common/src/constants.js
         *
         *  Choices for scale are :
         * -   'Smart Units',
         * -   'Weeks',
         * -   'Days',
         * -   'Hours',
         * -   'Minutes',
         * -   'Seconds'
         * -   ':HH:MM',
         * -   ':HH:MM:SS',
         * -   ':MM',
         * -   ':MM:SS'
         **/
        attributes: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            classes: null,
            includeUnits : false,
            attributes : {scale:DURATION_CONSTS.SMART_UNITS}
        };
    },

    /**
     * Renders a formatted duration field.
     */
    render() {
        let classes = 'durationCell data';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        // use display value if passed in, otherwise format the value based on the field attributes
        let display = this.props.display;

        // get the normalized format options
        let opts = durationFormatter.generateFormat(this.props.attributes);

        let fieldInfo = Object.assign({}, this.props.attributes);
        let formattedObj = {};
        if (opts.scale === DURATION_CONSTS.SMART_UNITS) {
            // request the formatter fill in a deconstructed formatted value for localizing smartunits
            // by extending the field info with formattedObj
            fieldInfo = Object.assign({}, fieldInfo, {formattedObj});
        }

        //format the value based on the field attributes
        //since the units are dynamic for smart units
        //it need to get formatted and destructured(string and units) for localizing
        //server side rendered display value is not localized
        if (opts.scale === DURATION_CONSTS.SMART_UNITS || !display) {
            display = durationFormatter.format({value: this.props.value}, fieldInfo);
        }

        // for smart units localize the units
        let durationNumberIntl = {maximumFractionDigits:opts.decimalPlaces};
        if (opts.scale === DURATION_CONSTS.SMART_UNITS) {
            if (formattedObj.units) {
                let numberValue = IntlNumberOnly(Locale.getLocale(), durationNumberIntl, Number(formattedObj.string));
                display = <I18nMessage message={"durationWithUnits." + formattedObj.units}
                                       value={numberValue}/>;
            }
        } else if (!this.props.display) {
            if (durationFormatter.hasUnitsText(opts.scale)) {
                if (this.props.includeUnits) {
                    let numberValue = IntlNumberOnly(Locale.getLocale(), durationNumberIntl, Number(display));
                    display = <I18nMessage message={"durationWithUnits." + opts.scale}
                                           value={numberValue}/>;
                } else {
                    display = <I18nNumber value={display}
                                          maximumFractionDigits={opts.decimalPlaces}/>;
                }
            }
        }
        return <div className={classes}>{display}</div>;
    }
});


export default DurationFieldValueRenderer;
