import React, {Component} from "react";
import {Table} from "react-bootstrap";
import {connect} from "react-redux";
import Loader from "react-loader";
import Stage from "../../../../../reuse/client/src/components/stage/stage";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import {I18nMessage} from "../../../utils/i18nMessage";
import {loadAutomation} from "../../../actions/automationActions";
import {getAutomation} from "../../../reducers/automation";
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import _ from "lodash";


import "./automationEdit.scss";


export class AutomationEditRoute extends Component {

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

    render() {
        let loaded = !(_.isUndefined(this.props.automation));
        return (
            <Loader loaded={loaded} options={SpinnerConfigurations.AUTOMATION_LIST_LOADING}>
                <div className="automationEdit">
                    <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions()}/>
                    <div className="automationEdit--container">
                        EDIT:
                        <div className="automationEditName automationEdit--section">
                            <span className="automationEdit--header"><I18nMessage message="automation.automationEdit.nameHeader"/>:</span> <br/>
                            <span className="value">{this.getAutomationName()}</span>
                        </div>
                    </div>
                </div>
            </Loader>
        );
    }
}

AutomationEditRoute.protoTypes = {
    /** The automation to display. */
    automation: React.PropTypes.object,
    /** Get an automation to view. */
    loadAutomation: React.PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        automation : getAutomation(state)
    };
};

const mapDispatchToProps = {
    loadAutomation
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationEditRoute);
