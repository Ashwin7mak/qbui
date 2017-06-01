import React from 'react';
import Trowser from "../trowser/trowser";
import Record from "./record";
import {I18nMessage} from '../../utils/i18nMessage';
import Button from 'react-bootstrap/lib/Button';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import QBicon from "../qbIcon/qbIcon";
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import Loader from 'react-loader';
import QBErrorMessage from "../QBErrorMessage/qbErrorMessage";
import {WindowHistoryUtils} from '../../utils/windowHistoryUtils';
import * as SchemaConsts from "../../constants/schema";
import _ from 'lodash';
import AppHistory from '../../globals/appHistory';
import * as SpinnerConfigurations from "../../constants/spinnerConfigurations";
import {HideAppModal} from '../qbModal/appQbModalFunctions';
import {connect} from 'react-redux';
import {saveForm, saveFormComplete, syncForm} from '../../actions/formActions';
import {showErrorMsgDialog, hideErrorMsgDialog} from '../../actions/shellActions';
import {editRecordCancel, openRecord, createRecord, updateRecord} from '../../actions/recordActions';
import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
import {APP_ROUTE, EDIT_RECORD_KEY} from '../../constants/urlConstants';
import {CONTEXT} from '../../actions/context';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import {getPendEdits, getRecord} from '../../reducers/record';
import {getRecordTitle} from '../../utils/formUtils';
import './recordTrowser.scss';
import {NEW_RECORD_VALUE} from "../../constants/urlConstants";
import {loadDynamicReport} from '../../actions/reportActions';
import NumberUtils from '../../utils/numberUtils';
import constants from '../../../../common/src/constants';
import * as UrlConsts from "../../constants/urlConstants";
import QueryUtils from '../../utils/queryUtils';
/**
 * trowser containing a record component
 *
 * Note: this component has been partially migrated to Redux
 */
