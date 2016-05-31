import React from 'react';
import Locale from '../../locales/locales';
import QBicon from '../qbIcon/qbIcon';
import QBPanel from '../QBPanel/qbpanel';
import {Link} from 'react-router';
import A11Utils from '../../utils/a11yUtils';
/**
 * a single report item
 */
let Report = React.createClass({

    propTypes: {
        onSelect: React.PropTypes.func,
        report: React.PropTypes.object.isRequired
    },

    getIconForReport(report) {

        switch (report.type) {
        case "TABLE":
        case "PIVOT":
            return "report-table";
        case "SUMMARY":
        case "NEWSUMMARY":
            return "report-summary";
        case "CHART":
            return "report-pie";
        case "CALENDAR":
            return "report-calendar";
        case "GEDIT":
            return "report-grid-edit";
        case "TIMELINE":
            return "report-timeline";
        case "MAP":
            return "report-map";
        default:
            return "report-table";
        }
    },
    onClick(event) {
        if (this.props.onSelect && A11Utils.isA11yClick(event)) {
            this.props.onSelect(this.props.report);
        }
    },
    render() {
        return (<a key={this.props.report.id} tabIndex="0"
                      className="reportLink"
                      to={this.props.report.link}
                      onClick={this.onClick} onKeyDown={this.onClick}>
                    <QBicon icon={this.getIconForReport(this.props.report)}/>{this.props.report.name}
                </a>);
    }
});

/**
 * a group of report items (one for each category)
 */
let ReportGroup = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        reports: React.PropTypes.array.isRequired,
        onSelectReport: React.PropTypes.func,
        isOpen: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            isOpen: true
        };
    },
    render() {

        return (
            <div className={"reportGroup"}>
                <QBPanel isOpen={this.props.isOpen} title={this.props.title} iconRight={false}>
                    <div className={"reportItems"}>
                        {this.props.reports.map((report) => {
                            return (<Report key={report.id} report={report} onSelect={this.props.onSelectReport}/>);
                        })}
                    </div>
                </QBPanel>
             </div>);
    }
});

export default ReportGroup;
