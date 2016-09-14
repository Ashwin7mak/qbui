import React from 'react';

const MultiLineTextFieldValueRenderer = React.createClass({
    displayName: 'MultiLineTextFieldValueRenderer',

    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * renders bold if true */
        isBold: React.PropTypes.bool,

        /**
         * text field attributes
         */
        attributes: React.PropTypes.object

    },

    getDefaultProps() {
        return {
            isBold: false,
            classes: null,
            attributes: null
        };
    },

    /**
     * Renders the text field showing some allowed html if set in fields attributes
     *
     * Note: use of dangerouslySetInnerHTML is necessary to support the
     * 'html allowed' feature in text field supported in the current stack.
     * The text formatter field value should be encoded  via the textformatter so the value includes
     * only the allowed tags.
     *
     * We may decide to sunset this feature and add a rich text field type
     * later to better achieve the desired functionality per design meeting discussion.
     * @returns {XML}
     */
    render() {
        let classes = "multiLineTextCell data";
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        if (this.props.isBold) {
            classes += " bold";
        }

        if (this.props.attributes && this.props.attributes.htmlAllowed) {
            return <div className={classes} dangerouslySetInnerHTML={{__html: this.props.value}} />;
        } else {
            //react will encode
            return <div className={classes}>{_.unescape(this.props.value)}</div>;
        }
    }
});

export default MultiLineTextFieldValueRenderer;
