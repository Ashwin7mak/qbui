import React from 'react';
import ReactDOM from 'react-dom';
import clearableInput from '../hoc/clearableInput';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';
import Breakpoints from "../../utils/breakpoints";
import FieldUtils from '../../utils/fieldUtils';

/**
 * # MultiLineTextFieldValueEditor
 * A multi-line text editor that dynamically changes its height. The text editor will not exceed
 * the MAX_TEXTAREA_HEIGHT of 100. If it exceeds this height a scrollbar will appear.
 */
const TextArea = React.createClass({
    render() {
        let cols;
        if (Breakpoints.isSmallBreakpoint()) {
            cols = 1;
        } else {
            cols = _.get(this.props, 'fieldDef.datatypeAttributes.clientSideAttributes.width', null);
        }
        let rows = _.get(this.props, 'fieldDef.datatypeAttributes.clientSideAttributes.num_lines', 1);

        let maxLength = FieldUtils.getMaxLength(this.props.fieldDef);

        return (<textarea
                    style={this.props.style}
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                    tabIndex={this.props.tabIndex}
                    maxLength={maxLength}
                    onKeyUp={this.props.onKeyUp}
                    placeholder={this.props.placeholder}
                    className="cellEdit borderOnError"
                    rows={rows}
                    cols={cols}
                    value={this.props.value || ''}
                    type="text" />);
    }
});
const ClearableTextArea = clearableInput(TextArea);

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
        MAX_TEXTAREA_WIDTH: 200,
        INITIAL_HEIGHT_TEXTAREA: "32px"
    },

    getInitialState() {
        return {
            style: {
                width: MultiLineTextFieldValueEditor.MAX_TEXTAREA_WIDTH,
                height: MultiLineTextFieldValueEditor.INITIAL_HEIGHT_TEXTAREA
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
        if (this.props.onBlur) {
            let theVals = {
                value: ev.target.value
            };
            theVals.display = textFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },

    componentDidMount() {
        if (this.props.isFormView) {
            this.setState({style: {height: "auto", width: MultiLineTextFieldValueEditor.MAX_TEXTAREA_WIDTH}});
        } else {
            this.resize();
        }
    },

    /**
     * reset height to the natural value, unless it exceeds MAX_TEXTAREA_HEIGHT,
     * in which case start using vertical scrolling
     */
    resize() {
        this.setState({style: {height: MultiLineTextFieldValueEditor.INITIAL_HEIGHT_TEXTAREA}}, () => {
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
            if (!this.props.isFormView) {
                this.resize();
            }
        }
    },

    getScrollHeight() {
        return ReactDOM.findDOMNode(this.refs.textarea).firstChild.scrollHeight;
    },

    render() {
        let style = !this.props.showScrollForMultiLine ? this.state.style : {};
        return <ClearableTextArea
                    ref="textarea"
                    {...this.props}
                    style={style}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyUp={this.onKeyUp}/>;
    }
});

export default MultiLineTextFieldValueEditor;
