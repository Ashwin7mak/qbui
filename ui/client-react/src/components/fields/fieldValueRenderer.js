import React from 'react';
import _ from 'lodash';

import FieldFormats from '../../utils/fieldFormats';
import CheckBoxFieldValueRenderer from './checkBoxFieldValueRenderer';
import DateTimeFieldValueRenderer from './dateTimeFieldValueRenderer';
import MultiLineTextFieldValueRenderer from './multiLineTextFieldValueRenderer';
import NumericFieldValueRenderer from './numericFieldValueRenderer';
import TextFieldValueRenderer from './textFieldValueRenderer';
import TimeFieldValueRenderer from './timeFieldValueRenderer';
import UserFieldValueRenderer from './userFieldValueRenderer';

/**
 * # FieldValueRenderer
 *
 *
 * This wraps the various field renderer components. It contains a renderer for a field defined by type and the value
 * and optional formatted display property supplied.
 *
 * This wrapper handles the external common field editor rendering.
 *
 *  */
const FieldValueRenderer = React.createClass({
    displayName: 'FieldValueRenderer',

    propTypes: {
        /**
         * the raw value */
        value: React.PropTypes.any,

        /**
         * optional additional classes to customize styling */
        classes: React.PropTypes.string,

        /**
         * a field data type see ../../utils/fieldFormats defaults to text
         * - TEXT_FORMAT = 1;
         * - NUMBER_FORMAT = 2;
         * - DATE_FORMAT = 3;
         * - DATETIME_FORMAT = 4;
         * - TIME_FORMAT = 5;
         * - CHECKBOX_FORMAT = 6;
         * - USER_FORMAT = 7;
         * - CURRENCY_FORMAT = 8;
         * - PERCENT_FORMAT = 9;
         * - RATING_FORMAT = 10;
         * - DURATION_FORMAT = 11;
         * - PHONE_FORMAT = 12;
         * - MULTI_LINE_TEXT_FORMAT = 13;
         **/
        type: React.PropTypes.number,

        /**
         * the formatted value */
        display: React.PropTypes.any,

        /**
         * the datatypeAttributes for the field see  https://github.com/QuickBase/QuickBase/tree/master/apiModels/src/main/java/com/quickbase/api/models/field/attributes*/
        attributes: React.PropTypes.object,

        /**
         * identifier suffix for key */
        idKey : React.PropTypes.any
    },

    getDefaultProps() {
        return {
            type : FieldFormats.TEXT_FORMAT
        };
    },

    getRendererForType(commonProperties) {
        switch (this.props.type) {
        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        case FieldFormats.RATING_FORMAT: {
            let rendered = <NumericFieldValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                              attributes={this.props.attributes}
                                              key={'nfvr-' + this.props.idKey}
                                              {...commonProperties}/>;
            return (rendered);
        }
        case FieldFormats.USER_FORMAT:
            return (
                    <UserFieldValueRenderer value={this.props.value} display={this.props.display}
                                            key={'ufvr-' + this.props.idKey}
                                            {...commonProperties}/>
                );
        //  Date and dateTime use the same view formatter
        case FieldFormats.DATE_FORMAT:
        case FieldFormats.DATETIME_FORMAT:
            return (
                <DateTimeFieldValueRenderer value={this.props.value}
                                            attributes={this.props.attributes}
                                            key={'dfvr-' + this.props.idKey}
                    {...commonProperties}/>
            );
        case FieldFormats.TIME_FORMAT:
            return (
                    <TimeFieldValueRenderer value={this.props.value}
                                            attributes={this.props.attributes}
                                            key={'dfvr-' + this.props.idKey}
                                                {...commonProperties}/>
                );
        case FieldFormats.CHECKBOX_FORMAT:
            return (
                    <CheckBoxFieldValueRenderer value={this.props.value}
                                                key={'inp-' + this.props.idKey}
                                                hideUncheckedCheckbox={this.props.hideUncheckedCheckbox}
                                                {...commonProperties} />
                );

        case FieldFormats.MULTI_LINE_TEXT_FORMAT:
            return (
                    <MultiLineTextFieldValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                                     attributes={this.props.attributes}
                                                     key={'mltfvr-' + this.props.idKey}
                                                 {...commonProperties}/>
                );

        case FieldFormats.TEXT_FORMAT:
        case FieldFormats.PERCENT_FORMAT:
        case FieldFormats.DURATION_FORMAT:
        default: {
            return (
                    <TextFieldValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                            attributes={this.props.attributes}
                                            key={'tfvr-' + this.props.idKey}
                                            {...commonProperties}/>
                );
        }
        }
    },

    addDisplayAttributesToCommonProperties(commonProperties) {
        if (_.has(this.props, 'attributes.clientSideAttributes')) {
            let attributes = this.props.attributes.clientSideAttributes;
            commonProperties.isBold = attributes.bold;
            commonProperties.displayGraphic = attributes.display_graphic;
        }

        return commonProperties;
    },

    render() {
        let commonProperties = {};
        commonProperties.idKey = this.props.idKey;
        this.addDisplayAttributesToCommonProperties(commonProperties);

        let className = "";
        className += this.props.classes ? ' ' + this.props.classes : '';
        className += commonProperties.isBold ? ' bold' : '';

        let renderedType =  this.getRendererForType(commonProperties);

        /* render type  */
        return <span className={className}>{renderedType}</span>;
    }
});

export default FieldValueRenderer;