export const RecordTrowser = React.createClass({

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        recId: React.PropTypes.string,
        editingAppId: React.PropTypes.string,
        editingTblId: React.PropTypes.string,
        editingRecId: React.PropTypes.number,
        editingApp: React.PropTypes.object,
        editingTable: React.PropTypes.object,
        viewingRecordId: React.PropTypes.string,
        visible: React.PropTypes.bool,
        editForm: React.PropTypes.object,
        reportData: React.PropTypes.object,
        errorPopupHidden: React.PropTypes.bool,
        onHideTrowser: React.PropTypes.func.isRequired
    },

    _hasErrorsAndAttemptedSave() {
        const pendEdits = this.getPendEdits();
        return (_.has(pendEdits, 'editErrors.errors') && pendEdits.editErrors.errors.length > 0 && pendEdits.hasAttemptedSave);
    },

    _doesNotHaveErrors() {
        const pendEdits = this.getPendEdits();
        return (!_.has(pendEdits, 'editErrors.errors') || pendEdits.editErrors.errors.length === 0 || !pendEdits.hasAttemptedSave);
    },

    /**
     * get trowser content (report nav for now)
     */
    getTrowserContent() {
        let hideErrorMessage = this.props.shell ? this.props.shell.errorPopupHidden : true;
        let errorMessage = [];
        const pendEdits = this.getPendEdits();
        if (_.has(pendEdits, 'editErrors.errors')) {
            hideErrorMessage = hideErrorMessage || this._doesNotHaveErrors();
            errorMessage = pendEdits.editErrors.errors;
        }

        return (this.props.visible &&
            <Loader loaded={!this.props.editForm || (!this.props.editForm.loading && !this.props.editForm.saving)}
                    options={SpinnerConfigurations.TROWSER_CONTENT}>
                <Record
                    selectedApp={this.props.editingApp}
                    appId={this.props.editingAppId}
                    tblId={this.props.editingTblId}
                    recId={this.props.editingRecId}
                    appUsers={this.props.appUsers}
                    errorStatus={this.editForm ? this.props.editForm.errorStatus : null}
                    pendEdits={pendEdits}
                    formData={this.props.editForm ? this.props.editForm.formData : null}
                    edit={true} />
                <QBErrorMessage message={errorMessage} hidden={hideErrorMessage} onCancel={this.dismissErrorDialog}/>
            </Loader>);
    },
    /**
     *  get actions element for bottom center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    },

    /**
     * navigate to new record if appropriate
     */
    navigateToNewRecord(recId) {

        const record = this.getRecordFromProps(this.props);
        if (record.navigateAfterSave === true) {
            let {editingAppId, editingTblId} = this.props;
            this.props.history.push(`${APP_ROUTE}/${editingAppId}/table/${editingTblId}/record/${recId}`);
        }
    },

    /**
     * User wants to save changes to a record. First we do client side validation
     * and if validation is successful we initiate the save action for the new or existing record
     * if validation if not ok we stay in edit mode and show the errors (TBD)
     * @param openNewRecord if true, keep trowser open after save with a new blank record
     * @returns {boolean}
     */
    saveClicked(openNewRecord = false) {
        //validate changed values -- this is skipped for now
        //get pending changes
        let validationResult = {
            ok : true,
            errors: []
        };

        if (validationResult.ok) {
            //signal record save action, will update an existing records with changed values
            // or add a new record
            //let promise;
            //let updateRecord = false;
            const formType = CONTEXT.FORM.EDIT;

            //  open the 'modal working' spinner/window for the record's form
            this.props.saveForm(formType);

            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                const pendEdits = this.getPendEdits();
                this.handleRecordAdd(pendEdits.recordChanges, formType, false, openNewRecord);
            } else {
                //updateRecord = true;
                this.handleRecordChange(formType, false, openNewRecord);
            }
            //promise.then((obj) => {
            //    //  update the grid with the change..this is expected to get refactored once the record store is moved to redux..
            //    //if (updateRecord === true) {
            //    //    this.props.updateReportRecord(obj, CONTEXT.REPORT.NAV);
            //    //}
            //
            //    this.props.saveFormSuccess(formType);
            //
            //    if (this.props.viewingRecordId === obj.recId) {
            //        this.props.syncForm("view");
            //    }
            //
            //    if (openNewRecord) {
            //        this.props.editNewRecord(false);
            //    } else {
            //        this.hideTrowser();
            //        this.navigateToNewRecord(obj.recId);
            //    }
            //
            //}, (errorStatus) => {
            //    this.props.saveFormError(formType, errorStatus);
            //    this.showErrorDialog();
            //});
        }
        return validationResult;
    },

    /**
     * User wants to save changes to a record. First we do client side validation
     * and if validation is successful we initiate the save action for the new or existing record
     * if validation if not ok we stay in edit mode and show the errors (TBD)
     * @param id
     * @returns {boolean}
     */
    saveAndNextClicked() {
        //validate changed values -- this is skipped for now
        //get pending changes
        let validationResult = {
            ok : true,
            errors: []
        };

        if (validationResult.ok) {
            //signal record save action, will update an existing records with changed values
            // or add a new record
            //let promise;


            //let updateRecord = false;
            const formType = CONTEXT.FORM.EDIT;

            // open the 'modal working' spinner/window for the record's form
            this.props.saveForm(formType);

            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                const pendEdits = this.getPendEdits();
                this.handleRecordAdd(pendEdits.recordChanges, formType, true);
            } else {
                //updateRecord = true;
                this.handleRecordChange(formType, true);
            }
            //promise.then((obj) => {
            //    //  update the grid with the change..this is expected to get refactored once the record store is moved to redux..
            //    //if (updateRecord === true) {
            //    //    this.props.updateReportRecord(obj, CONTEXT.REPORT.NAV);
            //    //}
            //
            //    this.props.saveFormSuccess(formType);
            //    if (this.props.viewingRecordId === this.props.recId) {
            //        this.props.syncForm("view");
            //    }
            //
            //    this.nextRecord();
            //}, (errorStatus) => {
            //    this.props.saveFormError(formType, errorStatus);
            //    this.showErrorDialog();
            //});
        }
        return validationResult;
    },
    /**
     * Save changes to an existing record
     * @param recId
     * @returns {Array}
     */
    handleRecordChange(formType, next = false, openNewRecord = false) {

        let colList = [];
        // we need to pass in cumulative fields' fid list from report - because after form save report needs to be updated and we need to get the record
        // with the right column list from the server
        if (_.has(this.props.reportData, 'data.fields') && Array.isArray(this.props.reportData.data.fields)) {
            this.props.reportData.data.fields.forEach((field) => {
                colList.push(field.id);
            });
        }
        const pendEdits = this.getPendEdits();

        let params = {
            context: CONTEXT.REPORT.NAV,
            pendEdits: pendEdits,
            fields: _.has(this.props.editForm, 'formData.fields') ? this.props.editForm.formData.fields : {},
            colList: colList,
            showNotificationOnSuccess: true,
            addNewRow: false
        };
        this.props.dispatch(updateRecord(this.props.editingAppId, this.props.editingTblId, this.props.editingRecId, params)).then(
            (obj) => {
                //  need to call as the form.saving attribute is used to determine when to
                //  open/close the 'modal working' spinner/window..
                this.props.saveFormComplete(formType);
                if (this.props.viewingRecordId === obj.recId) {
                    this.props.syncForm(CONTEXT.FORM.VIEW);
                }

                if (next) {
                    this.nextRecord();
                } else {
                    /*eslint no-lonely-if:0*/
                    if (!openNewRecord) {
                    //    this.props.editNewRecord(false);
                    //} else {
                        this.hideTrowser();
                        this.navigateToNewRecord(obj.recId);
                    }
                }
            },
            () => {
                //  need to call as the form.saving attribute as it is used to determine when to
                //  open/close the 'modal working' spinner/window..
                this.props.saveFormComplete(formType);
                this.showErrorDialog();
            }
        );
    },

    /**
     * Save a new record
     * @param recordChanges
     * @returns {Array} of field values for the new record
     */
    handleRecordAdd(recordChanges, formType, next = false, openNewRecord = false) {
        let colList = [];
        // we need to pass in cumulative fields' fid list from report - because after form save report needs to be updated and we need to get the record
        // with the right column list from the server
        if (_.has(this.props.reportData, 'data.fields') && Array.isArray(this.props.reportData.data.fields)) {
            this.props.reportData.data.fields.forEach((field) => {
                colList.push(field.id);
            });
        }
        let params = {
            context: CONTEXT.REPORT.NAV,
            recordChanges: recordChanges,
            fields: _.has(this.props.editForm, 'formData.fields') ? this.props.editForm.formData.fields : {},
            colList: colList,
            showNotificationOnSuccess: true,
            addNewRow: false
        };
        this.props.dispatch(createRecord(this.props.editingAppId, this.props.editingTblId, params)).then(
            (obj) => {
                this.props.saveFormComplete(formType);
                if (this.props.viewingRecordId === obj.recId) {
                    this.props.syncForm(CONTEXT.FORM.VIEW);
                }

                this.loadReportFromProps();
                if (next) {
                    this.nextRecord();
                } else {
                    /*eslint no-lonely-if:0*/
                    if (!openNewRecord) {
                    //    this.props.editNewRecord(false);
                    //} else {
                        this.hideTrowser();
                        this.navigateToNewRecord(obj.recId);
                    }
                }
            },
            () => {
                //  need to call as the form.saving attribute is used to determine when to
                //  open/close the 'modal working' spinner/window..
                this.props.saveFormComplete(formType);
                this.showErrorDialog();
            }
        );
    },

    /**
     * go back to the previous report record
     */
    previousRecord() {
        const record = this.getRecordFromProps(this.props);
        this.navigateToRecord(record.previousRecordId);
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        const record = this.getRecordFromProps(this.props);
        this.navigateToRecord(record.nextRecordId);
    },

    navigateToRecord(recId) {
        if (recId) {
            //TODO - retrieve from store
            const {appId, tblId, rptId, data} = this.props.reportData;
            const key = _.has(data, 'keyField.name') ? data.keyField.name : '';
            if (key) {
                let recordsArray = this.getRecordsArray();

                //  fetch the index of the row in the recordsArray that is being opened
                const index = _.findIndex(recordsArray, rec => rec[key] && rec[key].value === recId);
                let nextRecordId = (index < recordsArray.length - 1) ? recordsArray[index + 1][key].value : null;
                let previousRecordId = index > 0 ? recordsArray[index - 1][key].value : null;

                this.props.openRecord(recId, nextRecordId, previousRecordId);
                WindowHistoryUtils.pushWithQuery(EDIT_RECORD_KEY, recId);
            }
        }
    },

    getRecordsArray() {
        //TODO - retrieve from store
        const {filteredRecords, hasGrouping} = this.props.reportData.data;

        let recordsArray = [];
        if (hasGrouping) {
            // flatten grouped records
            this.addGroupedRecords(recordsArray, filteredRecords);
        } else {
            recordsArray = filteredRecords;
        }
        return recordsArray;
    },

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

    getRecordFromProps(props = this.props) {
        return  getRecord(props.record.records, props.recId);
    },

    /**
     *  get breadcrumb element for top of trowser
     */
    getTrowserBreadcrumbs() {
        const table = this.props.editingTable;

        let record = this.getRecordFromProps(this.props);

        const showBack = !!(record.previousRecordId);
        const showNext = !!(record.nextRecordId);

        let relatedRecord =  _.has(this.props, 'editForm.formData.record') ? this.props.editForm.formData.record : null;
        let recordName = getRecordTitle(this.props.editingTable, relatedRecord, this.props.recId);
        //const recordName = this.props.editingTable && this.props.editingTable.name;

        let title = this.props.recId === SchemaConsts.UNSAVED_RECORD_ID ? <span><I18nMessage message="nav.new"/><span>&nbsp;{recordName}</span></span> :
            <span>{recordName}</span>;


        return (
            <div className="breadcrumbsContent">
                {(showBack || showNext) &&
                <div className="iconActions">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev"><I18nMessage message="nav.previousRecord"/></Tooltip>}>
                        <Button className="iconActionButton prevRecord" disabled={!showBack} onClick={this.previousRecord}><QBicon icon="caret-filled-left"/></Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev"><I18nMessage message="nav.nextRecord"/></Tooltip>}>
                        <Button className="iconActionButton nextRecord" disabled={!showNext} onClick={this.nextRecord}><QBicon icon="caret-filled-right"/></Button>
                    </OverlayTrigger>
                </div> }
                <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} classes="primaryIcon" icon={table ? table.tableIcon : ""}/>{title}
            </div>);

    },
    getTrowserRightIcons() {
        const errorFlg = this._hasErrorsAndAttemptedSave();

        const record = this.getRecordFromProps(this.props);
        const showNext = !!(record.nextRecordId !== null) && this.props.recId !== null;

        const errorPopupHidden = this.props.shell ? this.props.shell.errorPopupHidden : true;
        return (
            <div className="saveButtons">
                {errorFlg &&
                    <OverlayTrigger placement="top" overlay={<Tooltip id="alertIconTooltip">{errorPopupHidden ? <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.showErrorPopup"/> : <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.closeErrorPopup"/>}</Tooltip>}>
                        <Button className="saveAlertButton" onClick={this.toggleErrorDialog}><QBicon icon={"alert"}/></Button>
                    </OverlayTrigger>
                }
                {showNext &&
                    <Button className="alternativeTrowserFooterButton" bsStyle="primary" onClick={this.saveAndNextClicked}><I18nMessage message="nav.saveAndNext"/></Button>
                }
                {this.props.recId === null &&
                <Button className="alternativeTrowserFooterButton" bsStyle="primary" onClick={() => {this.saveClicked(true);}}><I18nMessage message="nav.saveAndAddAnother"/></Button>
                }
                <Button className="mainTrowserFooterButton" bsStyle="primary" onClick={() => {this.saveClicked(false);}}><I18nMessage message="nav.save"/></Button>
            </div>);
    },

    hideTrowser() {
        WindowHistoryUtils.pushWithoutQuery();

        this.props.onHideTrowser();
    },

    saveAndClose() {
        HideAppModal();
        this.saveClicked();
    },

    clearEditsAndClose() {
        HideAppModal();
        this.props.editRecordCancel(this.props.appId, this.props.tblId, this.props.recId);
        WindowHistoryUtils.pushWithoutQuery();
        this.props.onHideTrowser();
    },

    cancelEditing() {
        const pendEdits = this.getPendEdits();
        if (pendEdits && pendEdits.isPendingEdit) {
            AppHistory.showPendingEditsConfirmationModal(this.saveAndClose, this.clearEditsAndClose, function() {HideAppModal();});
        } else {
            // Clean up before exiting the trowser
            this.clearEditsAndClose();
        }
    },
    toggleErrorDialog() {
        const errorPopupHidden = this.props.shell ? this.props.shell.errorPopupHidden : true;
        if (errorPopupHidden) {
            this.showErrorDialog();
        } else {
            this.dismissErrorDialog();
        }
    },
    showErrorDialog() {
        this.props.showErrorMsgDialog();
    },
    dismissErrorDialog() {
        this.props.hideErrorMsgDialog();
    },

    getPendEdits() {
        return getPendEdits(this.props.record, this.props.recId || NEW_RECORD_VALUE);
    },

    keyboardOnSave() {
        if (this.props.visible) {
            this.saveClicked();
        }
    },

    /**
     * Figure out what report we need to load based on the props.
     */
    loadReportFromProps() {

        const appId = this.props.location.query[UrlConsts.DETAIL_APPID];
        const tblId = this.props.location.query[UrlConsts.DETAIL_TABLEID];
        const rptId = this.props.location.query[UrlConsts.DETAIL_REPORTID];
        const detailKeyFid = this.props.location.query[UrlConsts.DETAIL_KEY_FID];
        const detailKeyValue = this.props.location.query[UrlConsts.DETAIL_KEY_VALUE];

        const validProps = [appId, tblId, rptId, detailKeyFid, detailKeyValue].every(prop => prop || typeof prop === 'number');

        if (validProps) {
            //  loading a report..always render the 1st page on initial load
            const queryParams = {
                offset: constants.PAGE.DEFAULT_OFFSET,
                numRows: NumberUtils.getNumericPropertyValue(this.props.reportData, 'numRows') || constants.PAGE.DEFAULT_NUM_ROWS,
                // Display a filtered child report, the child report should only contain children that
                // belong to a parent. A child has a parent if its detailKey field contains the
                // detailKeyValue that contains a parent record's masterKeyValue.
                query: QueryUtils.parseStringIntoExactMatchExpression(this.props.location.query[UrlConsts.DETAIL_KEY_FID], this.props.location.query[UrlConsts.DETAIL_KEY_VALUE])
            };


            this.props.loadDynamicReport(this.props.location.query[UrlConsts.EMBEDDED_REPORT], appId, tblId, rptId, true, /*filter*/{}, queryParams);
        }
    },

    /**
     * trowser to wrap report manager
     */
    render() {
        const pendEdits = this.getPendEdits();
        const errorFlg = pendEdits && pendEdits.editErrors && pendEdits.editErrors.errors.length > 0;
        return (
            <Trowser className={"recordTrowser " + (errorFlg ? "recordTrowserErrorPopRes" : "")}
                     visible={this.props.visible}
                     breadcrumbs={this.getTrowserBreadcrumbs()}
                     onCancel={this.cancelEditing}
                     content={this.getTrowserContent()} >
                {this.props.visible ? <KeyboardShortcuts id="trowser"
                                   shortcutBindingsPreventDefault={[
                                       {key: 'mod+s', callback: () => {this.keyboardOnSave(); return false;}},
                                   ]} /> : null}
                <SaveOrCancelFooter
                    rightAlignedButtons={this.getTrowserRightIcons()}
                    centerAlignedButtons={this.getTrowserActions()}
                    leftAlignedButtons={this.getTrowserActions()}
                />
            </Trowser>
        );
    }
});


