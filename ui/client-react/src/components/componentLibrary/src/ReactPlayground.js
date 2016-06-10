// These do not use ES6 imports, because the evaluated code requires un-mangled
// variable names.

/* eslint-disable */
const classNames = require('classnames');
const React = require('react');
const ReactDOM = require('react-dom');

// Keep these in sync with src/index.js.
const QBicon = require('../../qbIcon/qbIcon');
const QBPanel = require('../../QBPanel/qbpanel');
import {SafeAnchor, Alert} from 'react-bootstrap';
/* eslint-enable */

import {transform} from "babel-standalone";
import CodeExample from './CodeExample';

import Codemirror from 'react-codemirror';
import 'codemirror/addon/runmode/runmode';
import 'codemirror/mode/jsx/jsx';

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
    // console.log('editor handle change'); //eslint-disable-line
    // console.log(this.refs.editor); //eslint-disable-line
    // console.log(foobar);
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

class OldCodeMirrorEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (IS_MOBILE || CodeMirror === undefined) {
      return;
    }

    this.editor = CodeMirror.fromTextArea(this.refs.editor, {
      mode: 'jsx',
      lineNumbers: false,
      lineWrapping: false,
      matchBrackets: true,
      tabSize: 2,
      theme: 'solarized light',
      readOnly: this.props.readOnly
    });
    this.editor.on('change', this.handleChange);
  }

  componentDidUpdate() {
    if (this.props.readOnly) {
      this.editor.setValue(this.props.codeText);
    }
  }

  handleChange() {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(this.editor.getValue());
    }
  }

  render() {
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
      editor = <textarea ref="editor" defaultValue={this.props.codeText} />;
    }

    return (
      <div style={this.props.style} className={this.props.className}>
        {editor}
      </div>
      );
  }
}

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
    const mountNode = null;  // eslint-disable-line no-unused-vars

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
