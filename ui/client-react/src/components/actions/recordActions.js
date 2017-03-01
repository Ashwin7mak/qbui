import React from 'react';
import ReactIntl from 'react-intl';
import Locale from '../../locales/locales';
import * as SchemaConsts from "../../constants/schema";
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import {deleteRecord} from '../../actions/recordActions';
import {connect} from 'react-redux';

import './recordActions.scss';

let IntlMixin = ReactIntl.IntlMixin;

/**
 * a set of record-level action icons
 */
let RecordActions = React.createClass({
    mixins: [IntlMixin],
    nameForRecords: "Records",

    propTypes: {
        selection: React.PropTypes.array
    },

    getEmailSubject() {
        return "Email subject goes here";
    },

    getEmailBody() {
        return "Email body goes here";
    },

    showExtraActions() {
    },
    getSelectionTip(actionMsg) {
        return Locale.getMessage(actionMsg);
    },
    onClick(e) {
        // prevent navigation to records
        e.stopPropagation();
    },

    getInitialState() {
        return {
            confirmDeletesDialogOpen: false
        };
    },

    /**
     * delete the selected records, after confirmation if multiple records selected
     */
    handleDelete(record) {
        if (this.props.data) {
            this.setState({selectedRecordId: this.props.data[SchemaConsts.DEFAULT_RECORD_KEY].value});
            this.setState({confirmDeletesDialogOpen: true});
        }
    },


    handleRecordDelete() {
        //const flux = this.getFlux();
        //flux.actions.deleteRecord(this.props.appId, this.props.tblId, this.state.selectedRecordId, this.nameForRecords);
        this.props.deleteRecord(this.props.appId, this.props.tblId, this.state.selectedRecordId, this.nameForRecords);
        this.setState({confirmDeletesDialogOpen: false});
    },

    cancelRecordDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    },

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmDialog() {

        let msg = Locale.getMessage('selection.deleteThisRecord');

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('selection.delete')}
                primaryButtonOnClick={this.handleRecordDelete}
                leftButtonName={Locale.getMessage('selection.dontDelete')}
                leftButtonOnClick={this.cancelRecordDelete}
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
    render() {

        const record = Locale.getMessage('records.singular');
        return (
            <div className={'recordActions'} onClick={this.onClick}>

                <div className="actionIcons">
                    <ActionIcon icon="edit" tip={this.getSelectionTip("selection.edit") + " " + record} onClick={this.props.onEditAction}/>
                    <ActionIcon icon="print" tip={Locale.getMessage("unimplemented.print")} disabled={true}/>
                    {this.getEmailAction()}
                    <ActionIcon icon="duplicate" tip={Locale.getMessage("unimplemented.copy")} disabled={true}/>
                    <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete") + " " + record} onClick={this.handleDelete}/>
                </div>
                {this.getConfirmDialog()}
            </div>
        );
    }
});


// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        deleteRecord:  (appId, tblId, recId, nameForRecords) => {
            dispatch(deleteRecord(appId, tblId, recId, nameForRecords));
        }
    };
};

export default connect(
    mapDispatchToProps
)(RecordActions);
