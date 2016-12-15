import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import {DURATION_CONSTS} from '../../../../common/src/constants';
import * as durationFormatter from '../../../../common/src/formatter/durationFormatter';
import {I18nMessage, I18nNumber, IntlNumberOnly} from '../../utils/i18nMessage';

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
        let value = durationFormatter.onBlurParsing(ev.value, this.props.attributes);
        let theVals = {};
        if (value === null) {
            theVals.display = ev.value;
        } else {
            theVals.value = value;
            theVals.display = durationFormatter.format(theVals, this.props.attributes);
        }
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },
    render() {
        // console.log('includeUnits: ', this.props);
        // let display;
        // if (this.props.includeUnits) {
        //     let numberValue = IntlNumberOnly(Locale.getLocale(), durationNumberIntl, Number(display));
        //     display = <I18nMessage message={"durationWithUnits." + opts.scale}
        //                            value={numberValue}/>;
        // } else {
        //     display = <I18nNumber value={display}
        //                           maximumFractionDigits={opts.decimalPlaces}/>;
        // }
        let {value, display, onBlur, onChange, classes, placeholder, ...otherProps} = this.props;
        placeholder = durationFormatter.getPlaceholder(this.props.attributes);
        if (this.props.attributes && this.props.attributes.scale !== DURATION_CONSTS.SMART_UNITS) {
            classes = 'rightAlignInlineEditNumberFields ' + classes;
        }
        return  <TextFieldValueEditor classes={classes || ''}
                                      onChange={this.onChange}
                                      onBlur={this.onBlur}
                                      placeholder={placeholder || ''}
                                      value={display || value}
                                      invalidMessage={this.props.invalidMessage || 'Error'}
                                      {...otherProps}/>;
    }
});

export default DurationFieldValueEditor;


