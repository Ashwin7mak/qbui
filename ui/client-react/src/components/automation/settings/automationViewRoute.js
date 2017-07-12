import React, {Component} from "react";
import {Table} from "react-bootstrap";
import {connect} from "react-redux";
import Loader from "react-loader";
import Stage from "../../../../../reuse/client/src/components/stage/stage";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import {I18nMessage} from "../../../utils/i18nMessage";
import {loadAutomation} from "../../../actions/automationActions";
import {getAutomation} from "../../../reducers/automation";
import * as UrlConsts from "../../../constants/urlConstants";
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import _ from "lodash";


import "./automationView.scss";


export class AutomationViewRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmInputValue: ""
        };
    }

    openAutomationForEdit = () => {
        let appId = this.getAppId();
        let automationId = this.getAutomationId();
        let link = `${UrlConsts.BUILDER_ROUTE}/app/${appId}/${UrlConsts.AUTOMATION.PATH}/${automationId}`;
        this.props.history.push(link);
    };

    getPageActions() {
        let actions = [
            {msg: 'pageActions.edit', icon:'edit', onClick: this.openAutomationForEdit}];

        return (<IconActions className="pageActions" actions={actions} {...this.props}/>);
    }

    getStageHeadline() {
        return <div className="automationViewSettingsStage stageHeadLine"><I18nMessage message="automation.automationView.stageHeading" automationName={this.getAutomationName()}/></div>;
    }

    componentDidMount() {
        if (this.getAppId() && this.getAutomationId()) {
            this.props.loadAutomation(this.getAppId(), this.getAutomationId());
        }
    }

    getAppId() {
        return this.props.match && this.props.match.params ? this.props.match.params.appId : undefined;
    }

    getAutomationId() {
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
                    <div className="automationView--container">
                        <div className="automationViewName automationView--section">
                            <span className="automationView--header"><I18nMessage message="automation.automationView.nameHeader"/>:</span> <br/>
                            <span className="value">{this.getAutomationName()}</span>
                        </div>
                        <div className="automationViewTrigger automationView--section">
                            <span className="automationView--header"><I18nMessage message="automation.automationView.triggerHeader"/>:</span> <br/>
                            <span className="value">N/A</span>
                        </div>
                        <div className="automationViewAction automationView--section">
                            <span className="automationView--header"><I18nMessage message="automation.automationView.actionHeader"/>:</span> <br/>
                            <span className="value"><I18nMessage message="automation.automationView.actions.email"/></span>
                        </div>
                    </div>
                </div>
            </Loader>
        );
    }
}

AutomationViewRoute.propTypes = {
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
