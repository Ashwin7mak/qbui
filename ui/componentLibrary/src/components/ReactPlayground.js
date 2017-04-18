// THESE DO NOT USE ES6 IMPORTS, BECAUSE THE EVALUATED CODE REQUIRES UN-MANGLED
// VARIABLE NAMES.
/* eslint-disable */
const classNames = require('classnames');
const React = require('react');
const ReactDOM = require('react-dom');

const CheckBoxFieldValueEditor = require('../../../client-react/src/components/fields/checkBoxFieldValueEditor').default;
const CheckBoxFieldValueRenderer = require('../../../client-react/src/components/fields/checkBoxFieldValueRenderer').default;
const DateFieldValueEditor = require('../../../client-react/src/components/fields/dateFieldValueEditor.js').default;
const DateTimeFieldValueEditor = require('../../../client-react/src/components/fields/dateTimeFieldValueEditor.js').default;
const DateTimeFieldValueRenderer = require('../../../client-react/src/components/fields/dateTimeFieldValueRenderer.js').default;
const EmailFieldValueEditor = require('../../../client-react/src/components/fields/emailFieldValueEditor.js').default;
const EmailFieldValueRenderer = require('../../../client-react/src/components/fields/emailFieldValueRenderer.js').default;
const FieldValueEditor = require('../../../client-react/src/components/fields/fieldValueEditor').default;
const FieldValueRenderer = require('../../../client-react/src/components/fields/fieldValueRenderer').default;
const MultiChoiceFieldValueEditor = require('../../../client-react/src/components/fields/multiChoiceFieldValueEditor').default;
const MultiLineTextFieldValueEditor = require('../../../client-react/src/components/fields/multiLineTextFieldValueEditor').default;
const NumericFieldValueEditor = require('../../../client-react/src/components/fields/numericFieldValueEditor').default;
const NumericFieldValueRenderer = require('../../../client-react/src/components/fields/numericFieldValueRenderer').default;
const TextFieldValueEditor = require('../../../client-react/src/components/fields/textFieldValueEditor').default;
const TextFieldValueRenderer = require('../../../client-react/src/components/fields/textFieldValueRenderer').default;
const TimeFieldValueEditor = require('../../../client-react/src/components/fields/timeFieldValueEditor.js').default;
const TimeFieldValueRenderer = require('../../../client-react/src/components/fields/timeFieldValueRenderer.js').default;
const UrlFieldValueEditor = require('../../../client-react/src/components/fields/urlFieldValueEditor.js').default;
const UrlFieldValueRenderer = require('../../../client-react/src/components/fields/urlFieldValueRenderer.js').default;
const UserFieldValueEditor = require('../../../client-react/src/components/fields/userFieldValueEditor').default;
const UserFieldValueRenderer = require('../../../client-react/src/components/fields/userFieldValueRenderer').default;

const Icon = require('../../../reuse/client/src/components/icon/icon').default;
const AVAILABLE_ICON_FONTS = require('../../../reuse/client/src/components/icon/icon').AVAILABLE_ICON_FONTS;

const QBPanel = require('../../../client-react/src/components/QBPanel/qbpanel').default;

const Trowser = require('../../../client-react/src/components/trowser/trowser.js').default;
const QBModal = require('../../../client-react/src/components/qbModal/qbModal.js').default;
const AlertBanner = require('../../../client-react/src/components/alertBanner/alertBanner.js').default;
const PageTitle = require('../../../client-react/src/components/pageTitle/pageTitle.js').default;
const InvisibleBackdrop = require('../../../client-react/src/components/qbModal/invisibleBackdrop.js').default;
const PhoneFieldValueEditor = require('../../../client-react/src/components/fields/phoneFieldValueEditor.js').default;
const PhoneFieldValueRenderer = require('../../../client-react/src/components/fields/phoneFieldValueRenderer.js').default;
const DurationFieldValueRenderer = require('../../../client-react/src/components/fields/durationFieldValueRenderer.js').default;
const DurationFieldValueEditor = require('../../../client-react/src/components/fields/durationFieldValueEditor.js').default;
const QbGrid = require('../../../client-react/src/components/dataTable/qbGrid/qbGrid.js').default;
const SideMenuBase = require('../../../reuse/client/src/components/sideMenuBase/sideMenuBase.js').default;
const SideTrowserBase = require('../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase.js').default;
const IconChooser = require('../../../reuse/client/src/components/iconChooser/iconChooser.js').default;
const IconInputBox = require('../../../reuse/client/src/components/iconInputBox/iconInputBox.js').default;
const TopNav = require('../../../reuse/client/src/components/topNav/topNav.js').default;
const DefaultTopNavGlobalActions = require('../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions.js').default;
const Stage = require('../../../reuse/client/src/components/stage/stage.js').default;
const StageHeader = require('../../../reuse/client/src/components/stage/stageHeader').default;
const StageHeaderCount = require('../../../reuse/client/src/components/stage/stageHeaderCounts').default;
const Tooltip = require('../../../reuse/client/src/components/tooltip/tooltip.js').default;
const StandardLeftNav = require('../../../reuse/client/src/components/sideNavs/standardLeftNav.js').default;
const Pagination = require('../../../reuse/client/src/components/pagination/pagination.js').default;
// END OF IMPORT STATEMENTS
// The comment above is used for a grunt task. Please do not delete.

/* eslint-enable */
import {SafeAnchor, Alert} from 'react-bootstrap';

import {transform} from 'babel-standalone';
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


exports.default = ReactPlayground;
module.exports = exports.default;
