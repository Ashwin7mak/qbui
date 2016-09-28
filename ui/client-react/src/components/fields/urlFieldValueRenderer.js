import React, {PropTypes} from 'react';
import TextFieldValueRenderer from './textFieldValueRenderer';
import './urlField.scss';

const UrlFieldValueRenderer = React.createClass({
    displayName: 'UrlFieldValueRenderer',
    propTypes: {
        /*
        * The underlying value for the URL */
        value: PropTypes.string,

        /*
        * The value displayed to the user */
        display: PropTypes.string,

        /*
        * If true, clicking the link will open a new window/tab */
        openInNewWindow: PropTypes.bool,

        /*
        * If true, the link will be a button rather than a text link */
        showAsButton: PropTypes.bool,

        /*
        * Shows a link button as disabled if true
        * */
        disabled: PropTypes.bool
    },
    getDefaultProps() {
        return {
            display: '',
            disabled: false,
            openInNewWindow: true,
            showAsButton: false,
            value: ''
        };
    },
    setLinkClasses() {
        let linkClasses = (this.props.showAsButton ? 'btn btn-default' : 'link');
        linkClasses += (this.props.disabled ? ' disabled' : '');

        return linkClasses;
    },
    renderLink() {
        let target = (this.props.openInNewWindow ? '_blank': '_self');

        if(this.props.disabled) {
            return (
                <span className={this.setLinkClasses()}>
                    {this.props.display}
                </span>
            );

        } else {
            return (
                <a href={this.props.value} target={target} className={this.setLinkClasses()}>
                    {this.props.display}
                </a>
            );
        }
    },
    render() {
        let classes = 'urlField';

        return (
            <div className={classes}>
                {this.renderLink()}
            </div>
        );

    }
});

export default UrlFieldValueRenderer;
