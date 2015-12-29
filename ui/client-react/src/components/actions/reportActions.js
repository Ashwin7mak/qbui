import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';

import {MenuItem, Dropdown, Glyphicon} from 'react-bootstrap';

import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

import './reportActions.scss';

/**
 * report-level actions
 */
let ReportActions = React.createClass({

    propTypes: {
        selection:React.PropTypes.array.required,
        report:React.PropTypes.object,
        app:React.PropTypes.object,
        table:React.PropTypes.object
    },
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

    getSelectionTip(action) {

        const suffix = this.props.selection.length === 1 ? " record" : " records";

        return action + " " + this.props.selection.length + suffix;
    },

    render() {

        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={'reportActions'}>

                <div>
                    {<span className="selectedRowsLabel">{this.props.selection.length}</span>}
                    <div className="actionIcons">
                        {this.props.selection.length === 1 && <ActionIcon icon="edit" tip={this.getSelectionTip("Edit")}/>}
                        <ActionIcon icon="print" tip={this.getSelectionTip("Print")}/>

                        <EmailReportLink tip={this.getSelectionTip("Email")}
                                         subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}/>

                        <ActionIcon icon="copy" tip={this.getSelectionTip("Copy")}/>
                        <ActionIcon icon="delete" tip={this.getSelectionTip("Delete")}/>

                        {/* custom actions later
                         {this.props.customActions &&
                         <div className="actionButtons">
                         {this.props.customActions.map((action) => {
                         return (<a key={action}><Button bsStyle="primary">{action}</Button></a>);
                         })}

                         </div>}
                         */}

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
            </div>
        );
    }
});

export default ReportActions;
