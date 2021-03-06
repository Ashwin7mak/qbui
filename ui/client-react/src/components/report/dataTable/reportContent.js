import React, {PropTypes} from "react";
import ReactIntl from "react-intl";
import {NOTIFICATION_MESSAGE_DISMISS_TIME} from '../../../../../reuse/client/src/scripts/notificationManager';
import CardViewListHolder from "../../../components/dataTable/cardView/cardViewListHolder";
import ReportGrid from "../../../components/dataTable/reportGrid/reportGrid";
import Logger from "../../../utils/logger";
import Breakpoints from "../../../utils/breakpoints";
import ReportActions from "../../actions/reportActions";
import ReportUtils from '../../../utils/reportUtils';
import {WindowHistoryUtils} from '../../../utils/windowHistoryUtils';
import * as SchemaConsts from "../../../constants/schema";
import {GROUP_TYPE} from "../../../../../common/src/groupTypes";
import Locales from "../../../locales/locales";
import ReportFooter from '../reportFooter';
import _ from 'lodash';
import {withRouter} from 'react-router-dom';
import ReportContentError from './reportContentError';
import UrlUtils from '../../../utils/urlUtils';
import QBModal from '../../qbModal/qbModal';
import Promise from 'bluebird';

import {connect} from 'react-redux';
import {createRecord, deleteRecord, editRecordStart, editRecordCancel, editRecordChange, editRecordValidateField, openRecord, updateRecord} from '../../../actions/recordActions';
import {addBlankRecordToReport, removeBlankRecordFromReport, selectReportRecords} from '../../../actions/reportActions';
import {tableFieldsReportDataObj} from '../../../reducers/fields';
import {APP_ROUTE, EDIT_RECORD_KEY} from '../../../constants/urlConstants';
import * as SchemaConstants from '../../../constants/schema';
import {CONTEXT} from '../../../actions/context';
import {getPendEdits} from '../../../reducers/record';
import {scrollingReport} from '../../../actions/shellActions';

let logger = new Logger();

let IntlMixin = ReactIntl.IntlMixin;

