import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import Fluxxor from 'fluxxor';
import Hicon from '../../harmonyIcon/harmonyIcon';

import './reportActions.scss';

import {MenuItem, Dropdown, CustomMenu, ButtonGroup, Button, Tooltip, OverlayTrigger, Popover, Glyphicon, Input} from 'react-bootstrap';

let FluxMixin = Fluxxor.FluxMixin(React);

let EmailReportLink = React.createClass({

    propTypes: {
        subject:React.PropTypes.string,
        body:React.PropTypes.string
    },
    render() {
        const href = "mailto:?subject=" + this.props.subject + "&body=" + this.props.body;
        const tooltip = <Tooltip id={this.props.tip}>{this.props.tip}</Tooltip>
        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <a  href={href} >
                    <Hicon icon="email" />
                </a>
            </OverlayTrigger>);
    }

});

let ActionIcon = React.createClass({

    render() {
        const tooltip = <Tooltip id={this.props.tip} positionTop={22}>{this.props.tip}</Tooltip>
        return (
         <OverlayTrigger placement="top" overlay={tooltip}>
             <a><Hicon icon={this.props.icon}/></a>
        </OverlayTrigger>);

    }
});

let ReportActions = React.createClass({
    mixins: [FluxMixin],

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
