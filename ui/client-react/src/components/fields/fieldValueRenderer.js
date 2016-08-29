import React from 'react';

import FieldFormats from '../../utils/fieldFormats';
import {MultiLineTextFieldValueRenderer, DateFieldValueRenderer,  NumberFieldValueRenderer, UserFieldValueRenderer} from './fieldValueRenderers';
import TextFieldValueRenderer from './textFieldValueRenderer';
import _ from 'lodash';

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
        attributes: React.PropTypes.object

    },

    getDefaultProps() {
        return {
            type : FieldFormats.TEXT_FORMAT
        };
    },

    getRendererForType(type, commonProperties) {
        switch (type) {
        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT: {
            let rendered = this.props.value ?
                    <NumberFieldValueRenderer value={this.props.value}
                                              attributes={this.props.attributes}
                                              {...commonProperties}/> :
                         null;
            return (rendered);
        }
        case FieldFormats.USER_FORMAT:
            return (
                    <UserFieldValueRenderer value={this.props.display}
                                            {...commonProperties}/>
                );

        case FieldFormats.DATE_FORMAT:
            return (
                    <DateFieldValueRenderer value={this.props.display}
                                        {...commonProperties}/>
                );

        case FieldFormats.DATETIME_FORMAT: {
            return (
                    <DateFieldValueRenderer value={this.props.display}
                                            {...commonProperties}/>
                );
        }

        case FieldFormats.TIME_FORMAT: {
            return (
                    <DateFieldValueRenderer value={this.props.display}
                                            {...commonProperties}/>
                );
        }
        case FieldFormats.CHECKBOX_FORMAT:
            return (
                    <input type="checkbox" disabled checked={this.props.value}/>
                );

        case FieldFormats.MULTI_LINE_TEXT_FORMAT:
            return (
                    <MultiLineTextFieldValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                                 {...commonProperties}/>
                );

        case FieldFormats.TEXT_FORMAT:
        case FieldFormats.PERCENT_FORMAT:
        case FieldFormats.DURATION_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        default: {
            return (
                    <TextFieldValueRenderer value={this.props.display ? this.props.display : this.props.value}
                                            attributes={this.props.attributes}
                                            {...commonProperties}/>
                );
        }
        }
    },

    render() {

        let className = "";
        let commonProperties = {};
        if (_.has(this.props, 'attributes.clientSideAttributes.bold') &&
            this.props.attributes.clientSideAttributes.bold) {
            commonProperties.isBold = true;
            className += ' bold';
        }
        className += this.props.classes ? ' ' + this.props.classes : '';

        let renderedType =  this.getRendererForType(this.props.type, commonProperties, className);

        /* render type  */
        return <span className={className}>{renderedType}</span>;
    }
});

export default FieldValueRenderer;
