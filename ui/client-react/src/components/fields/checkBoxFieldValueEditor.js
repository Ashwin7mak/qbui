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
        onBlur: PropTypes.func,
        label: PropTypes.string
    },

    getDefaultProps() {
        return {
            value: false
        };
    },

    onChange(ev) {
        const newValue = ev.target.checked;
        if(this.props.onChange){
            this.props.onChange(newValue);
        }
    },

    hasLabel() {
        return (this.props.label && this.props.label.length);
    },

    renderLabel() {
        if(this.hasLabel()) {
            return (<label className="label">{this.props.label}</label>);
        }
    },

    render() {
        let classes = "checkbox editor";
        classes += (this.hasLabel() ? ' hasLabel' : '');

        return (
            <div className={classes}>
                <input ref="fieldInput"
                              type="checkbox"
                              onChange={this.onChange}
                              onBlur={this.props.onBlur}
                              tabIndex="0"
                              defaultChecked={this.props.value} // react requirement
                              />
                {this.renderLabel()}
            </div>
        );
    }
});

export default CheckBoxFieldValueEditor;
