import React from 'react';

/**
 * Initial field component implementations for demo, these will become separate component files
 * and added to component lib when there stories are implemented
 */
/**
 * simple non-validating cell editor for text
 */
export const DefaultFieldValueEditor = React.createClass({
    displayName: 'DefaultFieldValueEditor',

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]),
        type: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            value: "",
            type: "text"
        };
    },

    onChange(ev) {
        this.props.onChange(ev.target.value);
    },

    render() {
        return <input ref="fieldInput"
                      onChange={this.onChange}
                      onBlur={this.props.onBlur}
                      tabIndex="0"
                      className="cellEdit"
                      type={this.props.type}
                      value={this.props.value}/>;
    }
});

