import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import {DURATION_CONSTS} from '../../../../common/src/constants';
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
        value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        /**
         * the display to render */
        display: React.PropTypes.any,
        /**
         * A boolean to disabled field on form builder
         */
        isDisabled: React.PropTypes.bool,
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
    getInitialState() {
        return {
            display: this.props.display
        };
    },
    onChange(ev) {
        this.setState({display: ev});
        if (this.props.onChange) {
            this.props.onChange(ev);
        }
    },
    componentWillMount() {
        /**
         * componentWillMount is used for forms. Forms are required to have scales listed in the input box with the numeric value
         * this is also used for Smart Units, all smart units are required to have scales listed in the input box with the numeric value
         * */
        if (this.props.attributes && this.props.attributes.scale === DURATION_CONSTS.SCALES.SMART_UNITS) {
            this.setState({display: durationEditorParsing.includeUnitsInInput(this.props.display, this.props.attributes)});
        } else if (this.props.attributes && this.props.includeUnits) {
            this.setState({display: durationEditorParsing.includeUnitsInInput(this.props.display, this.props.attributes)});
        }
    },
    onBlur(ev) {
        let parseResult = durationEditorParsing.onBlurParsing(ev.value, this.props.attributes, this.props.includeUnits);
        let theVals = {
            value: parseResult.value,
            display: parseResult.display
        };
        this.setState({display: theVals.display});
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },
    render() {
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        classes = [classes || ''];
        let defaultPlaceholder = '';
        let displayZero;
        if (this.props.attributes) {
            defaultPlaceholder = durationEditorParsing.getPlaceholder(this.props.attributes.scale);
        }
        if (this.props.attributes && this.props.attributes.scale !== DURATION_CONSTS.SCALES.SMART_UNITS) {
            classes.push('rightAlignInlineEditNumberFields');
        }
        if (this.props.value === 0 && this.props.attributes.scale === DURATION_CONSTS.SCALES.SMART_UNITS) {
            displayZero = durationEditorParsing.includeUnitsInInput(this.props.value, this.props.attributes);
        } else {
            displayZero = this.props.value;
        }
        return  <TextFieldValueEditor classes={classes.concat('durationField').join(' ')}
                                      onChange={this.onChange}
                                      onBlur={this.onBlur}
                                      placeholder={placeholder || defaultPlaceholder}
                                      value={this.state.display || displayZero}
                                      invalidMessage={this.props.invalidMessage || ''}
                                      showClearButton={!this.props.isDisabled}
                                      {...otherProps}/>;
    }
});

export default DurationFieldValueEditor;
