import React from 'react';
import './fields.scss';
import _ from 'lodash';
import timeFormatter from '../../../../common/src/formatter/timeOfDayFormatter';

/**
 * # TimeFieldValueRenderer
 *
 * A read only rendering of a time value. The value is rendered according to the
 * display attributes defined timeFormatter.  Classes can be optionally passed in for
 * custom styling.
 */
const TimeFieldValueRenderer = React.createClass({
    displayName: 'TimeFieldValueRenderer',
    propTypes: {
        /**
         * the raw value */
        value: React.PropTypes.string,

        /* the display value */
        display: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * field attributes
         */
        attributes: React.PropTypes.object

    },

    getDefaultProps() {
        return {
            classes: null,
            attributes: {
                clientSideAttributes: {
                    bold: false
                }
            }
        };
    },

    /**
     * Renders a formatted time field.
     */
    render() {
        let classes = 'dateCell data';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        //  format the display value based on the field attributes
        let display = timeFormatter.format({value: this.props.value}, this.props.attributes);

        return <div className={classes}>{display}</div>;
    }
});


export default TimeFieldValueRenderer;
