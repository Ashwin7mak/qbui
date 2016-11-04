import React from 'react';
import Locale from '../../locales/locales';
import Fluxxor from "fluxxor";
import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';
import QBModal from '../qbModal/qbModal';

import './reportActions.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * report-level actions
 */
let ReportActions = React.createClass({
    mixins: [FluxMixin],

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
        const flux = this.getFlux();
        flux.actions.deleteRecordBulk(this.props.appId, this.props.tblId, this.props.selection, this.props.nameForRecords);
        this.setState({confirmDeletesDialogOpen: false});
    },

    /**
     * edit icon was clicked
     */
    onEditClicked() {

        if (this.props.selection && this.props.selection.length === 1) {
            const flux = this.getFlux();

            const recordId = this.props.selection[0];
            flux.actions.openRecordForEdit(recordId);
        }
    },

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfimDialog() {

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

                        <EmailReportLink tip={this.getSelectionTip("selection.email")}
                                         subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}/>

                        <ActionIcon icon="duplicate" tip={Locale.getMessage("unimplemented.copy")} disabled={true}/>
                        <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete")} onClick={this.handleBulkDelete}/>


                    </div>
                </div>
                {this.getConfimDialog()}
            </div>
        );
    }
});

export default ReportActions;
