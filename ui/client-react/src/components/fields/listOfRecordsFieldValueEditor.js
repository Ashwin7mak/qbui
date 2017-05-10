import React, {PropTypes} from 'react';
import Locales from "../../locales/locales";

import TextFieldValueEditor from './textFieldValueEditor';

/**
 * # ListOfRecordsFieldValueEditor
 *
 * A placeholder for an embedder report field
 *
 */
const ListOfRecordsFieldValueEditor = React.createClass({
    displayName: 'ListOfRecordsFieldValueEditor',
    propTypes: {

        /**
         * The value of the URL (e.g., https://quickbase.com).
         * **Note:** The display prop is set dynamically based on the value. */
        value: PropTypes.string,

        onBlur: PropTypes.func,

        /**
         * A boolean to disabled field on form builder
         */
        isDisabled: React.PropTypes.bool,

        /** Optional prop to pass in placeholder text. Defaults to: 'name@domain.com' (internationalized). */
        placeholder: PropTypes.string
    },
    getDefaultProps() {
        return {
            value: ''
        };
    },
    onBlur(updatedValues) {
        // Format the displayed url before passing up to the parent
        // updatedValues.display = UrlFileAttachmentReportLinkFormatter.format(updatedValues, (this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : null));
        // if (this.props.onBlur) {
        //     this.props.onBlur(updatedValues);
        // }
    },
    render() {
        let {value, display, onBlur, placeholder, ...otherProps} = this.props;

        return <TextFieldValueEditor inputType="url"
                                     value={value}
                                     placeholder={(this.props.placeholder || Locales.getMessage('placeholder.url'))}
                                     onBlur={this.onBlur}
                                     showClearButton={!this.props.isDisabled}
                                     {...otherProps} />;
    }
});

export default ListOfRecordsFieldValueEditor;