export const ReportContent = React.createClass({
    mixins: [IntlMixin],

    getInitialState() {
        return {
            confirmDeletesDialogOpen: false
        };
    },

    /**
     * do a depth first search of the grouped records array, adding records
     * to arr so we can determine next/prev records
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

    openRowToView(row) {
        const {appId, tblId, rptId} = this.props.reportData;

        var recId = row;
        //  for small breakpoint, row is an object..
        if (!_.isNumber(row)) {
            recId = row[this.props.primaryKeyName].value;
        }

        if (this.props.handleDrillIntoChild) {
            this.props.handleDrillIntoChild(tblId, recId, this.props.uniqueId);
        } else {
            this.openRow(recId);
            //create the link we want to send the user to and then send them on their way
            const link = `${APP_ROUTE}/${appId}/table/${tblId}/report/${rptId}/record/${recId}`;
            if (this.props.history) {
                this.props.history.push(link);
            }
        }
    },

    // row was clicked in the report; navigate to record
    openRow(recId) {
        //  TODO: improve the retrieve of a report from redux store
        const {filteredRecords, hasGrouping} = this.props.reportData.data;
        //const {filteredRecords, hasGrouping} = this.props.report[0].data;

        let recordsArray = [];
        if (hasGrouping) {
            // flatten grouped records
            this.addGroupedRecords(recordsArray, filteredRecords);
        } else {
            recordsArray = filteredRecords;
        }

        //  fetch the index of the row in the recordsArray that is being opened
        const key = this.props.primaryKeyName;
        const index = _.findIndex(recordsArray, rec => rec[key] && rec[key].value === recId);
        let nextRecordId = null;
        let previousRecordId = null;
        if (recId === "new" || index === -1) {
            // new record, no prev/next navigation
            nextRecordId = previousRecordId = null;
        } else {
            //  get the previous and next records id...these are used for navigation when viewing the record detail on the form
            nextRecordId = (index < recordsArray.length - 1) ? recordsArray[index + 1][key].value : null;
            previousRecordId = index > 0 ? recordsArray[index - 1][key].value : null;
        }

        this.props.openRecord(recId, nextRecordId, previousRecordId);
    },

    /**
     * Given a record id get the original values from the report.
     * @param recid
     * @returns {*}
     */
    getOrigRec(recId) {
        //  TODO: improve the retrieve of a report from redux store
        let recs = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];
        //let recs = this.props.report[0].data ? this.props.report[0].data.filteredRecords : [];

        let primaryKeyName = this.props.primaryKeyName;

        let fids = {};
        let orig = {names: {}, fids: fids};
        let idx = ReportUtils.findRecordIndex(recs, recId, primaryKeyName);
        if (idx !== -1) {
            let rec = recs[idx];
            orig.names = rec;
            let recKeys = Object.keys(rec);
            // have fid lookup hash
            recKeys.forEach((item) => {
                fids[rec[item].id] = rec[item];
            });
        }
        orig.fids = fids;
        return _.cloneDeep(orig);
    },

    /**
     * Given a record id get the original values from the grouped report.
     * @param recid
     * @returns {*}
     */
    getOrigGroupedRec(recId) {
        let orig = {names:{}, fids:{}};

        //  TODO: improve the retrieve of a report from redux store
        //let recs = this.props.report[0].data ? this.props.report[0].data.filteredRecords : [];
        let recs = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [{}];

        let primaryKeyName = this.props.primaryKeyName;

        let rec = ReportUtils.findGroupedRecord(recs, recId, primaryKeyName);

        orig.names = rec || {};
        let fids = {};

        if (rec !== null) {
            let recKeys = Object.keys(rec);
            // have fid lookup hash
            recKeys.forEach((item) => {
                fids[rec[item].id] = rec[item];
            });
        }
        orig.fids = fids;
        return _.cloneDeep(orig);
    },

    /**
     * Client side validation of array of changes to a record
     * placeholder method implementation TBD
     * @param changes
     * @returns {ok: boolean, errors: Array} result object {{ok: boolean, errors: Array}}
     */
    validateRecord(changes) {
        let statuses = [];
        let ok = true;
        // FOR M7 we will validate the record on server side
        //validate each change
        // Object.keys(changes).forEach((fieldId) => {
        //     let def = this.props.reportData.data.fieldsMap.get(+fieldId);
        //     let status = ValidationUtils.checkFieldValue(def, changes[fieldId].value, true);
        //     if (status.isInvalid) {
        //         ok = false;
        //         statuses.push(status);
        //     }
        // });
        //we will let the server validate these unchanged items not the client
        // //validate constrained fields that haven't changed, there constraints might have
        // let constrainedFieldValues = [];
        // this.getConstrainedUnchangedValues(changes, constrainedFieldValues);
        // constrainedFieldValues.forEach((data) => {
        //     let def = this.props.reportData.data.fieldsMap.get(data.id);
        //     let status = ValidationUtils.checkFieldValue(def, data.value, true);
        //     if (status.isInvalid) {
        //         ok = false;
        //         statuses.push(status);
        //     }
        // });

        // return validation errors changed or constrained values in record
        return {
            ok : ok,
            errors: statuses
        };
    },

    /**
     * When entering inline edit on a record, if it's an existing (already stored) record keep note
     * its originalRecord values (for later undo/audit?)
     * if it's a new (unsaved) record note all it's values as changes to the new record
     * to be saved.
     * Then initiate the recordPendingEditsStart action with the app/table/recId and originalRec if there
     * was one or changes if it's a new record
     * inlineEdit set to true by default, if its called from a trowser, the value passed in is going to be false
     * @param recId
     * @param fieldToStartEditing
     * @param inLineEdit
     */
    handleEditRecordStart(recId, fieldToStartEditing = null, inLineEdit = true) {
        if (_.has(this.props, 'reportData.data')) {
            let origRec = null;
            let changes = {};

            if (recId !== SchemaConsts.UNSAVED_RECORD_ID) {
                //  TODO: improve the retrieve of a report from redux store
                origRec = this.props.reportData.data.hasGrouping ? this.getOrigGroupedRec(recId) : this.getOrigRec(recId);
                //// this.props.report[0].data
            } else {
                changes = this.setNewRowFieldChanges(recId);
            }
            this.props.editRecordStart(this.props.appId, this.props.tblId, recId, origRec, changes, inLineEdit, fieldToStartEditing);
        }
    },

    /**
     * When an inline edit is canceled, if the recId is defined, then that means we are editing
     * and existing and should just cancel the edit operation.  If no recId, then we are editing a
     * new blank row and should remove that row from the report.
     * @param recId
     */
    handleEditRecordCancel(recId) {
        if (recId) {
            this.props.editRecordCancel(this.props.appId, this.props.tblId, recId);
        } else {
            this.props.removeBlankRecordFromReport(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, recId);
        }
    },

    /**
     * Initiate recordPendingEditsChangeField action to hold the unsaved field value change
     * @param change - {fid:fieldid, values : {oldVal :{}, newVal:{}, fieldName:name}
     */
    handleFieldChange(change) {

        // call action to hold the field value change

        // TODO: change to get from redux store
        // this.props.report[0].data
        let origRec = this.props.reportData.data.hasGrouping ? this.getOrigGroupedRec(change.recId) : this.getOrigRec(change.recId);
        this.props.editRecordChange(this.props.appId, this.props.tblId, change.recId, origRec, change);
    },

    /**
     *  When inline edit mode and user wants to add a new record and they are not currently trying to save or add a new record
     *  if there are pending edits or this record is not yet saved
     *  try save first before adding a new record
     *  if there are no unsaved changes or changes save successfully
     *  add a blank new unsaved record after the record specified
     * @param afterRecId
     */
    handleRecordNewBlank(afterRecId) {
        let recordId = afterRecId;
        // To maintain compatibility with AgGrid
        if (_.isObject(afterRecId)) {
            recordId = afterRecId.value;
        }

        let pendEdits = this.getPendEdits();

        // Don't allow a user to add multiple records in rapid succession (i.e., clicking "Save and add new" multiple times rapidly)
        if (pendEdits.saving) {
            return;
        }

        // if there are pending edits or this record is not saved try save instead of adding new one
        if (pendEdits.isPendingEdit || recordId === SchemaConsts.UNSAVED_RECORD_ID) {
            let saveRecordPromise = this.handleRecordSaveClicked(recordId, true, true);
        } else {
            this.props.addBlankRecordToReport(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, recordId, false);
        }
    },

    /**
     * User wants to save changes to a record.
     * @param id
     */
    handleRecordSaveClicked(id, showNotification = false, addNewRow = false) {
        let recordId = id;
        // To maintain compatibility with AgGrid
        if (_.isObject(id)) {
            recordId = id.value;
        }
        // update an existing records with changed values or add a new record
        if (recordId === SchemaConsts.UNSAVED_RECORD_ID) {
            let recordChanges = {};
            let pendEdits = this.getPendEdits();
            if (pendEdits.recordChanges) {
                recordChanges = _.cloneDeep(pendEdits.recordChanges);
            }
            return this.handleRecordAdd(recordChanges, showNotification, addNewRow);
        } else {
            return this.handleRecordChange(recordId, addNewRow);
        }
    },

    /**
     * User wants to delete a record
     *
     * @param record
     */
    handleRecordDelete(record) {
        let recordId;
        // TODO:: Simplify this once we can remove AgGrid. Once AgGrid is removed, we can assume the value coming back is a recordId or null.
        // https://quickbase.atlassian.net/browse/MB-1920
        if (_.isNumber(record)) {
            recordId = record;
        } else {
            recordId = record[this.props.primaryKeyName].value;
        }

        this.setState({selectedRecordId: recordId});
        this.setState({confirmDeletesDialogOpen: true});
    },

    /**
     * Delete a record, after getting confirmation
     * @returns {{confirmDeletesDialogOpen: boolean}}
     */
    deleteRecord() {
        this.props.deleteRecord(this.props.appId, this.props.tblId, this.state.selectedRecordId, this.props.nameForRecords);
        this.setState({confirmDeletesDialogOpen: false});
    },

    cancelRecordDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    },

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmationDialog() {

        let msg = Locales.getMessage('selection.deleteThisRecord');

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locales.getMessage('selection.delete')}
                primaryButtonOnClick={this.deleteRecord}
                leftButtonName={Locales.getMessage('selection.dontDelete')}
                leftButtonOnClick={this.cancelRecordDelete}
                title={msg}
                type="alert"/>);
    },

    /**
     * Save a new record
     * @param recordChanges
     * @param addNewRecordAfterSave flag for indicating whether a new record will be added following a successful save.
     * @returns {Array} of field values for the new record
     */
    handleRecordAdd(recordChanges, showNotificationOnSuccess = false, addNewRow = false) {
        let fields = {};
        let colList = [];
        if (_.has(this.props, 'fields.fields.data') && Array.isArray(this.props.fields.fields.data)) {
            fields = this.props.fields.fields.data;
            fields.forEach((field) => {
                colList.push(field.id);
            });
        }

        let params = {
            context: CONTEXT.REPORT.NAV,
            recordChanges: recordChanges,
            fields: fields,
            colList: colList,
            showNotificationOnSuccess: showNotificationOnSuccess,
            addNewRow: addNewRow
        };
        this.props.createRecord(this.props.appId, this.props.tblId, params).then(
            // if create is successful and adding a new blank row via inline edit, will
            // init the new row so that it be in the proper state.
            (obj) => {
                if (_.has(obj, 'recId') && addNewRow) {
                    let changes = this.setNewRowFieldChanges(SchemaConsts.UNSAVED_RECORD_ID);
                }
            },
            () => {}   // no work necessary if the promise rejects
        );
    },

    /**
     * Save changes to an existing record
     * @param recId
     * @param addNewRecordAfterSave flag for indicating whether a new record will be added following a successful save.
     */
    handleRecordChange(id, addNewRow = false) {
        let recordId = id;
        // To maintain compatibility with AgGrid
        if (_.isObject(id)) {
            recordId = recordId.value;
        }

        let colList = [];
        if (_.has(this.props, 'fields.fields.data') && Array.isArray(this.props.fields.fields.data)) {
            this.props.fields.fields.data.forEach((field) => {
                colList.push(field.id);
            });

            let pendEdits = this.getPendEdits();
            let params = {
                context: CONTEXT.REPORT.NAV,
                pendEdits: pendEdits,
                fields: this.props.fields.fields.data,
                colList: colList,
                showNotificationOnSuccess: true,
                addNewRow: addNewRow
            };
            this.props.updateRecord(this.props.appId, this.props.tblId, recordId, params).then(
                // if the update is successful and adding a new blank row via inline edit, will
                // init the new row so that it be in the proper state.
                (obj) => {
                    if (_.has(obj, 'recId') && addNewRow) {
                        let changes = this.setNewRowFieldChanges(SchemaConsts.UNSAVED_RECORD_ID);
                    }
                },
                () => {}   // no work necessary if the promise rejects
            );
        }
    },

    setNewRowFieldChanges(recId) {
        //add each non null value as to the new record as a change
        let newRec = null;
        if (this.props.reportData.data.hasGrouping) {
            newRec = ReportUtils.findGroupedRecord(this.props.reportData.data.filteredRecords, recId, this.props.primaryKeyName);
        } else {
            newRec = _.find(this.props.reportData.data.filteredRecords, (rec) => {
                return rec[this.props.primaryKeyName].value === recId;
            });
        }

        let changes = {};
        // loop thru the values in the new rec and add any non nulls to the changeSet so it will be treated as dirty/not saved
        Object.keys(newRec).forEach((key) => {
            let field = newRec[key];
            let fieldDef = _.has(this.props, 'reportData.data.fieldsMap') ? this.props.reportData.data.fieldsMap.get(+field.id) : null;
            if (fieldDef && !fieldDef.builtIn) {
                let change = {
                    //the + before field.id is needed turn the field id from string into a number
                    oldVal: {value: undefined, id: +field.id},
                    newVal: {value: field.value},
                    fieldName: key,
                    fieldDef: fieldDef
                };
                changes[field.id] = change;
            }
        });
        return changes;
    },

    handleValidateFieldValue(fieldDef, fieldName, value, checkRequired) {
        // check the value against the fieldDef
        if (fieldDef) {

            let recId = undefined;
            let pendEdits = this.getPendEdits();

            // if inline edit is open, what is the current editing record id
            if (pendEdits.isInlineEditOpen) {
                recId = pendEdits.currentEditingRecordId;
            }

            if (recId !== undefined) {
                this.props.editRecordValidateField(recId, fieldDef, fieldName, value, checkRequired);
            } else {
                let error = 'Record id not provided for field validation in reportContent';
                logger.warn(error);
                return Promise.reject(error);
            }
        } else {
            let error = 'Field Def not provided for field validation in reportContent';
            logger.warn(error);
            return Promise.reject(error);
        }
    },

    selectRows(selectedRows) {
        this.props.selectReportRecords(CONTEXT.REPORT.NAV, selectedRows);
    },

    toggleSelectedRow(id) {

        let selectedRows = this.props.reportData.selectedRows;
        if (!Array.isArray(selectedRows)) {
            selectedRows = [];
        }
        // add to selectedRows if id is not in the list
        if (selectedRows.indexOf(id) === -1) {
            selectedRows.push(id);
        } else {
            // id is in the list, remove it
            selectedRows = _.without(selectedRows, id);
        }

        this.props.selectReportRecords(CONTEXT.REPORT.NAV, selectedRows);
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    openRecordForEditInTrowser(recordId) {
        //both actions should just add one record to the state, so passing the record id,
        //so that the record gets updated
        this.openRow(recordId);
        this.handleEditRecordStart(recordId, null, false);
        WindowHistoryUtils.pushWithQuery(EDIT_RECORD_KEY, recordId);
    },

    /**
     * when we scroll the grid wrapper, hide the add record
     * icon for a bit
     */
    onScrollRecords() {
        const createTimeout = () => {
            this.scrollTimer = setTimeout(() => {
                this.scrollTimer = null;
                this.props.scrollingReport(false);
            }, 1000);
        };

        if (this.scrollTimer) {
            //reset timeout
            clearTimeout(this.scrollTimer);
            createTimeout();
        } else {
            this.props.scrollingReport(true);
            createTimeout();
        }

    },

    isNumericDataType(dataType) {
        return dataType === SchemaConsts.NUMERIC ||
            dataType === SchemaConsts.CURRENCY ||
            dataType === SchemaConsts.PERCENT ||
            dataType === SchemaConsts.RATING;
    },

    isDateDataType(dataType) {
        return dataType === SchemaConsts.DATE_TIME ||
            dataType === SchemaConsts.DATE;
    },

    parseTimeOfDay(timeOfDay) {

        if (timeOfDay && typeof timeOfDay === 'string') {
            //  format is expected to be either hh:mm or hh:mm:ss
            let el = timeOfDay.split(":");
            if (el.length === 2 || el.length === 3) {
                let hr = el[0];
                let min = el[1];
                let sec = 0;
                if (el.length === 3) {
                    sec = el[2];
                }

                //  the date component means nothing to the app..its only purpose is for verifying unit tests
                let parsedDate = new Date(1970, 1, 1, hr, min, sec);
                if (parsedDate instanceof Date) {
                    if (!isNaN(parsedDate.getTime())) {
                        return parsedDate;
                    }
                }
            }
        }

        logger.warn('Invalid grouping header.  Unable to parse time of day group header: ' + timeOfDay);
        return null;
    },

    /**
     * Scan through the grouped data object and where appropriate, localize the grouping headers.
     * Dates, durations and numerics may require localization.  All others fall though and no operation
     * is performed on those types.
     *
     * @param groupFields
     * @param groupDataRecords
     * @param lvl
     */
    localizeGroupingHeaders(groupFields, groupDataRecords, lvl) {

        if (!groupFields || !groupDataRecords) {
            return;
        }

        if (groupFields.length > lvl) {
            //  get the current group by field and grouping type
            let groupField = groupFields[lvl].field;
            let groupType = groupFields[lvl].groupType;

            for (let group in groupDataRecords) {

                //  Recursive call get to the last grouping field, and then update the grouping
                //  labels as we work our way back to the top of the stack.
                if (lvl < groupFields.length - 1 && groupDataRecords[group].children) {
                    this.localizeGroupingHeaders(groupFields, groupDataRecords[group].children, lvl + 1);
                }

                let groupData = groupDataRecords[group];

                // unlikely, but possible that groupData is empty
                if (groupData && !groupData.localized) {

                    //  mark that the group label has been localized so that if this component is called
                    //  with already localized data (ie: browser resize), we avoid localizing values
                    //  that have already been localized.
                    groupData.localized = true;

                    if (groupData.group === undefined) {
                        continue;
                    }
                    //  If no grouping header, use the empty label
                    if (groupData.group === null || groupData.group === '') {
                        groupData.group = Locales.getMessage('groupHeader.empty');
                        continue;
                    }

                    // ensure group label is a string as String.split method is called
                    groupData.group = groupData.group.toString();

                    //  Apply locale specific formatting against DATES, DURATIONS and NUMERICS.  Note that
                    //  some data types and grouping options drop through the conditional blocks.  That's okay
                    //  as these will not have any localization requirements.
                    if (this.isNumericDataType(groupField.datatypeAttributes.type)) {
                        //
                        //  Check if the numeric is a range, with a lower and upper value.
                        let range = groupData.group.split(GROUP_TYPE.delimiter);
                        if (range.length > 1) {
                            //  For ranges,no symbol is used in the header..just localized the number
                            let localizedRange = {
                                lower: this.localizeNumber(range[0]),
                                upper: this.localizeNumber(range[1])
                            };
                            groupData.group = Locales.getMessage('groupHeader.numeric.range', localizedRange);
                        } else {
                            /*eslint no-lonely-if:0*/
                            if (groupType === GROUP_TYPE.COMMON.equals) {
                                //  Currency and percent symbols are added only when group type is equals.
                                if (groupField.datatypeAttributes.type === SchemaConsts.CURRENCY) {
                                    groupData.group = this.localizeNumber(range[0], {style: 'currency', currency: Locales.getCurrencyCode()});
                                } else {
                                    if (groupField.datatypeAttributes.type === SchemaConsts.PERCENT) {
                                        groupData.group = this.localizeNumber(range[0], {style: 'percent'});
                                    } else {
                                        groupData.group = this.localizeNumber(range[0]);
                                    }
                                }
                            } else {
                                groupData.group = this.localizeNumber(range[0]);
                            }
                        }

                        // continue to next element in the for loop
                        continue;
                    }

                    if (this.isDateDataType(groupField.datatypeAttributes.type)) {
                        //
                        //  Based on grouping option, dates may contain 2 pieces of data or just a single value.
                        let datePart = groupData.group.split(GROUP_TYPE.delimiter);
                        if (datePart.length > 1) {
                            switch (groupType) {
                            case GROUP_TYPE.DATE.month:
                                let month = Locales.getMessage('month.' + datePart[0].toLowerCase());
                                groupData.group = Locales.getMessage('groupHeader.date.month', {month: month, year: datePart[1]});
                                break;
                            case GROUP_TYPE.DATE.quarter:
                                let abbrQuarter = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter: abbrQuarter, year: datePart[1]});
                                break;
                            case GROUP_TYPE.DATE.fiscalQuarter:
                                let abbrFiscalQtr = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                let abbrFiscalYr = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[1];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter: abbrFiscalQtr, year: abbrFiscalYr});
                                break;
                            }
                        } else {
                            switch (groupType) {
                            case GROUP_TYPE.DATE.fiscalYear:
                                groupData.group = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[0];
                                break;
                            case GROUP_TYPE.DATE.week:
                                groupData.group = Locales.getMessage('groupHeader.date.week', {date: this.localizeDate(datePart[0])});
                                break;
                            case GROUP_TYPE.DATE.day:
                                groupData.group = this.localizeDate(datePart[0]);
                                break;
                            case GROUP_TYPE.DATE.equals:
                                let opts = null;
                                if (groupField.datatypeAttributes.type === SchemaConsts.DATE_TIME) {
                                    opts = {
                                        year: 'numeric', month: 'numeric', day: 'numeric',
                                        hour: 'numeric', minute: 'numeric'
                                    };
                                }
                                groupData.group = this.localizeDate(datePart[0], opts);

                                //  i18n-react appends a comma after the date for en-us --> 07/22/2015, 09:44 AM -- Replace with space
                                if (groupField.datatypeAttributes.type === SchemaConsts.DATE_TIME && Locales.getLocale() === 'en-us') {
                                    groupData.group = groupData.group.replace(',', ' ');
                                }

                                break;
                            }
                        }

                        // continue to next element in the for loop
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === SchemaConsts.TIME_OF_DAY) {

                        let timeOfDay = null;

                        switch (groupType) {
                        case GROUP_TYPE.TIME_OF_DAY.equals:
                        case GROUP_TYPE.TIME_OF_DAY.second:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric', second: 'numeric'});
                            }
                            break;
                        case GROUP_TYPE.TIME_OF_DAY.minute:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric'});
                            }
                            break;
                        case GROUP_TYPE.TIME_OF_DAY.hour:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric'});
                            }
                            break;
                        case GROUP_TYPE.TIME_OF_DAY.am_pm:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = (timeOfDay.getHours() < 12 ? Locales.getMessage('groupHeader.am') : Locales.getMessage('groupHeader.pm'));
                            }
                            break;
                        }

                        // continue to next element in the for loop
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === SchemaConsts.DURATION) {
                        //  With duration of equals, the group value contains 2 pieces of information;
                        //  the 1st is the duration value; the 2nd is the group type.
                        if (groupType === GROUP_TYPE.DURATION.equals) {
                            let durationPart = groupData.group.split(GROUP_TYPE.delimiter);
                            if (durationPart.length > 1) {
                                groupData.group = durationPart[0];
                                //  reset the groupType to the duration dimension
                                groupType = durationPart[1];
                            }
                        }

                        let messageKey = '';
                        switch (groupType) {
                        case GROUP_TYPE.DURATION.second:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.second' : 'groupHeader.duration.seconds';
                            break;
                        case GROUP_TYPE.DURATION.minute:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.minute' : 'groupHeader.duration.minutes';
                            break;
                        case GROUP_TYPE.DURATION.hour:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.hour' : 'groupHeader.duration.hours';
                            break;
                        case GROUP_TYPE.DURATION.week:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.week' : 'groupHeader.duration.weeks';
                            break;
                        case GROUP_TYPE.DURATION.day:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.day' : 'groupHeader.duration.days';
                            break;
                        }

                        // this should not happen, but in the event messageKey is empty(meaning bad duration data),
                        // this falls through and the original content in groupData.group is used as the grouping header.
                        if (messageKey) {
                            groupData.group = Locales.getMessage(messageKey, {duration: groupData.group});
                        }
                    }
                }
            }

        }
    },

    /**
     * Directly call the I18n mixin method to localize the number.  Any error
     * trying to localize will return the original value.
     *
     * @param value
     * @param opts
     * @returns {*}
     */
    localizeNumber: function(value, opts) {
        try {
            this.context.locales = Locales.getLocale();
            return this.formatNumber(value, opts);
        } catch (e) {
            logger.warn("Error attempting to localize a numbered group.  Group value: " + value);
            return value;
        }
    },

    /**
     * Directly call the I18n mixin method to localize the date.  Any error
     * trying to localize will return the original date.
     *
     * @param date
     * @returns {*}
     */
    localizeDate: function(date, opts) {
        try {
            this.context.locales = Locales.getLocale();
            return this.formatDate(date, opts);
        } catch (e) {
            logger.warn("Error attempting to localize a date group.  Group value: " + date);
            return date;
        }
    },

    getPendEdits() {
        return getPendEdits(this.props.record);
    },

    render() {
        //  Get the pending props from the redux store..
        let pendEdits = this.getPendEdits();

        let isSmall = Breakpoints.isSmallBreakpoint();
        let recordsCount = 0;
        let selectedRows = [];

        if (this.props.reportData && this.props.reportData.data) {
            let reportData = this.props.reportData.data;
            recordsCount = reportData.filteredRecordsCount ? reportData.filteredRecordsCount : reportData.recordsCount;
            this.localizeGroupingHeaders(reportData.groupFields, reportData.filteredRecords, 0);
            selectedRows = this.props.reportData.selectedRows || [];
        }

        // Hide the footer if any rows are selected and for small breakpoint.
        let areRowsSelected = !!(selectedRows && selectedRows.length > 0);

        let classNames = ['reportContent'];
        const isRowPopUpMenuOpen = this.props.isRowPopUpMenuOpen;
        const isInlineEditOpen = pendEdits.isInlineEditOpen;
        if (isInlineEditOpen) {
            classNames.push('inlineEditing');
        } else if (isRowPopUpMenuOpen) {
            classNames.push('rowPopUpMenuOpen');
        }
        if (isSmall) {
            classNames.push('small');
        }

        classNames.push(this.props.reportData.loading ? 'loading' : '');

        const editErrors = pendEdits.editErrors || null;

        // onCellClick handler: do nothing for embedded reports phase1.
        let openRowToView = this.openRowToView;

        let reportContent;

        if (this.props.reportData.error) {
            reportContent = <ReportContentError errorDetails={this.props.reportData.errorDetails} />;
        } else {
            reportContent = (
                    <div className={classNames.join(' ')}>
                        {!isSmall &&
                            <ReportGrid
                                appId={this.props.reportData.appId}
                                tblId={this.props.reportData.tblId}
                                rptId={this.props.reportData.rptId}
                                selectedTable={this.props.selectedTable}
                                noRowsUI={this.props.noRowsUI}
                                records={this.props.reportData.data ? _.cloneDeep(this.props.reportData.data.filteredRecords) : []}
                                columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                                primaryKeyName={this.props.primaryKeyName}
                                loading={this.props.reportData.loading}
                                appUsers={this.props.appUsers}
                                onFieldChange={this.handleFieldChange}
                                onEditRecordStart={this.handleEditRecordStart}
                                onCellClick={openRowToView}
                                selectedRows={this.props.selectedRows}
                                onRecordDelete={this.handleRecordDelete}
                                onEditRecordCancel={this.handleEditRecordCancel}
                                editErrors={editErrors}
                                onRecordNewBlank={this.handleRecordNewBlank}
                                onClickRecordSave={this.handleRecordSaveClicked}
                                editingIndex={this.props.reportData.editingIndex}
                                editingId={this.props.reportData.editingId}
                                selectRows={this.selectRows}
                                toggleSelectedRow={this.toggleSelectedRow}
                                openRecordForEdit={this.openRecordForEditInTrowser}
                                handleValidateFieldValue={this.handleValidateFieldValue}
                                sortFids={this.props.reportData.data ? this.props.reportData.data.sortFids : []}

                                // for relationships phase-1
                                phase1={this.props.phase1}
                            />
                        }
                        {isSmall &&
                        <CardViewListHolder reportData={this.props.reportData}
                                            noRowsUI={this.props.noRowsUI}
                                            appUsers={this.props.appUsers}
                                            selectedTable={this.props.selectedTable}
                                            primaryKeyName={this.props.primaryKeyName}
                                            reportHeader={this.props.reportHeader}
                                            selectionActions={<ReportActions selection={this.props.selectedRows}/>}
                                            onScroll={this.onScrollRecords}
                                            onRowClicked={this.openRowToView}
                                            selectedRows={this.props.selectedRows}
                                            selectRows={this.selectRows}
                                            pageStart={this.props.cardViewPagination.props.pageStart}
                                            pageEnd={this.props.cardViewPagination.props.pageEnd}
                                            getNextReportPage={this.props.cardViewPagination.props.getNextReportPage}
                                            getPreviousReportPage={this.props.cardViewPagination.props.getPreviousReportPage}
                                            onAddNewRecord={this.props.onAddNewRecord}/>
                        }
                        {this.getConfirmationDialog()}
                    </div>
            );
        }

        return (
            <div className="loadedContent">
                {reportContent}
            </div>
        );
    }

});

