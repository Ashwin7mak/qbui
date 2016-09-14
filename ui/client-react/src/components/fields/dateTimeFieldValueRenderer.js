import React from 'react';
import './fields.scss';
import _ from 'lodash';
import dateTimeFormatter from '../../../../common/src/formatter/dateTimeFormatter';

/**
 * # DateTimeFieldValueRenderer
 *
 * A read only rendering of a date or date/time value. The value is rendered according to
 * display attributes defined in the dateTimeFormatter.  Classes can be optionally passed in for
 * custom styling.
 */
const DateTimeFieldValueRenderer = React.createClass({
    displayName: 'DateTimeFieldValueRenderer',
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
     * Renders a date field
     *
     */
    render() {
        let classes = 'dateCell data';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        if (this.props.attributes.clientSideAttributes.bold === true) {
            classes += " bold";
        }

        //  it's possible that the field has been edited and we need to format
        let display = dateTimeFormatter.format({value: this.props.value}, this.props.attributes);

        return <div className={classes}>{display}</div>;
    }
});


export default DateTimeFieldValueRenderer;
