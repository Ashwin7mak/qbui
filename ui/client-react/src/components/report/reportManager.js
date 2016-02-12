import React from 'react';
import Locale from '../../locales/locales';
import ReportGroup from './reportGroup';
import './reportManager.scss';

let ReportManager = React.createClass({

    propTypes: {

        reportsData: React.PropTypes.shape({
            list: React.PropTypes.array.isRequired
        })
    },
    getInitialState() {
        return {searchText:""};
    },
    onChangeSearch(ev) {
        this.setState({searchText: ev.target.value});
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },
    reportList() {
        return this.props.reportsData.list && this.props.reportsData.list.map((report) => {
            report.icon = 'report-line-bar';

            return this.searchMatches(report.name) && <div key={report.id} >{report.name}</div>;
        });
    },
    render() {
        return (
            <div className={"reportsList"}>
                <div className={"reportsContainer"}>
                    <div className={"reportsTop"}>

                        <div className="searchReports">
                            <input type="text" placeholder={Locale.getMessage('nav.searchReportsPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                        </div>

                    </div>
                    <div className="reportGroups">
                        <ReportGroup reports ={this.props.reportsData.list} title={"Recent"} />
                        <ReportGroup reports ={this.props.reportsData.list} title={"Common"} />
                        <ReportGroup reports ={this.props.reportsData.list} title={"My Reports"} />
                    </div>
                </div>
            </div>
        );
    }
});

export default ReportManager;
