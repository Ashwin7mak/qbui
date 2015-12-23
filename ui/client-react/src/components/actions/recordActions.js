import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';

import Hicon from '../harmonyIcon/harmonyIcon';
import {MenuItem, Dropdown, Glyphicon, Input} from 'react-bootstrap';


import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

import './reportActions.scss';

/**
 * report-level actins
 */
let RecordActions = React.createClass({

    getDefaultProps() {
        return {
            report: {name: 'report name'},
            table: {name: 'projects'},
            app: {name: 'project manager plus'}
        };
    },
    getEmailSubject() {
        return "'" + this.props.report.name + "' report from QuickBase app '" + this.props.app.name + "'";
    },

    getEmailBody() {
        const link = window.location;
        return "Here's the '" + this.props.report.name + "' report from the table '" + this.props.table.name +
            "' in '" + this.props.app.name + "'%0D%0D" + window.location.href;
    },

    render() {

        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={'reportActions'}>

                <div>
                    {this.props.selection && <span className="selectedRowsLabel">{this.props.selection.length}</span>}
                    <div className="actionIcons">
                        <ActionIcon icon="edit" tip="Edit record"/>
                        <ActionIcon icon="print" tip="Print record"/>

                        <EmailReportLink tip="Email report"
                                         subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}/>

                        <ActionIcon icon="copy" tip="Copy record"/>
                        <ActionIcon icon="delete" tip="Delete record"/>
                        <ActionIcon glyph="option-horizontal" tip="More..."/>
                    </div>
                </div>
            </div>
        );
    }
});

export default RecordActions;
