import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import * as durationFormatter from '../../../../common/src/formatter/durationFormatter';
import ErrorWrapper from './errorWrapper';

const DurationFieldValueEditor = React.createClass({
    displayName: 'DurationFieldValueEditor',
    propTypes: {
        /**
         * the raw value to be saved */
        value: React.PropTypes.string,
        /**
         * the display to render */
        display: React.PropTypes.any,
        /**
         * the class to use */
        classes: React.PropTypes.string,
        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,
        /**
         * field attributes
         */
        attributes: React.PropTypes.object,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: React.PropTypes.func,

    },
    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev);
        }
    },
    onBlur() {
        let value = durationFormatter.onBlurParsing(this.props.value, this.props.attributes);
        let theVals = {
            value: value || this.props.value
        };
        theVals.display = durationFormatter.format(theVals, this.props.attributes);
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },
    render() {
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        placeholder = durationFormatter.getPlaceholder(this.props.attributes);
        return  <TextFieldValueEditor classes={classes || ''}
                                      onChange={this.onChange}
                                      onBlur={this.onBlur}
                                      placeholder={placeholder || ''}
                                      value={display || ''}
                                      invalidMessage={this.props.invalidMessage || 'Error'}
                                      {...otherProps}/>;
    }
});

export default DurationFieldValueEditor;


