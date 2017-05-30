import React from 'react';
import MultiStepDialog from '../../../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {I18nMessage} from "../../../../utils/i18nMessage";
import Locale from '../../../../locales/locales';
import QbIcon from "../../../qbIcon/qbIcon";
import QbToolTip from "../../../qbToolTip/qbToolTip";
import NotificationManager from '../../../../../../reuse/client/src/scripts/notificationManager';
import FieldValueEditor from '../../../fields/fieldValueEditor';
import copy from 'copy-to-clipboard';

import './userSuccessDialog.scss';


class UserSuccessDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * dialog finished
     */
    onFinished = () => {
        this.props.showSuccessDialog(false);
    };

    onClickCopy = () =>{
        copy(this.props.appUrl);
        NotificationManager.info(Locale.getMessage('addUserToApp.copied'), Locale.getMessage('success'));

    }

    /**
     * render the modal dialog for creating a table
     * @returns {XML}
     */
    render() {
        return (<MultiStepDialog show={this.props.successDialogOpen}
                                 classes="userSuccessDialog"
                                 onFinished={this.onFinished}
                                 onCancel={this.onFinished}
                                 showCancelButton={false}
                                 showFinishedText={true}
                                 finishedButtonLabel={Locale.getMessage("addUserToApp.userSuccessDialogOK")}>
            <div className="userSuccessContent">
                <div className="topTitle">
                    <div className="addUserIcon">
                        <QbIcon icon="add-user" />
                    </div>
                    <div className="titleText">
                        <I18nMessage message="addUserToApp.userSuccessTitle"/>
                    </div>
                </div>
                <div className="userSuccessText">
                    <p><I18nMessage message="addUserToApp.userSuccessText1"/></p>
                    <div className="userSuccessDetails">
                        <div className="url flexChild">
                            <FieldValueEditor type={1} value={this.props.appUrl} />
                        </div>
                            <div className="cellEditIcon flexChild" onClick={this.onClickCopy}>
                                <QbToolTip i18nMessageKey="addUserToApp.toCopy">
                                    <QbIcon icon="url"/>
                                    <span><I18nMessage message="addUserToApp.copy"/></span>
                                </QbToolTip>
                            </div>
                        <a href={`mailto:${this.props.addedAppUser}?Subject=${Locale.getMessage("addUserToApp.messageSubject")}&body=${Locale.getMessage("addUserToApp.messageBody")}`} className="cellEditIcon flexChild" onClick={this.onClickEmail}>
                            <QbToolTip i18nMessageKey="addUserToApp.toEmail">
                                <QbIcon icon="mail"/>
                                <span><I18nMessage message="addUserToApp.email"/></span>
                            </QbToolTip>
                        </a>
                    </div>

                </div>
            </div>
        </MultiStepDialog>);
    }
}

export default UserSuccessDialog;