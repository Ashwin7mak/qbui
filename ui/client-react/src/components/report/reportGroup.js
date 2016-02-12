import React from 'react';
import Locale from '../../locales/locales';
import QBicon from '../qbIcon/qbIcon';
import QBPanel from '../QBPanel/qbpanel';
import {Link} from 'react-router';

let Report = React.createClass({

    propTypes: {
        report: React.PropTypes.object.isRequired
    },
    render() {

        return (<Link key={this.props.report.id} className="reportLink" to={this.props.report.link}><QBicon icon="report-line-bar"/>{this.props.report.name}</Link>);
    }
});

let ReportGroup = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        reports: React.PropTypes.array.isRequired
    },
    render() {

        return (
            <div className={"reportGroup"}>
                <QBPanel isOpen={true} title={this.props.title} iconRight={false}>
                    <div className={"reportItems"}>
                        {this.props.reports.map((report) => {
                            return (<Report key={report.id} report={report}/>);
                        })}
                    </div>
                </QBPanel>
             </div>);
    }
});

export default ReportGroup;
