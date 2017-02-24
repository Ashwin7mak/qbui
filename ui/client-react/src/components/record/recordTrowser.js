import React from 'react';
import Fluxxor from 'fluxxor';
import Trowser from "../trowser/trowser";
import Record from "./record";
import {I18nMessage} from '../../utils/i18nMessage';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBicon from "../qbIcon/qbIcon";
import TableIcon from "../qbTableIcon/qbTableIcon";
import Loader from 'react-loader';
import QBErrorMessage from "../QBErrorMessage/qbErrorMessage";
import WindowLocationUtils from '../../utils/windowLocationUtils';
import * as SchemaConsts from "../../constants/schema";
import _ from 'lodash';
import AppHistory from '../../globals/appHistory';
import * as SpinnerConfigurations from "../../constants/spinnerConfigurations";
import {HideAppModal} from '../qbModal/appQbModalFunctions';
import {connect} from 'react-redux';
import {savingForm, saveFormSuccess, editNewRecord, saveFormError, syncForm} from '../../actions/formActions';
import {showErrorMsgDialog, hideErrorMsgDialog} from '../../actions/shellActions';
import {updateReportRecord} from '../../actions/reportActions';
import {openRecord, editRecordCancel, editRecordCommit} from '../../actions/recordActions';
import {APP_ROUTE, EDIT_RECORD_KEY} from '../../constants/urlConstants';
import {CONTEXT} from '../../actions/context';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';

import './recordTrowser.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * trowser containing a record component
 *
 * Note: this component has been partially migrated to Redux
 */