ReportContent.contextTypes = {
    touch: PropTypes.bool
};

ReportContent.propTypes = {
    primaryKeyName: PropTypes.string.isRequired,

    /**
     * callback for creating a new record
     */
    onAddNewRecord: PropTypes.func
};

const mapStateToProps = (state, props) => {
    return {
        report: state.report,
        record: state.record,
        fields: tableFieldsReportDataObj(state.fields, props.appId, props.tblId)
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        selectReportRecords: (context, selections) => {
            dispatch(selectReportRecords(context, selections));
        },
        openRecord:(recId, nextRecordId, prevRecordId) => {
            dispatch(openRecord(recId, nextRecordId, prevRecordId));
        },
        editRecordStart: (appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing) => {
            dispatch(editRecordStart(appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing));
        },
        editRecordCancel: (appId, tblId, recId) => {
            dispatch(editRecordCancel(appId, tblId, recId));
        },
        editRecordChange: (appId, tblId, recId, origRec, changes) => {
            dispatch(editRecordChange(appId, tblId, recId, origRec, changes));
        },
        editRecordValidateField: (fieldDef, fieldName, value, checkRequired) => {
            dispatch(editRecordValidateField(fieldDef, fieldName, value, checkRequired));
        },
        addBlankRecordToReport: (context, appId, tblId, afterRecId, showNotification) => {
            dispatch(addBlankRecordToReport(context, afterRecId)).then(
                () => {
                    dispatch(editRecordStart(appId, tblId, SchemaConstants.UNSAVED_RECORD_ID, null, null, true, null));
                    if (showNotification) {
                        NotificationManager.success(Locales.getMessage('recordNotifications.recordAdded'), Locales.getMessage('success'),
                            NOTIFICATION_MESSAGE_DISMISS_TIME);
                    }
                }
            );
        },
        removeBlankRecordFromReport: (context, appId, tblId, recId) => {
            dispatch(removeBlankRecordFromReport(context, appId, tblId, recId));
        },
        deleteRecord:  (appId, tblId, recId, nameForRecords) => {
            dispatch(deleteRecord(appId, tblId, recId, nameForRecords));
        },
        updateRecord:(appId, tblId, recId, params) => {
            return dispatch(updateRecord(appId, tblId, recId, params));
            //  NOTE: speed of calling the 'add blank row' action after the update in this
            //  component is a concern as there is a noticeable pause between when the
            //  inline edit row is updated and the new row is added to the grid. So, the
            //  new row is added after the record save reducer event is executed but before
            //  the grid is refreshed.  See record save reducer for more info..
        },
        createRecord: (appId, tblId, params) => {
            return dispatch(createRecord(appId, tblId, params));
            //  NOTE: speed of calling the 'add blank row' action after the update in this
            //  component is a concern as there is a noticeable pause between when the
            //  inline edit row is updated and the new row is added to the grid. So, the
            //  new row is added after the record save reducer event is executed but before
            //  the grid is refreshed.  See record save reducer for more info..
        },
        scrollingReport
    };
};

export const ReportContentWithRouter = withRouter(ReportContent);
export const ConnectedReportContentRoute = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportContent);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportContentWithRouter);