const mapStateToProps = (state) => {
    return {
        shell: state.shell,
        record: state.record
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveForm: (formType) => {
            dispatch(saveForm(formType));
        },
        saveFormComplete: (formType) => {
            dispatch(saveFormComplete(formType));
        },
        //saveFormSuccess: (formType)=>{
        //    dispatch(saveFormSuccess(formType));
        //},
        //editNewRecord: (navigateAfterSave) => {
        //    dispatch(editNewRecord(navigateAfterSave));
        //},
        //saveFormError: (formType, errorStatus) => {
        //    dispatch(saveFormError(formType, errorStatus));
        //},
        syncForm: (formType) => {
            dispatch(syncForm(formType));
        },
        hideErrorMsgDialog: () => {
            dispatch(hideErrorMsgDialog());
        },
        showErrorMsgDialog: () => {
            dispatch(showErrorMsgDialog());
        },
        openRecord:(recId, nextRecordId, prevRecordId) => {
            dispatch(openRecord(recId, nextRecordId, prevRecordId));
        },
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams));
        },
        editRecordCancel: (appId, tblId, recId) => {
            dispatch(editRecordCancel(appId, tblId, recId));
        },
        //editRecordCommit: (appId, tblId, recId) => {
        //    dispatch(editRecordCommit(appId, tblId, recId));
        //},
        //updateReportRecord: (obj, context) => {
        //    dispatch(updateReportRecord(obj, context));
        //},
        dispatch: dispatch
        //updateRecord:(appId, tblId, recId, params) => {
        //    dispatch(updateRecord(appId, tblId, recId, params)).then(
        //        (obj) => {
        //            //dispatch(updateReportRecord(obj, CONTEXT.REPORT.NAV));
        //            dispatch(saveFormSuccess('edit'));
        //            dispatch(syncForm("view"));
        //        }
        //    );
        //}
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordTrowser);
