import React from 'react';
import Fluxxor from 'fluxxor';
import Trowser from "../trowser/trowser";
import Record from "./record";
import {I18nMessage} from "../../utils/i18nMessage";
import Button from 'react-bootstrap/lib/Button';
import QBicon from "../qbIcon/qbIcon";
import TableIcon from "../qbTableIcon/qbTableIcon";
import ValidationUtils from "../../utils/validationUtils";
import WindowLocationUtils from '../../utils/windowLocationUtils';
import * as SchemaConsts from "../../constants/schema";
import {browserHistory} from 'react-router';
let FluxMixin = Fluxxor.FluxMixin(React);

let RecordTrowser = React.createClass({
    mixins: [FluxMixin],
    /**
     * get trowser content (report nav for now)
     */
    getTrowserContent() {

        return (this.props.visible &&
            <Record appId={this.props.appId}
                tblId={this.props.tblId}
                recId={this.props.recId}
                appUsers={this.props.appUsers}
                errorStatus={this.props.form && this.props.form.errorStatus ? this.props.form.errorStatus : null}
                pendEdits={this.props.pendEdits ? this.props.pendEdits : null}
                formData={this.props.form ? this.props.form.formData : null}
                edit={true} />);
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
    handleRecordSaveClicked() {
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
            if (this.props.recId === SchemaConsts.UNSAVED_RECORD_ID) {
                promise = this.handleRecordAdd(this.props.pendEdits.recordChanges);
            } else {
                promise = this.handleRecordChange(this.props.recId);
            }
            promise.then(() => {
                this.hideTrowser();
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
        return flux.actions.saveRecord(this.props.appId, this.props.tblId, this.props.recId, this.props.pendEdits, this.props.form.formData.fields);
    },

    /**
     * Save a new record
     * @param recordChanges
     * @returns {Array} of field values for the new record
     */
    handleRecordAdd(recordChanges) {
        const flux = this.getFlux();
        return flux.actions.saveNewRecord(this.props.appId, this.props.tblId, recordChanges, this.props.form.formData.fields);
    },

    getTrowserRightIcons() {
        return (
            <Button bsStyle="primary" onClick={this.handleRecordSaveClicked}>Save</Button>);
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
            <Trowser position={"top"}
                     visible={this.props.visible}
                     centerActions={this.getTrowserActions()}
                     rightIcons={this.getTrowserRightIcons()}
                     onCancel={this.cancelEditing}
                     content={this.getTrowserContent()} />
        );
    }
});

export default RecordTrowser;