export const RecordTrowser = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        recId: React.PropTypes.string,
        viewingRecordId: React.PropTypes.string,
        visible: React.PropTypes.bool,
        editForm: React.PropTypes.object,
        //pendEdits: React.PropTypes.object,
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
                    selectedApp={this.props.selectedApp}
                    appId={this.props.appId}
                    tblId={this.props.tblId}
                    recId={this.props.recId}
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
            // TODO: get from store
            let {appId, tblId} = this.props;
            this.props.router.push(`${APP_ROUTE}/${appId}/table/${tblId}/record/${recId}`);
        }
    },

    /**
     * User wants to save changes to a record. First we do client side validation
     * and if validation is successful we initiate the save action for the new or existing record
     * if validation if not ok we stay in edit mode and show the errors (TBD)
     * @param saveAnother if true, keep trowser open after save with a new blank record
     * @returns {boolean}
     */
    saveClicked(saveAnother = false) {
        //validate changed values -- this is skipped for now
        //get pending changes
        let validationResult = {
            ok : true,
            errors: []
        };

        if (validationResult.ok) {
            //signal record save action, will update an existing records with changed values
            // or add a new record
            let promise;

            const formType = "edit";

            let updateRecord = false;
            this.props.savingForm(formType);
            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                const pendEdits = this.getPendEdits();
                // TODO: NPE
                promise = this.handleRecordAdd(pendEdits.recordChanges);
            } else {
                updateRecord = true;
                promise = this.handleRecordChange();
            }
            promise.then((obj) => {
                //  update the grid with the change..this is expected to get refactored once the record store is moved to redux..
                if (updateRecord === true) {
                    this.props.updateReportRecord(obj, CONTEXT.REPORT.NAV);
                }

                this.props.saveFormSuccess(formType);

                if (this.props.viewingRecordId === obj.recId) {
                    this.props.syncForm("view");
                }

                if (saveAnother) {
                    this.props.editNewRecord(false);
                } else {
                    this.hideTrowser();
                    this.navigateToNewRecord(obj.recId);
                }

            }, (errorStatus) => {
                this.props.saveFormError(formType, errorStatus);
                this.showErrorDialog();
            });
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
            let promise;
            const formType = "edit";

            let updateRecord = false;
            this.props.savingForm(formType);
            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                const pendEdits = this.getPendEdits();
                // TODO: NPE
                promise = this.handleRecordAdd(pendEdits.recordChanges);
            } else {
                updateRecord = true;
                promise = this.handleRecordChange();
            }
            promise.then((obj) => {
                //  update the grid with the change..this is expected to get refactored once the record store is moved to redux..
                if (updateRecord === true) {
                    this.props.updateReportRecord(obj, CONTEXT.REPORT.NAV);
                }

                this.props.saveFormSuccess(formType);
                if (this.props.viewingRecordId === this.props.recId) {
                    this.props.syncForm("view");
                }

                this.nextRecord();
            }, (errorStatus) => {
                this.props.saveFormError(formType, errorStatus);
                this.showErrorDialog();
            });
        }
        return validationResult;
    },
    /**
     * Save changes to an existing record
     * @param recId
     * @returns {Array}
     */
    handleRecordChange() {
        //const flux = this.getFlux();
        //flux.actions.recordPendingEditsCommit(this.props.appId, this.props.tblId, this.props.recId);
        this.props.editRecordCommit(this.props.appId, this.props.tblId, this.props.recId);

        let colList = [];
        // we need to pass in cumulative fields' fid list from report - because after form save report needs to be updated and we need to get the record
        // with the right column list from the server
        if (_.has(this.props, 'reportData.data.fields') && Array.isArray(this.props.reportData.data.fields)) {
            this.props.reportData.data.fields.forEach((field) => {
                colList.push(field.id);
            });
        }
        const pendEdits = this.getPendEdits();
        return flux.actions.saveRecord(this.props.appId, this.props.tblId, this.props.recId, pendEdits, this.props.editForm.formData.fields, colList);
    },

    /**
     * Save a new record
     * @param recordChanges
     * @returns {Array} of field values for the new record
     */
    handleRecordAdd(recordChanges) {
        const flux = this.getFlux();
        let colList = [];
        // we need to pass in cumulative fields' fid list from report - because after form save report needs to be updated and we need to get the record
        // with the right column list from the server
        if (_.has(this.props, 'reportData.data.fields') && Array.isArray(this.props.reportData.data.fields)) {
            this.props.reportData.data.fields.forEach((field) => {
                colList.push(field.id);
            });
        }
        return flux.actions.saveNewRecord(this.props.appId, this.props.tblId, recordChanges, this.props.editForm.formData.fields, colList);
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
                WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, recId);
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
        return _.nth(props.record, 0) || {};
    },

    /**
     *  get breadcrumb element for top of trowser
     */
    getTrowserBreadcrumbs() {
        const table = this.props.selectedTable;

        let record = this.getRecordFromProps(this.props);

        const showBack = !!(record.previousRecordId !== null);
        const showNext = !!(record.nextRecordId !== null);

        const recordName = this.props.selectedTable && this.props.selectedTable.name;

        let title = this.props.recId === SchemaConsts.UNSAVED_RECORD_ID ? <span><I18nMessage message="nav.new"/><span>&nbsp;{table ? table.name : ""}</span></span> :
            <span>{recordName} #{this.props.recId}</span>;


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
                <TableIcon classes="primaryIcon" icon={table ? table.icon : ""}/>{title}
            </div>);

    },
    getTrowserRightIcons() {
        const errorFlg = this._hasErrorsAndAttemptedSave();

        const record = this.getRecordFromProps(this.props);
        const showNext = !!(record.nextRecordId !== null);

        const errorPopupHidden = this.props.shell ? this.props.shell.errorPopupHidden : true;
        return (
            <div className="saveButtons">
                {errorFlg &&
                    <OverlayTrigger placement="top" overlay={<Tooltip id="alertIconTooltip">{errorPopupHidden ? <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.showErrorPopup"/> : <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.closeErrorPopup"/>}</Tooltip>}>
                        <Button className="saveAlertButton" onClick={this.toggleErrorDialog}><QBicon icon={"alert"}/></Button>
                    </OverlayTrigger>
                }
                {showNext &&
                    <Button bsStyle="primary" onClick={this.saveAndNextClicked}><I18nMessage message="nav.saveAndNext"/></Button>
                }
                {this.props.recId === null &&
                <Button bsStyle="primary" onClick={() => {this.saveClicked(true);}}><I18nMessage message="nav.saveAndAddAnother"/></Button>
                }
                <Button bsStyle="primary" onClick={() => {this.saveClicked(false);}}><I18nMessage message="nav.save"/></Button>
            </div>);
    },

    hideTrowser() {
        WindowLocationUtils.pushWithoutQuery();

        this.props.onHideTrowser();
    },

    saveAndClose() {
        HideAppModal();
        this.saveClicked();
    },

    clearEditsAndClose() {
        const flux = this.getFlux();

        HideAppModal();
        //flux.actions.recordPendingEditsCancel(this.props.appId, this.props.tblId, this.props.recId);
        this.props.editRecordCancel(this.props.appId, this.props.tblId, this.props.recId);
        WindowLocationUtils.pushWithoutQuery();
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
        return this.getRecord().pendEdits || {};
    },

    getRecord() {
        let record = {};
        if (Array.isArray(this.props.record) && this.props.record.length > 0) {
            if (_.isEmpty(this.props.record[0]) === false) {
                record = this.props.record[0];
            }
        }
        return record;
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
        forms: state.forms,
        shell: state.shell,
        record: state.record,
        report: state.report
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        savingForm: (formType) => {
            dispatch(savingForm(formType));
        },
        saveFormSuccess: (formType)=>{
            dispatch(saveFormSuccess(formType));
        },
        editNewRecord: (navigateAfterSave) => {
            dispatch(editNewRecord(navigateAfterSave));
        },
        saveFormError: (formType, errorStatus) => {
            dispatch(saveFormError(formType, errorStatus));
        },
        syncForm: (formType) => {
            dispatch(syncForm(formType));
        },
        hideErrorMsgDialog: () => {
            dispatch(hideErrorMsgDialog());
        },
        showErrorMsgDialog: () => {
            dispatch(showErrorMsgDialog());
        },
        openRecord:(recId, nextRecordId, prevRecordId, navigateAfterSave, nextOrPreviousEdit) => {
            dispatch(openRecord(recId, nextRecordId, prevRecordId, navigateAfterSave, nextOrPreviousEdit));
        },
        editRecordCancel: (appId, tblId, recId) => {
            dispatch(editRecordCancel(appId, tblId, recId));
        },
        editRecordCommit: (appId, tblId, recId) => {
            dispatch(editRecordCommit(appId, tblId, recId));
        },
        updateReportRecord: (obj, context) => {
            dispatch(updateReportRecord(obj, context));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordTrowser);
