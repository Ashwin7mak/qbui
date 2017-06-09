import React, {Component} from "react";
import {Table} from "react-bootstrap";
import {connect} from "react-redux";
import Loader from "react-loader";
import Button from 'react-bootstrap/lib/Button';
import Stage from "../../../../../reuse/client/src/components/stage/stage";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import {I18nMessage} from "../../../utils/i18nMessage";
import {loadAutomation, saveAutomation, changeAutomationEmailTo, changeAutomationEmailSubject, changeAutomationEmailBody} from "../../../actions/automationActions";
import {getAutomation, emailAutomationGetTo, emailAutomationGetSubject, emailAutomationGetBody} from "../../../reducers/automation";
import TextFieldValueEditor from "../../fields/textFieldValueEditor";
import MultiLineTextFieldValueEditor from "../../fields/multiLineTextFieldValueEditor";
import EmailFieldValueEditor from "../../fields/emailFieldValueEditor";
import EmailValidator from "../../../../../common/src/validator/emailValidator";
import EmailFormatter from "../../../../../common/src/formatter/emailFormatter";
import SaveOrCancelFooter from '../../saveOrCancelFooter/saveOrCancelFooter';
import NavigationUtils from '../../../utils/navigationUtils';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import * as UrlConsts from "../../../constants/urlConstants";
import _ from "lodash";


import "./automationBuilderContainer.scss";


export class AutomationBuilderContainer extends Component {

    getInitialState() {
        return {
            confirmInputValue: ""
        };
    }

    getPageActions() {
        const actions = [];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu="5"/>);
    }

    getStageHeadline() {
        return <div className="automationEditSettingsStage stageHeadLine"><I18nMessage message="automation.automationEdit.stageHeading" automationName={this.getAutomationName()}/></div>;
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
        console.info("Check valid: " + emails);
        return EmailValidator.validateArrayOfEmails(EmailFormatter.splitEmails(emails)).isInvalid;
    };

    onSave = () => {
        this.props.saveAutomation(this.getAppId(), this.getAutomationId(), this.props.automation);

        let link = `${UrlConsts.SETTINGS_ROUTE}/app/${this.getAppId()}/${UrlConsts.AUTOMATION.PATH}/${this.getAutomationId()}/${UrlConsts.AUTOMATION.VIEW}`;
        NavigationUtils.goBackToPreviousLocation(link);
    };

    onCancel = () => {
        let link = `${UrlConsts.SETTINGS_ROUTE}/app/${this.getAppId()}/${UrlConsts.AUTOMATION.PATH}/${this.getAutomationId()}/${UrlConsts.AUTOMATION.VIEW}`;
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
                <div className="automationEdit">
                    <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions()}/>
                    <div className="automationEdit--container">
                        <span className="automationEdit--sectionHeader"><I18nMessage message="automation.automationEdit.emailSectionHeader"/></span>
                        <div className="automationEditName automationEdit--section">
                            <span className="automationEdit--header"><I18nMessage message="automation.automationEdit.toHeader"/>:</span> <br/>
                            <EmailFieldValueEditor value={to} onChange={this.updateTo} invalid={this.isEmailInvalid(to)}/>
                        </div>
                        <div className="automationEditName automationEdit--section">
                            <span className="automationEdit--header"><I18nMessage message="automation.automationEdit.subjectHeader"/>:</span> <br/>
                            <TextFieldValueEditor inputType="text" value={subject} onChange={this.updateSubject}/>
                        </div>
                        <div className="automationEditName automationEdit--section">
                            <span className="automationEdit--header"><I18nMessage message="automation.automationEdit.bodyHeader"/>:</span> <br/>
                            <MultiLineTextFieldValueEditor value={body} onChange={this.updateBody}/>
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
