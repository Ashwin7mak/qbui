import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Fluxxor from 'fluxxor';
import Hicon from '../harmonyIcon/harmonyIcon';
import {MenuItem, Dropdown, Glyphicon, Input} from 'react-bootstrap';

import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

import './reportActions.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
/**
 * a set of record-level action icons
 */
let RecordActions = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        selection: React.PropTypes.array,
        report: React.PropTypes.object,
        app: React.PropTypes.object,
        table: React.PropTypes.object
    },
    // just placeholders for now, localize when we have specs
    getDefaultProps() {
        return {
            report: {name: 'report name'},
            table: {name: 'table name'},
            app: {name: 'app name'},
            record: {name: ' record name'}
        };
    },
    getEmailSubject() {
        return "Email subject goes here";
    },

    getEmailBody() {
        return "Email body goes here";
    },

    showExtraActions() {
        let flux = this.getFlux();
        flux.actions.showTrowser();
    },
    getSelectionTip(actionMsg) {
        return Locale.getMessage(actionMsg);
    },
    render() {

        const record = Locale.getMessage('records.singular');

        return (
            <div className={'reportActions'}>

                <div>
                    {this.props.selection && <span className="selectedRowsLabel">{this.props.selection.length}</span>}
                    <div className="actionIcons">
                        <ActionIcon icon="edit" tip={this.getSelectionTip("selection.edit") + " " + record}/>
                        <ActionIcon icon="print" tip={this.getSelectionTip("selection.print") + " " + record}/>

                        <EmailReportLink tip={this.getSelectionTip("selection.email") + " " + record}
                                         subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}/>

                        <ActionIcon icon="copy" tip={this.getSelectionTip("selection.copy") + " " + record}/>
                        <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete") + " " + record}/>
                        <ActionIcon glyph="option-horizontal" tip={this.getSelectionTip("selection.more") } onClick={this.showExtraActions}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default RecordActions;
