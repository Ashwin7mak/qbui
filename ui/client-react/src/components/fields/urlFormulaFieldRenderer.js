import React, {PropTypes} from 'react';

/**
 * # UrlFormulaFieldRenderer
 *
 * Renders url formula field values
 */
const UrlFormulaFieldRenderer = React.createClass({
    displayName: 'UrlFormulaFieldRenderer',
    propTypes: {
        value: PropTypes.string,
        display: PropTypes.string,
    },
    getDefaultProps() {
        return {
            display: '',
            value: null
        };
    },
    render() {
        return (
            <div>
                Url Formula Field
            </div>
        );
    }
});

export default UrlFormulaFieldRenderer;
