import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';

import {MenuItem, Dropdown} from 'react-bootstrap';

import ActionIcon from './actionIcon';
import EmailReportLink from './emailReportLink';

import './reportActions.scss';

/**
 * report-level actions
 */
let ReportActions = React.createClass({

    propTypes: {
        selection: React.PropTypes.array,
        report: React.PropTypes.object,
        app: React.PropTypes.object,
        table: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            report: {name: 'report name'},
            table: {name: 'table name'},
            app: {name: 'app name'},
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
                        <ActionIcon icon="delete" tip={this.getSelectionTip("selection.delete")}/>

                        {/* custom actions later
                         {this.props.customActions &&
                         <div className="actionButtons">
                         {this.props.customActions.map((action) => {
                         return (<a key={action}><Button bsStyle="primary">{action}</Button></a>);
                         })}

                         </div>}


                        <Dropdown id="extraActionsMenu">

                            <ActionIcon icon="pickles" bsRole="toggle" tip={Locale.getMessage('selection.more')}/>

                            <Dropdown.Menu>
                                <MenuItem eventKey="1">Extra 1 goes here</MenuItem>
                                <MenuItem eventKey="2">Extra 2 goes here</MenuItem>
                                <MenuItem eventKey="3">Extra 3 goes here</MenuItem>
                            </Dropdown.Menu>

                        </Dropdown>
                         */}
                    </div>

                </div>
            </div>
        );
    }
});

export default ReportActions;
