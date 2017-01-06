import React from 'react';
import Locale from '../../locales/locales';
import Fluxxor from "fluxxor";
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import {connect} from 'react-redux';
import {openRecordForEdit} from '../../actions/formActions';
import './reportActions.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * report-level actions
 */
export let ReportActions = React.createClass({
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
            const recordId = this.props.selection[0];
            this.props.dispatch(openRecordForEdit(recordId));
        }
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

// export the react-redux connected wrapper (which injects the dispatch function as a prop)
export default connect()(ReportActions);
