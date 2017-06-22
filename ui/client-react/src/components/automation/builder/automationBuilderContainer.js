import React, {Component} from "react";
import {connect} from "react-redux";
import Loader from "react-loader";
import Button from "react-bootstrap/lib/Button";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import {I18nMessage} from "../../../utils/i18nMessage";
import {
    changeAutomationEmailBody,
    changeAutomationEmailSubject,
    changeAutomationEmailTo,
    loadAutomation,
    saveAutomation
} from "../../../actions/automationActions";
import {
    emailAutomationGetBody,
    emailAutomationGetSubject,
    emailAutomationGetTo,
    getAutomation
} from "../../../reducers/automation";
import EmailFieldValueEditor from "../../fields/emailFieldValueEditor";
import MultiLineTextFieldValueEditor from "../../fields/multiLineTextFieldValueEditor";
import EmailValidator from "../../../../../common/src/validator/emailValidator";
import EmailFormatter from "../../../../../common/src/formatter/emailFormatter";
import SaveOrCancelFooter from "../../saveOrCancelFooter/saveOrCancelFooter";
import NavigationUtils from "../../../utils/navigationUtils";
import Locale from '../../../locales/locales';

import FieldValueEditor from "../../fields/fieldValueEditor";
import FieldLabelElement from "../../QBForm/fieldLabelElement";
import "../../QBForm/qbform.scss";

import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import * as UrlConsts from "../../../constants/urlConstants";
import _ from "lodash";


import "./automationBuilderContainer.scss";


export class AutomationBuilderContainer extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.getAppId() && this.getAutomationId()) {
            this.props.loadAutomation(this.getAppId(), this.getAutomationId());
        }
    }

    getAppId() {
        if (this.props.appId) {
            return this.props.appId;
        }
        if (this.props.app) {
            return this.props.app.id;
        }
        return this.props.match && this.props.match.params ? this.props.match.params.appId : undefined;
    }

    getAutomationId() {
        if (this.props.automationId) {
            return this.props.automationId;
        }
        if (this.props.automation) {
            return this.props.automation.id;
        }
        return this.props.match && this.props.match.params ? this.props.match.params.automationId : undefined;
    }

    getAutomationName() {
        return this.props.automation ? this.props.automation.name : '';
    }

    updateTo = (value) => {
        this.props.changeAutomationEmailTo(value);
    };

    updateSubject = (value) => {
        this.props.changeAutomationEmailSubject(value);
    };

    updateBody = (value) => {
        this.props.changeAutomationEmailBody(value);
    };

    isEmailInvalid = (emails) => {
        return EmailValidator.validateArrayOfEmails(EmailFormatter.splitEmails(emails)).isInvalid;
    };

    onSave = () => {
        this.props.saveAutomation(this.getAppId(), this.getAutomationId(), this.props.automation);

        let link = `${UrlConsts.SETTINGS_ROUTE}/app/${this.getAppId()}/${UrlConsts.AUTOMATION.PATH}/${this.getAutomationId()}/${UrlConsts.AUTOMATION.VIEW}`;
        NavigationUtils.goBackToPreviousLocation(link);
    };

    onCancel = () => {
        //Navigate back to automation list on cancel.
        let link = `${UrlConsts.SETTINGS_ROUTE}/app/${this.getAppId()}/${UrlConsts.AUTOMATION.PATH}`;
        NavigationUtils.goBackToPreviousLocation(link);
    };

    getRightAlignedButtons() {
        return (
            <div>
                <Button bsStyle="primary" onClick={this.onCancel} className="alternativeTrowserFooterButton"><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.onSave} className="mainTrowserFooterButton"><I18nMessage message="nav.save"/></Button>
            </div>
        );
    }

    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    }

    render() {
        let loaded = !(_.isUndefined(this.props.automation));
        let to = this.props.automation ? emailAutomationGetTo(this.props.automation) : '';
        let subject = this.props.automation ? emailAutomationGetSubject(this.props.automation) : '';
        let body = this.props.automation ? emailAutomationGetBody(this.props.automation) : '';
        return (
            <Loader loaded={loaded} options={SpinnerConfigurations.AUTOMATION_LIST_LOADING}>
                <div className="automationEdit formContainer">
                    <div className="automationEdit--container editForm formSection">
                        <div className="sectionColumn">
                            <h3><I18nMessage message="automation.automationEdit.emailSectionHeader"/></h3>

                            <div className="formElementContainer">
                                <div className="formElement field">
                                    <FieldLabelElement label={Locale.getMessage("automation.automationEdit.toHeader")} />
                                    <div className="fieldValueEditor">
                                        <span className="inputDeleteIcon">
                                            <EmailFieldValueEditor
                                                onChange={this.updateTo}
                                                value={to}
                                                invalid={this.isEmailInvalid(to)} />
                                            <div className="clearIcon">
                                                <div className="tipChildWrapper" aria-describedby="qbtooltip_321">
                                                    <span className="clearIconButton qbIcon iconUISturdy-clear-mini"></span>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </div>

                                <div className="formElement field">
                                    <FieldLabelElement label={Locale.getMessage("automation.automationEdit.subjectHeader")} />
                                    <FieldValueEditor onChange={this.updateSubject} value={subject} appUsers={[]} />
                                </div>

                                <div className="formElement field">
                                    <FieldLabelElement label={Locale.getMessage("automation.automationEdit.bodyHeader")} />
                                    <MultiLineTextFieldValueEditor value={body} onChange={this.updateBody}/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <SaveOrCancelFooter
                    rightAlignedButtons={this.getRightAlignedButtons()}
                    centerAlignedButtons={this.getTrowserActions()}
                    leftAlignedButtons={this.getTrowserActions()}
                />
            </Loader>
        );
    }
}

AutomationBuilderContainer.protoTypes = {
    automation: React.PropTypes.object,
    loadAutomation: React.PropTypes.func,
    saveAutomation: React.PropTypes.func,
    changeAutomationEmailTo: React.PropTypes.func,
    changeAutomationEmailSubject: React.PropTypes.func,
    changeAutomationEmailBody: React.PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        automation : getAutomation(state)
    };
};

const mapDispatchToProps = {
    loadAutomation,
    saveAutomation,
    changeAutomationEmailTo,
    changeAutomationEmailSubject,
    changeAutomationEmailBody
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationBuilderContainer);
