// THESE DO NOT USE ES6 IMPORTS, BECAUSE THE EVALUATED CODE REQUIRES UN-MANGLED
// VARIABLE NAMES.
/* eslint-disable */
const classNames = require('classnames');
const React = require('react');
const ReactDOM = require('react-dom');

const QBicon = require('../../qbIcon/qbIcon');
const QBPanel = require('../../QBPanel/qbpanel');
/* eslint-enable */
import {SafeAnchor, Alert} from 'react-bootstrap';

import {transform} from "babel-standalone";
import CodeMirrorEditor from './CodeMirrorEditor';

const selfCleaningTimeout = {
    componentDidUpdate() {
        clearTimeout(this.timeoutID);
    },

    updateTimeout() {
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout.apply(null, arguments);
    }
};

const ReactPlayground = React.createClass({
    mixins: [selfCleaningTimeout],

    propTypes: {
        codeText: React.PropTypes.string.isRequired,
        transformer: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            transformer(code) {
                return transform(code, {presets: ["es2015", "react", "stage-1"]}).code;
            }
        };
    },

    getInitialState() {
        return {
            code: this.props.codeText,
            codeChanged: false,
            showCode: false
        };
    },

    componentWillMount() {
        // For the initial render, we can hijack React.render to intercept the
        // example element and render it normally. This is safe because it's code
        // that we supply, so we can ensure ahead of time that it won't throw an
        // exception while rendering.
        const originalRender = ReactDOM.render;
        ReactDOM.render = (element) => this._initialExample = element;

        // Stub out mountNode for the example code.
        const mountNode = null;

        try {
            const compiledCode = this.props.transformer(this.props.codeText);

            /* eslint-disable */
            eval(compiledCode);
            /* eslint-enable */
        } finally {
            ReactDOM.render = originalRender;
        }
    },

    componentWillUnmount() {
        this.clearExample();
    },

    handleCodeChange(value) {
        this.setState(
            {code: value, codeChanged: true},
            this.executeCode
        );
    },

    handleCodeModeToggle() {
        this.setState({
            showCode: !this.state.showCode
        });
    },

    render() {
        return (
            <div className="playground">
                {this.renderExample()}

                {this.renderEditor()}
                {this.renderToggle()}
            </div>
        );
    },

    renderExample() {
        let example;
        if (this.state.codeChanged) {
            example = (
                <div ref="mount" />
            );
        } else {
            example = (
                <div>{this._initialExample}</div>
            );
        }

        return (
             <div className={classNames('bs-example', this.props.exampleClassName)}>
                {example}
            </div>
        );
    },

    renderEditor() {
        if (!this.state.showCode) {
            return null;
        }

        return (
            <CodeMirrorEditor
                key="jsx"
                onChange={this.handleCodeChange}
                className="highlight"
                codeText={this.state.code}
            />
        );
    },

    renderToggle() {
        return (
            <SafeAnchor
                className={classNames('code-toggle', {'open': this.state.showCode})}
                onClick={this.handleCodeModeToggle}
            >
                {this.state.showCode ? 'hide code' : 'show code'}
            </SafeAnchor>
        );
    },

    clearExample() {
        if (!this.state.codeChanged) {
            return null;
        }

        const mountNode = this.refs.mount;
        try {
            ReactDOM.unmountComponentAtNode(mountNode);
        } catch (e) {
            console.error(e); // eslint-disable-line no-console
        }

        return mountNode;
    },

    executeCode() {
        const mountNode = this.clearExample();

        let compiledCode = null;
        try {
            compiledCode = this.props.transformer(this.state.code);

            /* eslint-disable */
            eval(compiledCode);
            /* eslint-enable */
        } catch (err) {
            if (compiledCode !== null) {
                console.log(err, compiledCode); // eslint-disable-line no-console
            } else {
                console.log(err); // eslint-disable-line no-console
            }

            this.updateTimeout(
                () => {
                    ReactDOM.render(
                        <Alert bsStyle="danger">
                            {err.toString()}
                        </Alert>,
                        mountNode
                    );
                },
                500
            );
        }
    }
});

export default ReactPlayground;
