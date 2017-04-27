import React from 'react';
import Locale from '../../locales/locales';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import {connect} from 'react-redux';
import {openRecord, deleteRecords} from '../../actions/recordActions';
import {CONTEXT} from '../../actions/context';
import FieldUtils from '../../utils/fieldUtils';
import _ from 'lodash';
import './reportActions.scss';

import {EDIT_RECORD_KEY} from '../../constants/urlConstants';

/**
 * User-level actions
 *
 * Note: this component has been partially migrated to Redux
 */
export const UserActions = React.createClass({
    propTypes: {
        selection: React.PropTypes.array,
        roleId: React.PropTypes.string,
        appId: React.PropTypes.string,
        onEditSelected: React.PropTypes.func
    },

    getInitialState() {
        return {
            confirmDeletesDialogOpen: false
        };
    },
    getEmailSubject() {
        return "Email subject goes here";
    },

    getEmailBody() {
        return "Email body goes here";
    },

    getSelectionTip(actionMsg) {
        const action = Locale.getMessage(actionMsg);
        const user = Locale.getMessage('app.users.singular');
        const users = Locale.getMessage('app.users.plural');
        const suffix = this.props.selection.length === 1 ? user : users;

        return action + " " + this.props.selection.length + " " + suffix;
    },

    /**
     * delete the selected records, after confirmation if multiple records selected
     */
    handleDelete() {
        this.setState({confirmDeletesDialogOpen: true});
    },

    /**
     * multiple record delete was cancelled from dialog
     */
    cancelBulkDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    },
    /**
     * this.props.selection has the current selected rows with the unique identifier as the value in the array
     */
    handleBulkDelete() {
        {this.props.actions.unassignUsers(this.props.appId, this.props.roleId, this.props.selection);}
        this.setState({confirmDeletesDialogOpen: false});
    },

    /**
     * do a depth first search of the grouped records array, adding records
     * to arr so we can determine next/prev records
     * TODO: this is duplicated in reportContent..should be refactored out
     * TODY: into shared function
     * @param arr
     * @param groups
     */
    addGroupedRecords(arr, groups) {
        if (Array.isArray(groups)) {
            groups.forEach(child => {
                if (child.children) {
                    this.addGroupedRecords(arr, child.children);
                } else {
                    arr.push(child);
                }
            });
        }
    },

    getRecordsArray(data) {
        //  TODO: get from store
        const {filteredRecords, hasGrouping} = data;

        let recordsArray = [];
        if (hasGrouping) {
            // flatten grouped records
            this.addGroupedRecords(recordsArray, filteredRecords);
        } else {
            recordsArray = filteredRecords;
        }
        return recordsArray;
    },

    navigateToRecord(recId) {
        if (recId) {
            //  TODO: get from store
            const {data} = this.getReport();
            if (data) {
                const key = _.has(data, 'keyField.name') ? data.keyField.name : '';
                if (key) {
                    let recordsArray = this.getRecordsArray(data);

                    //  fetch the index of the row in the recordsArray that is being opened
                    const index = _.findIndex(recordsArray, rec => rec[key] && rec[key].value === recId);
                    let nextRecordId = (index < recordsArray.length - 1) ? recordsArray[index + 1][key].value : null;
                    let previousRecordId = index > 0 ? recordsArray[index - 1][key].value : null;

                    this.props.openRecord(recId, nextRecordId, previousRecordId);
                }
            }
        }
    },
    /**
     * edit icon was clicked
     */
    onEditClicked() {
        if (this.props.selection && this.props.selection.length === 1) {
            const recordId = this.getRecordIdFromReport(this.props);
            this.navigateToRecord(recordId);
            WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, recordId);
        }
    },

    getReport() {
        return _.find(this.props.report, function(rpt) {
            return rpt.id === CONTEXT.REPORT.NAV;
        });
    },

    getRecordIdFromReport() {
        //  find the report loaded for the navigation context
        let report = this.getReport();

        //  find the record
        const selectedRow = report.selectedRows;
        if (selectedRow && selectedRow.length === 1) {
            const selectedRecId = selectedRow[0];

            const key = FieldUtils.getPrimaryKeyFieldName(report.data);
            let record = _.find(report.data.records, function(rec) {
                return rec[key].value === selectedRecId;
            });
            return record[key].id;
        }
        return null;
    },

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmDialog() {

        let msg;

        if (this.props.selection.length > 1) {
            const users = "users";
            const deleteMSg = "Remove";
            msg = `${deleteMSg} ${this.props.selection.length} ${users}?`;
        } else {
            msg = Locale.getMessage('app.users.removeUser');
        }

        const bodymsg  = Locale.getMessage('app.users.unassignUser');

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('app.users.remove')}
                primaryButtonOnClick={this.handleBulkDelete}
                leftButtonName={Locale.getMessage('app.users.dontremove')}
                leftButtonOnClick={this.cancelBulkDelete}
                bodyMessage={bodymsg}
                type="error"
                title={msg}/>);
    },
    getEmailAction() {
        //TODO Email action is disabled for now until its implemented.
        return <ActionIcon icon="download-cloud" tip={Locale.getMessage("unimplemented.downloadCloud")} disabled={true}/>;
    },

    /**
     * render the actions, omitting 'edit' if we have multiple selections
     */
    render() {
        return (
            <div className={'reportActions'}>
                <div>
                    {<span className="selectedRowsLabel">{this.props.selection.length}</span>}
                    <div className="actionIcons">
                        {this.props.selection.length === 1 &&
                        <ActionIcon icon="edit" onClick={this.onEditClicked} tip={this.getSelectionTip("selection.edit")}/>
                        }
                        <ActionIcon icon="mail" tip={Locale.getMessage("unimplemented.emailApp")} disabled={true}/>
                        {this.getEmailAction()}
                        <ActionIcon icon="settings" tip={Locale.getMessage("unimplemented.settingsRole")} disabled={true}/>
                        <ActionIcon icon="errorincircle-fill" tip={this.getSelectionTip("app.users.remove")} onClick={this.handleDelete}/>
                    </div>
                </div>
                {this.getConfirmDialog()}
            </div>
        );
    }
});

export default UserActions;
