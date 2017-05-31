import React, {Component} from "react";
import {Table} from "react-bootstrap";
import {connect} from "react-redux";
import Loader from "react-loader";
import Stage from "../../../../../reuse/client/src/components/stage/stage";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import {I18nMessage} from "../../../utils/i18nMessage";
import {loadAutomations} from "../../../actions/automationActions";
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
        if (this.props.app) {
            this.props.loadAutomations(CONTEXT.AUTOMATION.GRID, this.props.app.id);
        }
    }

    renderAutomations() {
        if (this.props.automations && this.props.automations.length > 0) {
            return this.props.automations
                .filter((automation) => {
                    return "EMAIL" === automation.type;
                })
                .map((automation, index) => (
                    <tr><td>{automation.name}</td><td>{automation.active ? <I18nMessage message="automationList.activeYes"/> : <I18nMessage message="automationList.activeNo"/>}</td></tr>
                ));
        }
        return [];
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
    loadAutomations: React.PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        automations : getAutomationList(state)
    };
};

const mapDispatchToProps = {
    loadAutomations
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationListRoute);
