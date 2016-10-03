import React, {PropTypes} from 'react';

import UrlFileAttachmentReportLinkFormatter from '../../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import TextFieldValueEditor from './textFieldValueEditor';

const UrlFieldValueEditor = React.createClass({
    displayName: 'UrlFieldValueEditor',
    propTypes: {
        /*
        * The value of the URL (e.g., https://quickbase.com) */
        value: PropTypes.string,

        /*
        * Which protocols are allowed for a URL (e.g., HTTP, HTTPS. FTP, etc.).
        * By default anything allowed. */
        allowedProtocols: PropTypes.array
    },
    getDefaultProps() {
        return {
            value: '',
            allowedProtocols: []
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
