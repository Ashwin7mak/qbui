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
import "./automationList.scss";
import {CONTEXT} from "../../../actions/context";
import AutomationListTransformer from '../../../utils/automationListTransformer';

const CellRenderer = (props) => {return <div className="customCell">{props.text}</div>;};
const cellFormatter = (cellData) => {return React.createElement(CellRenderer, cellData);};


export class AutomationListRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {appId: this.getAppId()};
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

    renderAutomations() {
        if (this.props.automations && this.props.automations.length > 0) {
            return this.props.automations.filter((automation) => {
                    return "EMAIL" === automation.type;
                })
                .map((automation, index) => {
                    let link = UrlUtils.getAutomationViewLink(this.getAppId(), automation.id);
                    return (
                        <tr>
                            <td><Link to={link} onClick={this.onClick} onKeyDown={this.onClick}>{automation.name}</Link></td>
                            <td>{automation.active ? <I18nMessage message="automation.automationList.activeYes"/> : <I18nMessage message="automation.automationList.activeNo"/>}</td>
                            <td><Button className="finishedButton" bsStyle="primary" onClick={() => this.testButtonClicked(automation.name)}><I18nMessage message="automation.automationList.actionButton"/></Button></td>
                        </tr>
                    );
                });
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

    clickSaverow() {
    }

    cancelEditingRow() {
    }

    handleTestAutomationClicked = (automationId) => {
        let automation = _.find(this.props.automations, {id: automationId});
        this.props.testAutomation(automation.name, this.getAppId());
    }

    render() {
        let loaded = !(_.isUndefined(this.props.automations));
        let automationRows = this.renderAutomations();
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
                            onClickToggleSelectedRow={false}
                            cellRenderer={ReportCell}
                            onClickEditIcon={this.editAutomation}
                            onClickDeleteIcon={this.deleteAutomation}
                            onClickTestRowIcon={this.handleTestAutomationClicked}
                            editingRowErrors={[]}
                            onCancelEditingRow={this.cancelEditingRow()}
                            onClickSaveRow={this.clickSaverow()}
                            disableMultiSelect={true}
                        />
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
    testAutomation: React.PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        automations : getAutomationList(state),
        testAutomation: testAutomation(state)
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

