import React from 'react';

/**
 * # MultLineTextFieldValueEditor
 * A multi-line text editor that dynamically changes its height
 */
const MultiLineTextFieldValueEditor = React.createClass({
    displayName: 'MultiLineTextFieldValueEditor',

    propTypes: {
        value: React.PropTypes.string,
        type: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func
    },

    statics: {
        MAX_TEXTAREA_HEIGHT: 100
    },
    getDefaultProps() {
        return {
            value: "",
            type: "text"
        };
    },

    getInitialState() {
        return {
            style: {
                height: "auto"
            }
        };
    },

    /**
     * delegate text changes via callback
     * @param ev
     */
    onChange(ev) {
        this.props.onChange(ev.target.value);
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
                this.setState({style: {height: newHeight}});
            } else {
                this.setState({style: {height: MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT, overflowY: "auto"}});
            }
        });
    },

    /**
     * force resizing during typing
     * @param ev
     */
    onKeyUp(ev) {
        this.resize();
    },

    render() {

        return <textarea ref="textarea" style={this.state.style}
                         onChange={this.onChange}
                         onBlur={this.props.onBlur}
                         tabIndex="0"
                         onKeyUp={this.onKeyUp}
                         className="cellEdit"
                         rows="1"
                         value={this.props.value}/>;
    }
});

export default MultiLineTextFieldValueEditor;
