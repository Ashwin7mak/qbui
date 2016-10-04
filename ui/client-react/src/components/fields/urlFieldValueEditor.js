import React, {PropTypes} from 'react';

import UrlFileAttachmentReportLinkFormatter from '../../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import TextFieldValueEditor from './textFieldValueEditor';

/**
 * # UrlFieldValueRenderer
 *
 * A wrapper for textFieldValueEditor with settings to help edit (and format edited) URLs.
 *
 */
const UrlFieldValueEditor = React.createClass({
    displayName: 'UrlFieldValueEditor',
    propTypes: {

        /**
        * The value of the URL (e.g., https://quickbase.com).
        * **Note:** The display prop is set dynamically based on the value. */
        value: PropTypes.string,

        onBlur: PropTypes.func
    },
    getDefaultProps() {
        return {
            value: ''
        };
    },
    onBlur(updatedValues) {
        // Format the displayed url before passing up to the parent
        updatedValues.display = UrlFileAttachmentReportLinkFormatter.format(updatedValues, this.props.fieldDef.datatypeAttributes);
        if (this.props.onBlur) {
            this.props.onBlur(updatedValues);
        }
    },
    render() {
        let {value, display, onBlur, ...otherProps} = this.props;

        return <TextFieldValueEditor inputType="url"
                                     value={value}
                                     placeholder="www.example.com"
                                     onBlur={this.onBlur}
                                     {...otherProps} />;
    }
});

export default UrlFieldValueEditor;
