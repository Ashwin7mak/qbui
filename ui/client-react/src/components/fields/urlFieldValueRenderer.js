import React, {PropTypes} from 'react';
import TextFieldValueRenderer from './textFieldValueRenderer';

const UrlFieldValueRenderer = React.createClass({
    displayName: 'UrlFieldValueRenderer',
    propTypes: {
        /*
        * The underlying value for the URL */
        value: PropTypes.string,

        /*
        * The value displayed to the user */
        display: PropTypes.string,

        /*
        * If true, clicking the link will open a new window/tab */
        openInNewWindow: PropTypes.bool,

        /*
        * If true, the link will be a button rather than a text link */
        showAsButton: PropTypes.bool,

        /*
        * If true, the link will be clickable. Otherwise, the link will only
        * appear as text */
        clickable: PropTypes.bool
    },
    getDefaultProps() {
        return {
            clickable: true,
            display: '',
            openInNewWindow: true,
            showAsButton: false,
            value: ''
        };
    },
    render() {
        return <TextFieldValueRenderer {...this.props} />;
    }
});

export default UrlFieldValueRenderer;
