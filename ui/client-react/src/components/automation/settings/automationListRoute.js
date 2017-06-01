import React, {Component} from "react";
import {Table} from "react-bootstrap";
import {connect} from "react-redux";
import Loader from "react-loader";
import Stage from "../../../../../reuse/client/src/components/stage/stage";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import {I18nMessage} from "../../../utils/i18nMessage";
import {loadAutomations, testAutomation} from "../../../actions/automationActions";
import {getAutomationList} from "../../../reducers/automation";
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import _ from "lodash";

import "./automationList.scss";
import {CONTEXT} from "../../../actions/context";


export class AutomationListRoute extends Component {

    getInitialState() {
        return {
            confirmInputValue: ""
        };
    }

    getExistingAutomationNames() {
        return [];
    }

    getPageActions() {
        const actions = [];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu="5"/>);
    }

    getStageHeadline() {
        return <div className="automationListSettingsStage stageHeadLine"><I18nMessage message="settings.automationSettings"/></div>;
    }

    componentDidMount() {
        if (this.getAppId()) {
            this.props.loadAutomations(CONTEXT.AUTOMATION.GRID, this.getAppId());
        }
    }

    getAppId() {
        if (this.props.app) {
            return this.props.app.id;
        }
        return this.props.match && this.props.match.params ? this.props.match.params.appId : undefined;
    }

    renderAutomations() {
        if (this.props.automations && this.props.automations.length > 0) {
            return this.props.automations
                .filter((automation) => {
                    return "EMAIL" === automation.type;
                })
                .map((automation, index) => (
                    <tr><td>{automation.name}</td>
                        <td>{automation.active ? <I18nMessage message="automationList.activeYes"/> : <I18nMessage message="automationList.activeNo"/>}</td>
                        <td><button type="button" onClick={() => this.testButtonClicked(automation.name)}><I18nMessage message="automationList.actionButton"/></button></td>
                    </tr>
                ));
        }
        return [];
    }

    testButtonClicked(automationName) {
        // console.log('Automation List Route:: sendEMail');
        this.props.testAutomation(automationName, this.getAppId());
    }

    render() {
        let loaded = !(_.isUndefined(this.props.app) || _.isUndefined(this.props.automations));
        let automationRows = this.renderAutomations();
        return (
            <Loader loaded={loaded} options={SpinnerConfigurations.AUTOMATION_LIST_LOADING}>
                <div className="automationSettings">
                    <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions()}/>
                    <div className="automationSettings--container">
                        <Table hover className="automationSettings--table">
                          <thead>
                            <tr>
                                <th><I18nMessage message="automationList.nameHeader"/></th>
                                <th><I18nMessage message="automationList.activeHeader"/></th>
                                <th><I18nMessage message="automationList.actionHeader"/></th>
                            </tr>
                          </thead>
                          <tbody>
                            {automationRows}
                          </tbody>
                        </Table>
                    </div>
                </div>
            </Loader>
        );
    }
}

AutomationListRoute.protoTypes = {
    /** The list of automations to display. */
    automations: React.PropTypes.array,
    /** Get the list of automations for the app. */
    loadAutomations: React.PropTypes.func,
    testAutomation: React.PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        automations : getAutomationList(state)
    };
};

const mapDispatchToProps = {
    loadAutomations,
    testAutomation
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationListRoute);
