import React from 'react';
import Locale from '../../locales/locales';
import WindowLocationUtils from '../../utils/windowLocationUtils';
//import Fluxxor from "fluxxor";
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import {connect} from 'react-redux';
import {openRecord, deleteRecords} from '../../actions/recordActions';
import {CONTEXT} from '../../actions/context';
import FieldUtils from '../../utils/fieldUtils';
import _ from 'lodash';
import './reportActions.scss';

import {EDIT_RECORD_KEY} from '../../constants/urlConstants';


//let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * report-level actions
 *
 * Note: this component has been partially migrated to Redux
 */
export let ReportActions = React.createClass({
    //mixins: [FluxMixin],

    propTypes: {
        selection: React.PropTypes.array,
        rptId: React.PropTypes.string,
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        nameForRecords: React.PropTypes.string,
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
        const record = Locale.getMessage('records.singular');
        const records = Locale.getMessage('records.plural');

        const suffix = this.props.selection.length === 1 ? record : records;

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
        //const flux = this.getFlux();
        //flux.actions.deleteRecordBulk(this.props.appId, this.props.tblId, this.props.selection, this.props.nameForRecords);
        this.props.deleteRecords(this.props.appId, this.props.tblId, this.props.selection, this.props.nameForRecords);
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
            const records = Locale.getMessage('records.plural');
            const deleteMSg = Locale.getMessage('selection.delete');
            msg = `${deleteMSg} ${this.props.selection.length} ${records}?`;
        } else {
            msg = Locale.getMessage('selection.deleteThisRecord');
        }

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('selection.delete')}
                primaryButtonOnClick={this.handleBulkDelete}
                leftButtonName={Locale.getMessage('selection.dontDelete')}
                leftButtonOnClick={this.cancelBulkDelete}
                bodyMessage={msg}
                type="alert"/>);
    },
    getEmailAction() {
        //TODO Email action is disabled for now until its implemented.
        //return <EmailReportLink tip={this.getSelectionTip("selection.email") + " " + record}
        //                        subject={this.getEmailSubject()}
        //                        body={this.getEmailBody()}/>;
        return <ActionIcon icon="mail" tip={Locale.getMessage("unimplemented.email")} disabled={true}/>;
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
                        <ActionIcon icon="print" tip={Locale.getMessage("unimplemented.print")} disabled={true}/>
                        {this.getEmailAction()}
                        <ActionIcon icon="duplicate" tip={Locale.getMessage("unimplemented.copy")} disabled={true}/>
                        <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete")} onClick={this.handleDelete}/>


                    </div>
                </div>
                {this.getConfirmDialog()}
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        report: state.report
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        openRecord: (recId, nextId, prevId) => {
            dispatch(openRecord(recId, nextId, prevId));
        },
        deleteRecords: (recId, tblId, recIds, nameForRecords) => {
            dispatch(deleteRecords(recId, tblId, recIds, nameForRecords));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportActions);
