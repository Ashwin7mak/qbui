import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {MenuItem, Dropdown, Input} from 'react-bootstrap';

import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

import './recordActions.scss';
/**
 * a set of record-level action icons
 */
let RecordActions = React.createClass({
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
    render() {

        const record = Locale.getMessage('records.singular');

        return (
            <div className={'recordActions'} onClick={this.onClick}>

                <div className="actionIcons">
                    <ActionIcon icon="edit" tip={this.getSelectionTip("selection.edit") + " " + record} onClick={this.props.onEditAction}/>
                    <ActionIcon icon="print" tip={this.getSelectionTip("selection.print") + " " + record}/>

                    <EmailReportLink tip={this.getSelectionTip("selection.email") + " " + record}
                                     subject={this.getEmailSubject()}
                                     body={this.getEmailBody()}/>

                    <ActionIcon icon="duplicate" tip={this.getSelectionTip("selection.copy") + " " + record}/>
                    <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete") + " " + record}/>
                    <ActionIcon icon="pickles" tip={this.getSelectionTip("selection.more") } onClick={this.showExtraActions}/>
                </div>

            </div>
        );
    }
});

export default RecordActions;
