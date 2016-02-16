import React from 'react';
import Locale from '../../locales/locales';
import ReportGroup from './reportGroup';
import './reportManager.scss';

let ReportManager = React.createClass({

    propTypes: {
        onSelectReport: React.PropTypes.func,
        reportsData: React.PropTypes.shape({
            list: React.PropTypes.array.isRequired
        })
    },
    getInitialState() {
        return {searchText:""};
    },
    onChangeSearch(ev) {
        console.log('now',ev.target.value);
        this.setState({searchText: ev.target.value});
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },
    reportList() {
        return this.props.reportsData.list.filter((report) => {
            return this.searchMatches(report.name);
        });
    },
    render() {
        return (
            <div className={"reportsList"}>
                <div className={"reportsContainer"}>
                    <div className={"reportsTop"}>

                        <div className="searchReports">
                            <input tabIndex={0} type="text" placeholder={Locale.getMessage('nav.searchReportsPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                        </div>

                    </div>
                    <div className="reportGroups">
                        <ReportGroup reports ={this.reportList()} title={"Recent"} onSelectReport={this.props.onSelectReport} isOpen={true}/>
                        <ReportGroup reports ={this.reportList()} title={"Common"} onSelectReport={this.props.onSelectReport}/>
                        <ReportGroup reports ={this.reportList()} title={"My Reports"} onSelectReport={this.props.onSelectReport}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default ReportManager;
