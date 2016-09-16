import React, {PropTypes} from 'react';
import _ from 'lodash';
import UniqueIdMixin from 'unique-id-mixin';

import './checkbox.scss';
/**
 * checkbox cell editor
 */
const CheckBoxFieldValueEditor = React.createClass({
    displayName: 'CheckBoxFieldValueEditor',
    mixins: [UniqueIdMixin],
    propTypes: {
        value: PropTypes.bool,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        label: PropTypes.string,
        id: PropTypes.string,
        isInvalid: PropTypes.bool
    },

    getDefaultProps() {
        return {
            value: false,
            label: ' ',
            isInvalid: false
        };
    },

    onChange(ev) {
        const newValue = ev.target.checked;
        if(this.props.onChange){
            this.props.onChange(newValue);
        }
    },

    hasLabel() {
        return (this.props.label !== ' ');
    },

    renderLabel() {
        if(this.hasLabel()) {
            return (
                <label className="label" htmlFor={this.getNextHtmlFor()}>
                    {this.props.label}
                </label>
            );
        }
    },

    render() {
        let classes = "checkbox editor";
        classes += (this.hasLabel() ? ' hasLabel' : '');

        return (
            <div className={classes}>
                <input id={this.getNextHtmlFor()}
                       ref="fieldInput"
                       type="checkbox"
                       onChange={this.onChange}
                       onBlur={this.props.onBlur}
                       tabIndex="0"
                       className="filled-in"
                       defaultChecked={this.props.value} // react requirement
                              />
                <label className="label" htmlFor={this.getNextHtmlFor()}>
                    {this.props.label}
                </label>
            </div>
        );
    }
});

export default CheckBoxFieldValueEditor;
