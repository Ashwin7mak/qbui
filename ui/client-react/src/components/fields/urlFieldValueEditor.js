import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';

const UrlFieldValueEditor = React.createClass({
    displayName: 'UrlFieldValueEditor',

    propTypes: {
        value: PropTypes.string,
        display: PropTypes.string,
        isInvalid: PropTypes.bool,
        required: PropTypes.bool,
        classes: PropTypes.string,
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    },

    render() {
        return <TextFieldValueEditor {...this.props} />;
    }
});

export default UrlFieldValueEditor;
