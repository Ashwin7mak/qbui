import React from 'react';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';

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
        type: React.PropTypes.string,
        /**
         *listen for changes by setting a callback to the onChange prop */
        onChange: React.PropTypes.func,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: React.PropTypes.func
    },

    statics: {
        MAX_TEXTAREA_HEIGHT: 200
    },

    getInitialState() {
        return {
            style: {
                width: 200,
                height: "auto"
            }
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
            this.props.onBlur({value: ev.target.value, display: ev.target.value});
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
            let newHeight = this.refs.textarea.scrollHeight;

            if (newHeight < MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT) {
                this.setState({style: {height: newHeight, width: 200}});
            } else {
                this.setState({style: {height: MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT, width: 200, overflowY: "auto"}});
            }
        });
    },

    /**
     * force resizing during typing
     * @param ev
     */
    onKeyUp(ev) {
        if (this.refs.textarea.scrollHeight < 200) {
            this.resize();
        }
    },

    render() {
        return <textarea ref="textarea" style={this.state.style}
                                        onChange={this.onChange}
                                        onBlur={this.onBlur}
                                        tabIndex="0"
                                        onKeyUp={this.onKeyUp}
                                        className="cellEdit"
                                        rows="1"
                                        value={this.props.value === null ? '' : this.props.value}
                                        type="text" />;
    }
});

export default MultiLineTextFieldValueEditor;
