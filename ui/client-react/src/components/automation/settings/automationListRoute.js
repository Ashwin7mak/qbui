import React, {Component} from "react";
import {connect} from "react-redux";
import Loader from "react-loader";
import Stage from "../../../../../reuse/client/src/components/stage/stage";
import IconActions from "../../../../../reuse/client/src/components/iconActions/iconActions";
import Button from 'react-bootstrap/lib/Button';
import {I18nMessage} from "../../../utils/i18nMessage";
import {loadAutomations, testAutomation} from "../../../actions/automationActions";
import {getAutomationList} from "../../../reducers/automation";
import UrlUtils from '../../../utils/urlUtils';
import {Link} from 'react-router-dom';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import _ from "lodash";
import QbGrid from '../../dataTable/qbGrid/qbGrid';
import ReportCell from '../../dataTable/reportGrid/reportCell';
import AutomationRowActions from '../../dataTable/qbGrid/automationRowActions';
import "./automationList.scss";
import {CONTEXT} from "../../../actions/context";
import AutomationListTransformer from '../../../utils/automationListTransformer';
import constants from '../constants'

const CellRenderer = (props) => {<div className="customCell">{props.text}</div>;};
const cellFormatter = (cellData) => {React.createElement(CellRenderer, cellData);};


export class AutomationListRoute extends Component {

    constructor(props) {
        super(props);
    }

    getPageActions() {
        const actions = [];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={5}/>);
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

    transformColumns() {
        return AutomationListTransformer.transformAutomationListColumnsForGrid(this.props.automations);
    }

    transformRows() {
        if (this.props.automations) {
            let displayList = this.props.automations.filter(
                (automation) => {
                    return "EMAIL" === automation.type;
                }
            );
            let rows = AutomationListTransformer.transformAutomationListRowsForGrid(displayList);
            return rows;
        }
        return [];
    }

    editAutomation = (automationId) => {
        let link = UrlUtils.getAutomationViewLink(this.getAppId(), automationId);
        if (this.props.history) {
            this.props.history.push(link);
        }
    }

    deleteAutomation() {
    }

    clickSaveRow() {
    }

    cancelEditingRow() {
    }

    handleTestAutomationClicked = (automationId) => {
        let automation = _.find(this.props.automations, {id: automationId});
        this.props.testAutomation(automation.name, this.getAppId());
    }

    render() {
        let loaded = !(_.isUndefined(this.props.automations));
        return (
            <Loader loaded={loaded} options={SpinnerConfigurations.AUTOMATION_LIST_LOADING}>
                <div className="automationSettings">
                    <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions()}/>
                    <div className="automationSettings--container">
                        <QbGrid
                            columns={this.transformColumns()}
                            rows={this.transformRows()}
                            numberOfColumns={3}
                            showRowActionsColumn={true}
                            cellRenderer={ReportCell}
                            onClickEditIcon={this.editAutomation}
                            onClickDeleteIcon={null}
                            onClickTestRowIcon={this.handleTestAutomationClicked}
                            editingRowErrors={[]}
                            onCancelEditingRow={this.cancelEditingRow}
                            onClickSaveRow={this.clickSaveRow}
                            rowActionsRenderer={AutomationRowActions}
                            disableMultiSelect={true}
                        />
                    </div>
                </div>
            </Loader>
        );
    }
}

AutomationListRoute.propTypes = {
    /** The list of automations to display. */
    automations: React.PropTypes.array,
    /** Get the list of automations for the app. */
    loadAutomations: React.PropTypes.func,
    testAutomation: React.PropTypes.func
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
