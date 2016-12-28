import React from 'react';
import Fluxxor from 'fluxxor';
import Trowser from "../trowser/trowser";
import Record from "./record";
import {I18nMessage} from '../../utils/i18nMessage';
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBicon from "../qbIcon/qbIcon";
import QBToolTip from '../qbToolTip/qbToolTip';
import TableIcon from "../qbTableIcon/qbTableIcon";
import Loader from 'react-loader';
import QBErrorMessage from "../QBErrorMessage/qbErrorMessage";
import WindowLocationUtils from '../../utils/windowLocationUtils';
import * as SchemaConsts from "../../constants/schema";
import _ from 'lodash';
import AppHistory from '../../globals/appHistory';
import * as SpinnerConfigurations from "../../constants/spinnerConfigurations";
import {ShowAppModal, HideAppModal} from '../qbModal/appQbModalFunctions';
import {connect} from 'react-redux';
import {openRecordForEdit} from '../../actions/formActions';

import './recordTrowser.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * trowser containing a record component
 */
let RecordTrowser = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        recId: React.PropTypes.string,
        visible: React.PropTypes.bool,
        editForm: React.PropTypes.object,
        pendEdits: React.PropTypes.object,
        reportData: React.PropTypes.object,
        errorPopupHidden: React.PropTypes.bool
    },

    _hasErrorsAndAttemptedSave() {
        return (_.has(this.props, 'pendEdits.editErrors.errors') && this.props.pendEdits.editErrors.errors.length > 0 && this.props.pendEdits.hasAttemptedSave);
    },

    _doesNotHaveErrors() {
        return (!_.has(this.props, 'pendEdits.editErrors.errors') || this.props.pendEdits.editErrors.errors.length === 0 || !this.props.pendEdits.hasAttemptedSave);
    },

    /**
     * get trowser content (report nav for now)
     */
    getTrowserContent() {
        let hideErrorMessage = this.props.errorPopupHidden;
        let errorMessage = [];
        if (_.has(this.props, 'pendEdits.editErrors.errors')) {
            hideErrorMessage = hideErrorMessage || this._doesNotHaveErrors();
            errorMessage = this.props.pendEdits.editErrors.errors;
        }

        return (this.props.visible &&
            <Loader loaded={!this.props.editForm || (!this.props.editForm.loading && !this.props.editForm.saving)}
                    options={SpinnerConfigurations.TROWSER_CONTENT}>
                <Record appId={this.props.appId}
                    tblId={this.props.tblId}
                    recId={this.props.recId}
                    appUsers={this.props.appUsers}
                    errorStatus={this.editForm ? this.props.editForm.errorStatus : null}
                    pendEdits={this.props.pendEdits ? this.props.pendEdits : null}
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

        if (this.props.reportData && this.props.reportData.navigateAfterSave) {
            let {appId, tblId} = this.props;
            this.props.router.push(`/qbase/app/${appId}/table/${tblId}/record/${recId}`);
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
            const flux = this.getFlux();

            //signal record save action, will update an existing records with changed values
            // or add a new record
            let promise;

            flux.actions.savingForm();
            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                promise = this.handleRecordAdd(this.props.pendEdits.recordChanges);
            } else {
                promise = this.handleRecordChange(this.props.recId);
            }
            promise.then((recId) => {
                flux.actions.saveFormSuccess();

                if (saveAnother) {
                    flux.actions.editNewRecord(false);
                } else {
                    this.props.onHideTrowser();
                    this.navigateToNewRecord(recId);
                }

            }, (errorStatus) => {
                flux.actions.saveFormFailed(errorStatus);
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
            const flux = this.getFlux();

            //signal record save action, will update an existing records with changed values
            // or add a new record
            let promise;

            flux.actions.savingForm();
            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                promise = this.handleRecordAdd(this.props.pendEdits.recordChanges);
            } else {
                promise = this.handleRecordChange(this.props.recId);
            }
            promise.then(() => {
                flux.actions.saveFormSuccess();
                this.nextRecord();
            }, (errorStatus) => {
                flux.actions.saveFormFailed(errorStatus);
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
        const flux = this.getFlux();
        flux.actions.recordPendingEditsCommit(this.props.appId, this.props.tblId, this.props.recId);
        let colList = [];
        // we need to pass in cumulative fields' fid list from report - because after form save report needs to be updated and we need to get the record
        // with the right column list from the server
        if (_.has(this.props, 'reportData.data.fields') && Array.isArray(this.props.reportData.data.fields)) {
            this.props.reportData.data.fields.forEach((field) => {
                colList.push(field.id);
            });
        }
        return flux.actions.saveRecord(this.props.appId, this.props.tblId, this.props.recId, this.props.pendEdits, this.props.editForm.fields, colList);
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
        const {appId, tblId, rptId, previousEditRecordId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.editPreviousRecord(previousEditRecordId);

        this.props.dispatch(openRecordForEdit(previousEditRecordId));
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        const {appId, tblId, rptId, nextEditRecordId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.editNextRecord(nextEditRecordId);

        this.props.dispatch(openRecordForEdit(nextEditRecordId));
    },
    /**
     *  get breadcrumb element for top of trowser
     */
    getTrowserBreadcrumbs() {
        const table = this.props.selectedTable;

        const showBack = !!(this.props.reportData && this.props.reportData.previousEditRecordId !== null);
        const showNext = !!(this.props.reportData && this.props.reportData.nextEditRecordId !== null);
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

        const showNext = !!(this.props.reportData && this.props.reportData.nextEditRecordId !== null);

        return (
            <div className="saveButtons">
                {errorFlg &&
                    <OverlayTrigger placement="top" overlay={<Tooltip id="alertIconTooltip">{this.props.errorPopupHidden ? <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.showErrorPopup"/> : <I18nMessage message="errorMessagePopup.errorAlertIconTooltip.closeErrorPopup"/>}</Tooltip>}>
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
        flux.actions.recordPendingEditsCancel(this.props.appId, this.props.tblId, this.props.recId);
        WindowLocationUtils.pushWithoutQuery();
        this.props.onHideTrowser();
    },

    cancelEditing() {
        if (this.props.pendEdits && this.props.pendEdits.isPendingEdit) {
            AppHistory.showPendingEditsConfirmationModal(this.saveAndClose, this.clearEditsAndClose, function() {HideAppModal();});
        } else {
            // Clean up before exiting the trowser
            this.clearEditsAndClose();
        }
    },
    toggleErrorDialog() {
        if (this.props.errorPopupHidden) {
            this.showErrorDialog();
        } else {
            this.dismissErrorDialog();
        }
    },
    showErrorDialog() {
        let flux = this.getFlux();
        flux.actions.showErrorMsgDialog();
    },
    dismissErrorDialog() {
        let flux = this.getFlux();
        flux.actions.hideErrorMsgDialog();
    },
    /**
     * trowser to wrap report manager
     */
    render() {
        const errorFlg = this.props.pendEdits && this.props.pendEdits.editErrors && this.props.pendEdits.editErrors.errors.length > 0;
        return (
            <Trowser className={"recordTrowser " + (errorFlg ? "recordTrowserErrorPopRes" : "")}
                     visible={this.props.visible}
                     breadcrumbs={this.getTrowserBreadcrumbs()}
                     centerActions={this.getTrowserActions()}
                     rightIcons={this.getTrowserRightIcons()}
                     onCancel={this.cancelEditing}
                     content={this.getTrowserContent()} />
        );
    }
});

export default connect()(RecordTrowser);
