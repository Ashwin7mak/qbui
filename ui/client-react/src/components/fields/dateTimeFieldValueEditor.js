import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import DateFieldValueEditor from './dateFieldValueEditor';
import TimeFieldValueEditor from './timeFieldValueEditor';

/**
 * # DateTimeFieldValueEditor
 *
 * An editable rendering of a date time field. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

const DateTimeFieldValueEditor = React.createClass({
    displayName: 'DateTimeFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the date component */
        value: React.PropTypes.string,

        /* the display value to fill in the date component */
        display: React.PropTypes.string,

        /**
         * renders with red border if true */
        isInvalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when isInvalid */
        invalidMessage: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        idKey: React.PropTypes.any
    },

    render() {
        return <div>
            <DateFieldValueEditor classes={'dateTimeCell'} id={this.props.idKey} {...this.props}/><TimeFieldValueEditor classes={'dateTimeCell'} id={this.props.idKey} {...this.props} />
        </div>;
    }

});

export default DateTimeFieldValueEditor;
