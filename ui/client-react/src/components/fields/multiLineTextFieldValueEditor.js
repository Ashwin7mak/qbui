import React from 'react';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';
import Breakpoints from "../../utils/breakpoints";
import FieldUtils from '../../utils/fieldUtils';

/**
 * # MultiLineTextFieldValueEditor
 * A multi-line text editor that dynamically changes its height. The text editor will not exceed
 * the MAX_TEXTAREA_HEIGHT of 100. If it exceeds this height a scrollbar will appear.
 */
const MultiLineTextFieldValueEditor = React.createClass({
    displayName: 'MultiLineTextFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the input box */
        value: React.PropTypes.string,
        /**
         * the type for the textarea box is text */
        type: React.PropTypes.number,
        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: React.PropTypes.func,
        /**
         * Show a scroll bar version for inline editing.
         */
        showScrollForMultiLine: React.PropTypes.bool
    },

    statics: {
        MAX_TEXTAREA_HEIGHT: 200,
        MAX_TEXTAREA_WIDTH: 200
    },

    getInitialState() {
        return {
            style: {
                width: MultiLineTextFieldValueEditor.MAX_TEXTAREA_WIDTH,
                height: "auto"
            }
        };
    },
    getDefaultProps() {
        return {
            showScrollForMultiLine: false
        };
    },

    /**
     * delegate text changes via callback
     * @param ev
     */
    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    },

    onBlur(ev) {
        let theVals = {
            value: ev.target.value
        };
        theVals.display = textFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },

    componentDidMount() {
        this.resize();
    },

    /**
     * reset height to the natural value, unless it exceeds MAX_TEXTAREA_HEIGHT,
     * in which case start using vertical scrolling
     */
    resize() {
        this.setState({style: {height: "auto"}}, () => {
            // now we can query the actual (auto) height
            let newHeight = this.getScrollHeight();

            if (newHeight < MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT) {
                this.setState({style: {height: newHeight, width: MultiLineTextFieldValueEditor.MAX_TEXTAREA_WIDTH}});
            } else {
                this.setState({style: {height: MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT, width: MultiLineTextFieldValueEditor.MAX_TEXTAREA_WIDTH, overflowY: "auto"}});
            }
        });
    },

    /**
     * force resizing during typing
     * @param ev
     */
    onKeyUp(ev) {
        if (this.getScrollHeight() < MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT) {
            this.resize();
        }
    },

    getScrollHeight() {
        return this.refs.textarea.scrollHeight;
    },

    render() {
        let cols = _.has(this.props, 'fieldDef.datatypeAttributes.clientSideAttributes.width') ? this.props.fieldDef.datatypeAttributes.clientSideAttributes.width : null;
        if (Breakpoints.isSmallBreakpoint()) {
            cols = 1;
        }
        let rows = _.has(this.props, 'fieldDef.datatypeAttributes.clientSideAttributes.num_lines') ? this.props.fieldDef.datatypeAttributes.clientSideAttributes.num_lines : 1;
        let style = this.props.showScrollForMultiLine ? this.state.style : {};

        let maxLength = FieldUtils.getMaxLength(this.props.fieldDef);

        return <textarea ref="textarea" style={style}
                                        onChange={this.onChange}
                                        onBlur={this.onBlur}
                                        tabIndex="0"
                                        maxLength={maxLength}
                                        onKeyUp={this.onKeyUp}
                                        placeholder={this.props.placeholder}
                                        className="cellEdit borderOnError"
                                        rows={rows}
                                        cols={cols}
                                        value={this.props.display ? this.props.display : this.props.value}
                                        type="text" />;
    }
});

export default MultiLineTextFieldValueEditor;
