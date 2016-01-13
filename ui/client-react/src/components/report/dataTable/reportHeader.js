import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import Fluxxor from 'fluxxor';
import Hicon from '../../harmonyIcon/harmonyIcon';
import EmailReportLink from '../../actions/emailReportLink';
import './reportHeader.scss';

import {Glyphicon, Input} from 'react-bootstrap';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * a header for table reports with search field and a filter icon
 */
var ReportHeader = React.createClass({
    mixins: [FluxMixin],

    searchChanged(ev) {
        const text = ev.target.value;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },

    getReportLink() {
        return window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/app/" + this.props.reportData.appId + "/table/" + this.props.reportData.tblId + "/report/" + this.props.reportData.rptId;
    },
    getEmailBody() {
        const reportName = this.props.reportData.data.name;
        return 'Here\'s the "' + reportName + '" report from the table "Tasks" in "' + this.props.reportData.appId + '":%0D%0A%0D%0A' + this.getReportLink();
    },
    getEmailSubject() {
        const reportName = this.props.reportData.data.name;
        return '"' + reportName + '" report from the QuickBase app "' + this.props.reportData.appId + '"';
    },
    getEmailLinkText() {
        return "" ;// Locale.getMessage('selection.email');
    },
    getEmailLinkTooltip() {
        return Locale.getMessage('reports.emailReportTooltip');
    },
    render() {

        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={"tableBar"}>

                <div>
                    <div className="searchInput">
                        <Input bsClass="search" size="30" className="searchInputBox" standalone addonBefore={searchIcon} type="text" placeholder="Search Records"  onChange={this.searchChanged} />
                    </div>
                    <a><Hicon icon="filter"/></a>
                    <div className="reportLinks">
                        <EmailReportLink subject={this.getEmailSubject()}
                                         body={this.getEmailBody()}
                                         tipPlacement="bottom"
                                         tip={this.getEmailLinkTooltip()}>
                            {this.getEmailLinkText()}
                        </EmailReportLink>
                    </div>
                </div>
            </div>
        );
    }
});

export default ReportHeader;
