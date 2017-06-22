import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import Loader from 'react-loader';
import {NotificationManager} from 'react-notifications';
import Locale from '../../../locales/locales';
import Stage from '../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../../../reuse/client/src/components/iconActions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../../reuse/client/src/components/icon/icon.js';
import TableCreationPanel from '../tableCreationPanel';
import RecordTitleFieldSelection from '../recordTitleFieldSelection';
import QBModal from '../../qbModal/qbModal';
import {updateTable, loadTableProperties, setTableProperty, openIconChooser, closeIconChooser, setEditingProperty, resetEditedTableProperties, deleteTable} from '../../../actions/tablePropertiesActions';
import {updateAppTableProperties} from '../../../actions/appActions';

import _ from 'lodash';

import './tableProperties.scss';

export const TablePropertiesRoute = React.createClass({

    getInitialState() {
        return {
            confirmDeletesDialogOpen: false,
            allowDelete: false,
            confirmInputValue: ""
        };
    },
    getExistingTableNames() {
        if (_.has(this.props, 'app.tables') &&  _.has(this.props, 'table.name')) {
            const tableNames = this.props.app.tables.map((table) => table.name);
            return _.without(tableNames, this.props.table.name);
        }
        return [];
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {i18nMessageKey: 'pageActions.deleteTable', icon:'delete', className:'deleteTable', showLabel: true, onClick:this.handleDelete}
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
        if (!_.isEqual(nextProps.table, this.props.table)) {
            nextProps.loadTableProperties(nextProps.table);
        }
    },
    updateTable() {
        if (_.has(this.props, 'app.id') && _.has(this.props, 'table.id') && _.has(this.props, 'tableProperties.tableInfo')) {
            this.updateTableProperties(this.props.app.id, this.props.table.id, this.props.tableProperties.tableInfo);
        }
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
            <div className="prompt"><I18nMessage message="tableEdit.tableDeleteDialog.prompt"/><input className="deletePrompt" type="text" maxLength="3" size="4" value={this.state.confirmInputValue} onChange={this.handleDeletePrompt}/></div>
        </div>;
        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('tableEdit.deleteTable')}
                primaryButtonOnClick={this.handleTableDelete}
                primaryButtonDisabled={!this.state.allowDelete}
                leftButtonName={Locale.getMessage('selection.dontDelete')}
                leftButtonOnClick={this.cancelTableDelete}
                title={Locale.getMessage('tableEdit.deleteThisTable', {tableName: this.props.table ? this.props.table.name : ""})}
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
        if (_.has(this.props, 'app.id') && _.has(this.props, 'table.id')) {
            this.props.deleteTable(this.props.app.id, this.props.table.id);
        }
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

                this.props.updateAppTableProperties(appId, tableId, tableInfoObj);
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableEdit.tableUpdateFailed'), Locale.getMessage('failed'));
            });
    },

    resetTableProperties() {
        this.props.resetEditedTableProperties();
        NotificationManager.success(Locale.getMessage('tableEdit.tableReset'), Locale.getMessage('success'));
    },

    /**
     * check for any validation errors in tableInfo
     * @returns {boolean}
     */
    canApplyChanges() {

        // can apply changes if no fields have a pendingValidationError value

        return this.props.isDirty && !_.findKey(this.props.tableProperties.tableInfo, (field) => field.pendingValidationError);
    },

    /**
     * update the recordTitleFieldId in table info
     * @param fid new field ID or null to unset it on the table
     */
    updateRecordTitleField(fid) {

        this.props.setTableProperty("recordTitleFieldId", fid, null, null, true);
    },

    render() {
        let loaded = !(_.isUndefined(this.props.app) || _.isUndefined(this.props.table) || _.isUndefined(this.props.tableProperties) || _.isNull(this.props.tableProperties.tableInfo));

        return <Loader loadedClassName="tablePropertiesLoaded" loaded={loaded}>
                <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}></Stage>

                <div className="dialogCreationPanelInfo">
                    <TableCreationPanel tableInfo={this.props.tableProperties.tableInfo}
                                        iconChooserOpen={this.props.tableProperties.iconChooserOpen}
                                        openIconChooser={this.props.openIconChooser}
                                        setTableProperty={this.props.setTableProperty}
                                        closeIconChooser={this.props.closeIconChooser}
                                        setEditingProperty={this.props.setEditingProperty}
                                        focusOn={this.props.tableProperties.editing}
                                        validate={this.props.tableProperties.isDirty}
                                        appTables={this.getExistingTableNames()}/>

                    <RecordTitleFieldSelection tableInfo={this.props.tableProperties.tableInfo} onChange={this.updateRecordTitleField} />

                    <div className="tableInfoButtons">
                        <Button disabled={!this.props.isDirty} className="secondaryButton resetButton" onClick={this.resetTableProperties}>
                            <I18nMessage message="nav.reset"/>
                        </Button>
                        <Button disabled={!this.canApplyChanges()} className="primaryButton" bsStyle="primary" onClick={this.updateTable}>
                            <I18nMessage message="nav.apply"/>
                        </Button>
                    </div>
                </div>
                {this.getConfirmDialog()}
        </Loader>;
    }
});

const mapStateToProps = (state) => {
    return {
        tableProperties: state.tableProperties,
        isDirty: state.tableProperties && state.tableProperties.isDirty ? true : false
    };
};

const mapDispatchToProps = {
    updateTable,
    loadTableProperties,
    setTableProperty,
    openIconChooser,
    closeIconChooser,
    setEditingProperty,
    resetEditedTableProperties,
    deleteTable,
    updateAppTableProperties
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TablePropertiesRoute);
