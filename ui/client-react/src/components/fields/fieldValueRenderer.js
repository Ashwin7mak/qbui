import React from 'react';

import FieldFormats from '../../utils/fieldFormats';
import {MultiLineTextFieldValueRenderer, DateFieldValueRenderer,  NumberFieldValueRenderer, UserFieldValueRenderer} from './fieldValueRenderers';
import TextFieldValueRenderer from './textFieldValueRenderer';
import _ from 'lodash';

const FieldValueRenderer = React.createClass({
    displayName: 'FieldValueRenderer',

    propTypes: {
        display: React.PropTypes.any,
        value: React.PropTypes.any,
        attributes: React.PropTypes.object,
        isEditable: React.PropTypes.bool,
        type: React.PropTypes.number
    },

    getRendererForType(type, commonProperties, className) {
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

        let className =  (this.props.isEditable ? "" : " nonEditable");
        let commonProperties = {};
        if (_.has(this.props, 'this.props.attributes.clientSideAttributes.bold') &&
            this.props.attributes.clientSideAttributes.bold) {
            commonProperties.isBold = true;
            className += ' bold';
        }
        className += this.props.classes ? ' ' + this.props.classes : '';

        let renderedType = null;
        if (this.props.type) {
            renderedType =  this.getRendererForType(this.props.type, commonProperties, className);
        }
        /* render type specific */
        return <span className={className}>{renderedType}</span>;
    }
});
export default FieldValueRenderer;
