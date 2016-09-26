import React, {PropTypes} from 'react';

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
    render() {
        return <TextFieldValueEditor {...this.props} />;
    }
});

export default UrlFieldValueEditor;
