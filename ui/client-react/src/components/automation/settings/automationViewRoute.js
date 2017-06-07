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


import "./automationView.scss";


export class AutomationViewRoute extends Component {

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
        return <div className="automationViewSettingsStage stageHeadLine"><I18nMessage message="automation.automationView.stageHeading"/>: {this.getAutomationName()}</div>;
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
                <div className="automationView">
                    <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions()}/>
                    <div className="automationViewName">
                        <I18nMessage message="automation.automationView.nameHeader"/>: <br/>
                        <span className="value">{this.getAutomationName()}</span>
                    </div>
                    <div className="automationViewTrigger">
                        <I18nMessage message="automation.automationView.triggerHeader"/>: <br/>
                        <span className="value">N/A</span>
                    </div>
                    <div className="automationViewAction">
                        <I18nMessage message="automation.automationView.actionHeader"/>: <br/>
                        <span className="value"><I18nMessage message="automation.automationView.actions.email"/></span>
                    </div>
                </div>
            </Loader>
        );
    }
}

AutomationViewRoute.protoTypes = {
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
)(AutomationViewRoute);
