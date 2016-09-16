import React, {PropTypes} from 'react';
import './checkbox.scss';
/**
 * checkbox cell editor
 */
const CheckBoxFieldValueEditor = React.createClass({
    displayName: 'CheckBoxFieldValueEditor',

    propTypes: {
        value: PropTypes.bool,
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    },

    getDefaultProps() {
        return {
            value: false
        };
    },

    onChange(ev) {
        const newValue = ev.target.checked;
        this.props.onChange(newValue);
    },

    render() {

        return <input ref="fieldInput"
                      type="checkbox"
                      onChange={this.onChange}
                      onBlur={this.props.onBlur}
                      tabIndex="0"
                      defaultChecked={this.props.value} // react requirement
        />;
    }
});

export default CheckBoxFieldValueEditor;
