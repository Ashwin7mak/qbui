import React from 'react';
import './fields.scss';
import _ from 'lodash';
import {I18nMessage} from '../../../../reuse/client/src/utils/i18nMessage';
/**
 * # TextFieldValueRenderer
 *
 * A TextFieldValueRenderer is a read only rendering of the field containing a single line text.
 *
 * The value can be rendered as bold or not and classes can be optionally pass in for custom styling.
 */
const TextFieldValueRenderer = React.createClass({
    displayName: 'TextFieldValueRenderer',
    propTypes: {
        /**
         * the rawvalue for this field */
        value: React.PropTypes.any,
        /**
         * the display value to render */
        display: React.PropTypes.any,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
         * renders bold if true */
        isBold: React.PropTypes.bool,

        /**
         * text field attributes
         */
        attributes: React.PropTypes.object,

        goToParent: React.PropTypes.func, //handles drill down to parent

        masterTableId: React.PropTypes.string,

        masterAppId: React.PropTypes.string,

        masterFieldId: React.PropTypes.number

    },

    getDefaultProps() {
        return {
            isBold: false,
            classes: null,
            attributes: null
        };
    },

    /**
     * call the method to open a drawer
     */
    handleClick() {
        this.props.goToParent(this.props.masterAppId, this.props.masterTableId, this.props.masterFieldId, this.props.value);
    },

    /**
     * return the element with link to a parent
     * @param classes
     * @param htmlAllowed
     * @return {XML}
     */
    getParentLink(classes, htmlAllowed) {
        if (this.props.display) {
            classes += ' textLink';
            if (htmlAllowed) {
                return <span className={classes} dangerouslySetInnerHTML={{__html: this.props.display}}
                             onClick={this.handleClick}/>;
            } else {
                return <span className={classes} onClick={this.handleClick}>{_.unescape(this.props.display)}</span>;
            }
        } else {
            classes += ' italicize';
            return <span className={classes}><I18nMessage message="form.noParentRecordSelected"/></span>;
        }
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
        let classes = 'textField';
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        if (this.props.isBold) {
            classes += " bold";
        }

        if (this.props.attributes && this.props.attributes.htmlAllowed) {
            if (this.props.goToParent) {
                return this.getParentLink(classes, true);
            }
            return <div className={classes} dangerouslySetInnerHTML={{__html: this.props.display}} />;
        } else {
            //react will encode
            if (this.props.goToParent) {
                return this.getParentLink(classes, false);
            }
            return <div className={classes}>{_.unescape(this.props.display)}</div>;
        }
    }
});


export default TextFieldValueRenderer;
