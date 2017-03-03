import React from 'react';
import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);

import './qbErrorMessage.scss';

let logger = new Logger();

/**
 * QBErrorMessage displays a list of passed-in errors
 */
let QBErrorMessage = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        // Required, control this property to show or hidden error message popup.
        hidden: React.PropTypes.bool.isRequired,

        // Required, the message what error msg popup wants show.
        message: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array
        ]).isRequired,

        // function to control display/hide the error message popup
        onCancel: React.PropTypes.func
    },

    renderErrorMessages() {
        return this.props.message.map(msg => {
            let fieldLabel;
            if (msg.def) {
                // Prefer the fieldLabel if it is available
                fieldLabel = (msg.def.fieldLabel || msg.def.fieldName);
            } else {
                fieldLabel = 'Field Label';
                logger.warn('Field definition for validation message on QbErrorMessage was not defined');
            }

            return <span className="qbErrorMessageItem" key={msg.id}>{fieldLabel}</span>;
        });
    },

    render() {
        const errorNum = this.props.message ? this.props.message.length : 0;
        const headerMessage = errorNum <= 1 ?
            <I18nMessage message="errorMessagePopup.errorMessagePopupHeader.singleErrorLabel"/> :
            <I18nMessage message="errorMessagePopup.errorMessagePopupHeader.multipleErrorLabel" numFields={errorNum} />;

        let qbErrorMessageClasses = "qbErrorMessage";
        if (!(this.props.hidden || errorNum === 0)) {
            qbErrorMessageClasses += " qbErrorMessageVisible";
        }

        return (
            <div className={qbErrorMessageClasses}>
                <div className="qbErrorMessageHeader">
                    <div className="leftIcons">
                        <QBicon icon={"alert"}/>
                        <h4>{headerMessage}</h4>
                    </div>
                    <div className="rightIcons">
                        <Button onClick={this.props.onCancel}><QBicon icon={"x-secondary"}/></Button>
                    </div>
                </div>
                <div className="qbErrorMessageContent">
                    {this.renderErrorMessages()}
                </div>
            </div>
        );
    }
});

export default QBErrorMessage;
