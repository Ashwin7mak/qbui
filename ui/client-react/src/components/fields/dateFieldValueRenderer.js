import React from 'react';
import './fields.scss';
import _ from 'lodash';
/**
 * # DateFieldValueRenderer
 *
 * A DateFieldValueRenderer is a read only rendering of the field containing a single date. The date
 * value is rendered according to display attributes and classes can be optionally passed in for custom styling.
 */
const DateFieldValueRenderer = React.createClass({
    displayName: 'DateFieldValueRenderer',
    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.string,

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

        return <div className={classes}>{this.props.value}</div>;
    }
});


export default DateFieldValueRenderer;
