import React from 'react';
import './fields.scss';
import LimitConstants from '../../../../common/src/limitConstants';

export const TextFieldEditor = React.createClass({
//max input length = limitConstants. maxTextFieldValueLength
    propTypes: {
        ref: React.PropTypes.any,
        value: React.PropTypes.string.isRequired,
        classes: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired
    },

    onChange(ev) {
        this.props.onChange(ev.target.value);
    },

    render() {
        let classes = this.props.classes;
        classes += ' input textField';

        return <input ref={this.props.ref}
                      className={classes}
                      value={this.props.value}
                      type="text"
                      onChange={this.onChange}
        />;
    }
});

export default TextFieldEditor;
