import React from 'react';
import './fields.scss';
import _ from 'lodash';
import {DURATION_CONSTS} from '../../../../common/src/constants';
import durationFormatter from '../../../../common/src/formatter/durationFormatter';
import {I18nMessage} from '../../utils/i18nMessage';

/**
 * # DurationFieldValueRenderer
 *
 * A read only rendering of a duration value. The value is rendered according to the
 * display attributes defined durationFormatter.  Classes can be optionally passed in for
 * custom styling.
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
        let display = this.props.display ? this.props.display :
                    durationFormatter.format({value: this.props.value}, this.props.attributes);

        if (this.props.includeUnits) {
            let opts = durationFormatter.generateFormat(this.props.attributes);
            if (opts && durationFormatter.hasUnitsText(opts.scale)) {
                display = <I18nMessage message={"durationWithUnits." + opts.scale} value={display}/>;
            }
        }

        return <div className={classes}>{display}</div>;
    }
});


export default DurationFieldValueRenderer;
