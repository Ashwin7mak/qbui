import React from 'react';
import Locale from '../../locales/locales';
import Fluxxor from "fluxxor";
import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

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
        nameForRecords: React.PropTypes.string
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
     * this.props.selection has the current selected rows with the unique identifier as the value in the array
     */
    handleBulkDelete() {
        const flux = this.getFlux();
        flux.actions.deleteRecordBulk(this.props.appId, this.props.tblId, this.props.selection, this.props.nameForRecords);
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
                        {this.props.selection.length === 1 && <ActionIcon icon="edit" tip={this.getSelectionTip("selection.edit")}/>}
                        <ActionIcon icon="print" tip={this.getSelectionTip("selection.print")}/>

                        <EmailReportLink tip={this.getSelectionTip("selection.email")}
                                         subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}/>

                        <ActionIcon icon="duplicate" tip={this.getSelectionTip("selection.copy")}/>
                        <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete")} onClick={this.handleBulkDelete}/>

                    </div>

                </div>
            </div>
        );
    }
});

export default ReportActions;
