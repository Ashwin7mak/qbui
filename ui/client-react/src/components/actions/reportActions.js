import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';

import Hicon from '../harmonyIcon/harmonyIcon';
import {MenuItem, Dropdown, ButtonGroup, Button, Tooltip, OverlayTrigger, Popover, Glyphicon, Input} from 'react-bootstrap';


import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

import './reportActions.scss';

/**
 * report-level actins
 */
let ReportActions = React.createClass({

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
                        <ActionIcon icon="print" tip="Print"/>

                        <EmailReportLink tip="Email report"
                                         subject={this.getEmailSubject()} />

                        <ActionIcon icon="copy" tip="Copy record"/>
                        <ActionIcon icon="delete" tip="Delete record"/>
                    </div>

                    {this.props.customActions &&
                        <div className="actionButtons">
                            {this.props.customActions.map((action) => {
                                return (<a key={action}><Button bsStyle="primary">{action}</Button></a>);
                            })}

                        </div>}

                    <Dropdown id="extraActionsMenu">
                        <a href="#" bsRole="toggle">
                            <Glyphicon glyph="option-horizontal"/>
                        </a>

                        <Dropdown.Menu>
                            <MenuItem eventKey="1">Extra 1</MenuItem>
                            <MenuItem eventKey="2">Extra 2</MenuItem>
                            <MenuItem eventKey="3">Extra 3</MenuItem>
                        </Dropdown.Menu>

                    </Dropdown>

                </div>
            </div>
        );
    }
});

export default ReportActions;
