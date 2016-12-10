import React from 'react';
import './fields.scss';
import _ from 'lodash';
import {DURATION_CONSTS} from '../../../../common/src/constants';
import durationFormatter from '../../../../common/src/formatter/durationFormatter';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';

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
         *  optionally overrides value a hardcoded display value */
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

        //  use display value if passed in, otherwise format the value based on the field attributes
        let display = this.props.display;

        // get the normalized format options
        let opts = durationFormatter.generateFormat(this.props.attributes);
        let fieldInfo = Object.assign({}, this.props.attributes);

        let formattedObj = {};
        if (opts.scale === DURATION_CONSTS.SMART_UNITS) {
            // request the formatter fill in a deconstructed formatted value for localizing smartunits
            // by adding formattedObj with the field info
            fieldInfo = Object.assign({}, fieldInfo, {formattedObj});
        }

        //smart units get formatted and destructured for localizing
        if (opts.scale === DURATION_CONSTS.SMART_UNITS || !display) {
            display = durationFormatter.format({value: this.props.value}, fieldInfo);
        }

        // for smart units localize the units
        if (opts.scale === DURATION_CONSTS.SMART_UNITS) {
            if (formattedObj.units) {
                display = <I18nMessage message={"durationWithUnits." + formattedObj.units}
                                       value={formattedObj.string}/>;
            }
        } else if (this.props.includeUnits) {
            // get the units key if this format type has one and its requested
            // map key to the localized units
            if (opts && durationFormatter.hasUnitsText(opts.scale)) {
                display = <I18nMessage message={"durationWithUnits." + opts.scale} value={display}/>;
            }
        }

        return <div className={classes}>{display}</div>;
    }
});


export default DurationFieldValueRenderer;
