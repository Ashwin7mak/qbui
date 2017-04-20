import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import Locale from '../../../locales/locales';
import Stage from '../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../../../reuse/client/src/components/iconActions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../../reuse/client/src/components/icon/icon.js';
import TableCreationPanel from '../tableCreationPanel';
import QBModal from '../../qbModal/qbModal';
import {updateTable, loadTableProperties, setTableProperty, openIconChooser, closeIconChooser, setEditingProperty, resetEditedTableProperties, deleteTable, notifyTableDeleted} from '../../../actions/tablePropertiesActions';
import UrlUtils from '../../../utils/urlUtils';
import './tableProperties.scss';
import AppHistory from '../../../globals/appHistory';


export const TablePropertiesRoute = React.createClass({

    getInitialState() {
        return {
            confirmDeletesDialogOpen: false,
            allowDelete: false,
            confirmInputValue: ""
        };
    },
    getExistingTableNames() {
        if (this.props.app && this.props.app.tables) {
            return this.props.app.tables.map((table) => table.name);
        }
        return [];
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {i18nMessageKey: 'pageActions.deleteTable', icon:'delete', className:'deleteTable', onClick:this.handleDelete}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },
    getStageHeadline() {
        return <div className="tableSettingsStage stageHeadLine">{this.props.table ? <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.table.tableIcon} /> : null}<I18nMessage message={"settings.tableSettings"}/></div>;
    },
    componentDidMount() {
        if (this.props.app && this.props.table) {
            this.props.loadTableProperties(this.props.table);
        }
    },
    componentWillReceiveProps(nextProps) {
        if ((nextProps.table && this.props.table && this.props.table.id !== nextProps.table.id) || (!this.props.table && nextProps.table)) {
            nextProps.loadTableProperties(nextProps.table);
        }
    },
    updateTable() {
        this.updateTableProperties(this.props.app.id, this.props.table.id, this.props.tableProperties.tableInfo);
    },
    handleDeletePrompt(event) {
        if (event.target.value === Locale.getMessage('tableEdit.YES')) {
            this.setState({confirmInputValue: event.target.value, allowDelete: true});
        } else {
            this.setState({confirmInputValue: event.target.value, allowDelete: false});
        }
    },
    getConfirmDialog() {
        let msg = <div className="deleteTableDialogContent">
            <div className="note"><I18nMessage message="tableEdit.tableDeleteDialog.text"/></div>
            <div className="prompt"><I18nMessage message="tableEdit.tableDeleteDialog.prompt"/><input className="deletePrompt" type="text" maxLength="3" size="5" value={this.state.confirmInputValue} onChange={this.handleDeletePrompt}/></div>
        </div>;
        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('tableEdit.deleteTable')}
                primaryButtonOnClick={this.handleTableDelete}
                primaryButtonDisabled={!this.state.allowDelete}
                leftButtonName={Locale.getMessage('selection.dontDelete')}
                leftButtonOnClick={this.cancelTableDelete}
                title={Locale.getMessage('tableEdit.deleteThisTable', {tableName: this.props.table.name})}
                bodyMessage={msg}
                type="alert"/>);
    },
    handleDelete() {
        this.setState({confirmDeletesDialogOpen: true});
    },
    cancelTableDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    },
    handleTableDelete() {
        this.props.deleteTable(this.props.app.id, this.props.table.id).then(
            (response) => {
                this.props.notifyTableDeleted(true);
                // navigate to app home page
                let link = UrlUtils.getAppHomePageLink(this.props.app.id);
                AppHistory.history.push(link);
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableEdit.tableDeleteFailed'), Locale.getMessage('failed'));
            });
    },
    updateTableProperties(appId, tableId, tableInfo) {
        this.props.updateTable(appId, tableId, tableInfo).then(
            (response) => {
                NotificationManager.success(Locale.getMessage('tableEdit.tableUpdated'), Locale.getMessage('success'));
                let updatedTableInfo = tableInfo;
                let tableInfoObj = {};
                Object.keys(updatedTableInfo).forEach(function(key, index) {
                    tableInfoObj[key] = updatedTableInfo[key].value;
                });

                this.props.flux.actions.updateTableProps(this.props.table.id, tableInfoObj);
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableEdit.tableUpdateFailed'), Locale.getMessage('failed'));
            });
    },

    resetTableProperties() {
        this.props.resetEditedTableProperties();
        NotificationManager.success(Locale.getMessage('tableEdit.tableReset'), Locale.getMessage('success'));
    },

    render() {
        if (_.isUndefined(this.props.app) ||
            _.isUndefined(this.props.table) ||
            _.isUndefined(this.props.tableProperties) ||
            _.isNull(this.props.tableProperties.tableInfo)
        ) {
            return null;
        } else {
            let isDirty = this.props.isDirty ? true : false;
            let buttonsClasses = "tableInfoButtons " + (isDirty ? "open" : "closed");
            return (<div>
                <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}>
                    <div className="tableProperties-content"></div>
                </Stage>

                <div className="tableInfoPanel">
                    <TableCreationPanel tableInfo={this.props.tableProperties.tableInfo}
                                        iconChooserOpen={this.props.tableProperties.iconChooserOpen}
                                        openIconChooser={this.props.openIconChooser}
                                        setTableProperty={this.props.setTableProperty}
                                        closeIconChooser={this.props.closeIconChooser}
                                        setEditingProperty={this.props.setEditingProperty}
                                        focusOn={this.props.tableProperties.editing}
                                        validate={this.props.tableProperties.isDirty}
                                        appTables={this.getExistingTableNames()}
                    />
                    <div className={buttonsClasses}>
                        <a className="secondaryButton" onClick={this.resetTableProperties}><I18nMessage
                            message="nav.reset"/></a>
                        <Button className="primaryButton" bsStyle="primary" onClick={this.updateTable}><I18nMessage
                            message="nav.apply"/></Button>
                    </div>
                </div>
                {this.getConfirmDialog()}
            </div>);
        }
    }

});

const mapStateToProps = (state) => {
    return {
        tableProperties: state.tableProperties,
        isDirty: state.tableProperties && state.tableProperties.isDirty ? true : false
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTable: (appId, tableId, tableInfo) => {
            return dispatch(updateTable(appId, tableId, tableInfo));
        },
        loadTableProperties: (tableInfo) => {
            dispatch(loadTableProperties(tableInfo));
        },
        setTableProperty: (property, value, validationError, isUserEdit) => {
            dispatch(setTableProperty(property, value, validationError, isUserEdit));
        },
        openIconChooser: () => {
            dispatch(openIconChooser());
        },
        closeIconChooser: () => {
            dispatch(closeIconChooser());
        },
        setEditingProperty: (editing) => {
            dispatch(setEditingProperty(editing));
        },
        resetEditedTableProperties: () => {
            dispatch(resetEditedTableProperties());
        },
        deleteTable: (appId, tableId) => {
            return dispatch(deleteTable(appId, tableId));
        },
        notifyTableDeleted: (notify) => {
            dispatch(notifyTableDeleted(notify));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TablePropertiesRoute);
