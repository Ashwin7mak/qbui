import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import {DURATION_CONSTS} from '../../../../common/src/constants';
import * as durationFormatter from '../../../../common/src/formatter/durationFormatter';
import * as durationEditorParsing from './durationEditorParsing';

/**
 * # DurationFieldValueEditor
 *
 * An editor that allows a user to edit a duration value. The value is a millisecond number which
 * is rendered in the input box according to the defined scale attribute. Users can input different numeric
 * values and scales. Some examples of valid inputs are the following:
 * 1 week
 * 1 week 2 days
 * 10:10:10
 * ::90
 * `classes` can be optionally passed in for custom styling. `includeUnits` also can be set to true to include
 * the units with the formatted value. includeUnits only applies to scales that are not Smart Units and
 * not time (hh:mm:ss) formatted scale types. Smart units always include the units when formatted.
 */
const DurationFieldValueEditor = React.createClass({
    displayName: 'DurationFieldValueEditor',
    propTypes: {
        /**
         * the raw value to be saved */
        value: React.PropTypes.number,
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
    onBlur(ev) {
        let parseResult = durationEditorParsing.onBlurParsing(ev.value, this.props.attributes);
        let theVals = {};
        if (parseResult.valid === false) {
            //Clientside validator needs the value, in order to throw an error
            theVals.value = parseResult.value;
            theVals.display = parseResult.value;
        } else {
            theVals.value = parseResult.value;
            theVals.display = durationFormatter.format(theVals, this.props.attributes);

        }
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },
    render() {
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        let defaultPlaceholder = durationEditorParsing.getPlaceholder(this.props.attributes);
        if (this.props.attributes && this.props.attributes.scale !== DURATION_CONSTS.SMART_UNITS) {
            classes = 'rightAlignInlineEditNumberFields ' + classes;
        }
        return  <TextFieldValueEditor classes={classes || ''}
                                      onChange={this.onChange}
                                      onBlur={this.onBlur}
                                      placeholder={placeholder || defaultPlaceholder}
                                      value={display || value}
                                      invalidMessage={this.props.invalidMessage || 'Error'}
                                      {...otherProps}/>;
    }
});

export default DurationFieldValueEditor;


