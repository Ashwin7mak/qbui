import React from 'react';
import Locale from '../../locales/locales';
import {I18nNumber} from '../../utils/i18nMessage';

/**
 * placeholder for rendering users
 */
export const UserFieldValueRenderer = React.createClass({
    displayName: 'UserFieldValueRenderer',

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="userCell data">{this.props.value}</div>;
    }
});

export const NumberFieldValueRenderer = React.createClass({
    displayName: 'NumberFieldValueRenderer',

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
    },

    render() {
        return <div className="numberCell data"><I18nNumber value={this.props.value}></I18nNumber></div>;
    }
});


export const DateFieldValueRenderer = React.createClass({
    displayName: 'DateFieldValueRenderer',

    propTypes: {
        value: React.PropTypes.string
    },

    render() {
        return <div className="dateCell data">{this.props.value}</div>;
    }
});

export const TextFieldValueRenderer = React.createClass({
    displayName: 'TextFieldValueRenderer',

    propTypes: {
        value: React.PropTypes.any
    },

    render() {
        return <TextField classes="textCell data"
                          isBold={_.has(this.props, 'attributes.clientSideAttributes.bold') && this.props.attributes.clientSideAttributes.bold}
                          {...this.props} />;
    }
});

// like a text cell but use a PRE tag to preserve whitespace
export const MultiLineTextFieldValueRenderer = React.createClass({
    displayName: 'MultiLineTextFieldValueRenderer',

    propTypes: {
        value: React.PropTypes.any
    },

    render() {
        return <pre className="multiLineTextCell data">{this.props.value}</pre>;
    }
});
