import React from 'react';
import Fluxxor from 'fluxxor';
import Trowser from "../trowser/trowser";
import Record from "./record";
import {I18nMessage} from "../../utils/i18nMessage";
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBicon from "../qbIcon/qbIcon";
import TableIcon from "../qbTableIcon/qbTableIcon";
import ValidationUtils from "../../utils/validationUtils";
import Loader from 'react-loader';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import * as SchemaConsts from "../../constants/schema";
import {browserHistory} from 'react-router';

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
        form: React.PropTypes.object,
        pendEdits: React.PropTypes.object,
        reportData: React.PropTypes.object
    },
    /**
     * get trowser content (report nav for now)
     */
    getTrowserContent() {

        return (this.props.visible &&
            <Loader loaded={!this.props.form || (!this.props.form.editFormLoading && !this.props.form.editFormSaving)} >
                <Record appId={this.props.appId}
                    tblId={this.props.tblId}
                    recId={this.props.recId}
                    appUsers={this.props.appUsers}
                    errorStatus={this.props.form && this.props.form.editFormErrorStatus ? this.props.form.editFormErrorStatus : null}
                    pendEdits={this.props.pendEdits ? this.props.pendEdits : null}
                    formData={this.props.form ? this.props.form.editFormData : null}
                    edit={true} />
            </Loader>);
    },
    /**
     *  get actions element for bottome center of trowser (placeholders for now)
     */
    getTrowserActions() {
        return (
            <div className={"centerActions"} />);
    },

    /**
     * User wants to save changes to a record. First we do client side validation
     * and if validation is successful we initiate the save action for the new or existing record
     * if validation if not ok we stay in edit mode and show the errors (TBD)
     * @param id
     * @returns {boolean}
     */
    saveClicked() {
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
                this.hideTrowser();
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
        return flux.actions.saveRecord(this.props.appId, this.props.tblId, this.props.recId, this.props.pendEdits, this.props.form.editFormData.fields);
    },

    /**
     * Save a new record
     * @param recordChanges
     * @returns {Array} of field values for the new record
     */
    handleRecordAdd(recordChanges) {
        const flux = this.getFlux();
        return flux.actions.saveNewRecord(this.props.appId, this.props.tblId, recordChanges, this.props.form.editFormData.fields);
    },

    /**
     * go back to the previous report record
     */
    previousRecord() {
        const {appId, tblId, rptId, previousEditRecordId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.recordPendingEditsCancel(appId, tblId, this.props.recId);
        flux.actions.editPreviousRecord(previousEditRecordId);

        flux.actions.openRecordForEdit(previousEditRecordId);
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        const {appId, tblId, rptId, nextEditRecordId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.recordPendingEditsCancel(appId, tblId, this.props.recId);
        flux.actions.editNextRecord(nextEditRecordId);

        flux.actions.openRecordForEdit(nextEditRecordId);
    },
    /**
     *  get breadcrumb element for top of trowser
     */
    getTrowserBreadcrumbs() {
        const table = this.props.selectedTable;

        const showBack = !!(this.props.reportData && this.props.reportData.previousEditRecordId !== null);
        const showNext = !!(this.props.reportData && this.props.reportData.nextEditRecordId !== null);

        return (
            <h4>
                {(showBack || showNext) &&
                <div className="iconActions">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev"><I18nMessage message="nav.previousRecord"/></Tooltip>}>
                        <Button className="iconActionButton prevRecord" disabled={!showBack} onClick={this.previousRecord}><QBicon icon="caret-filled-left"/></Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev"><I18nMessage message="nav.nextRecord"/></Tooltip>}>
                        <Button className="iconActionButton nextRecord" disabled={!showNext} onClick={this.nextRecord}><QBicon icon="caret-filled-right"/></Button>
                    </OverlayTrigger>
                </div> }
                <TableIcon icon={table ? table.icon : ""}/> {table ? table.name : ""}
            </h4>);

    },
    getTrowserRightIcons() {
        const showNext = !!(this.props.reportData && this.props.reportData.nextEditRecordId !== null);

        return (
            <div className="saveButtons">
                <Button bsStyle="primary" onClick={this.saveClicked}><I18nMessage message="nav.save"/></Button>
                {showNext &&
                    <Button bsStyle="primary" onClick={this.saveAndNextClicked}><I18nMessage message="nav.saveAndNext"/></Button>
                }
            </div>);
    },

    hideTrowser() {
        WindowLocationUtils.pushWithoutQuery();

        let flux = this.getFlux();
        flux.actions.hideTrowser();
    },

    cancelEditing() {
        WindowLocationUtils.pushWithoutQuery();

        const flux = this.getFlux();
        if (this.props.recId) {
            flux.actions.recordPendingEditsCancel(this.props.appId, this.props.tblId, this.props.recId);
        }
        flux.actions.hideTrowser();
    },
    /**
     * trowser to wrap report manager
     */
    render() {
        return (
            <Trowser className="recordTrowser"
                     visible={this.props.visible}
                     breadcrumbs={this.getTrowserBreadcrumbs()}
                     centerActions={this.getTrowserActions()}
                     rightIcons={this.getTrowserRightIcons()}
                     onCancel={this.cancelEditing}
                     content={this.getTrowserContent()} />
        );
    }
});

export default RecordTrowser;
