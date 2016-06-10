import React from 'react';
import CodeExample from './CodeExample';

import Codemirror from 'react-codemirror';
import 'codemirror/addon/runmode/runmode';
import 'codemirror/mode/jsx/jsx';
import '../assets/codemirror.scss';
import '../assets/theme-monokai.scss';

const IS_MOBILE = typeof navigator !== 'undefined' && (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
    );

var CodeMirrorEditor = React.createClass({
    handleChange: function(foobar) {
        if (!this.props.readOnly && this.props.onChange) {
            this.props.onChange(foobar);
        }
    },

    interact: function(cm) {
        console.log(cm.getValue()); //eslint-disable-line
    },

    render: function() {
        // wrap in a div to fully contain CodeMirror
        let editor;

        if (IS_MOBILE) {
            editor = (
                <CodeExample
                    mode="jsx"
                    codeText={this.props.codeText}
                />
            );
        } else {
            var options = {
                mode: 'jsx',
                lineNumbers: false,
                lineWrapping: false,
                matchBrackets: true,
                tabSize: 2,
                theme: 'monokai',
                readOnly: this.props.readOnly
            };

            editor = <Codemirror ref="editor" value={this.props.codeText} onChange={this.handleChange} options={options} interact={this.interact} />;
        }

        return (
            <div style={this.props.style} className={this.props.className}>
                {editor}
            </div>
            );
    }
});
