import React from 'react';

import Locale from '../../locales/locales';
import ReportGroup from './reportGroup';
import './reportManager.scss';
import SearchBox from '../search/searchBox';

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
        this.setState({searchText: ev.target.value});
    },
    clearSearch() {
        this.setState({searchText: ""});
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },
    reportList() {
        return this.props.reportsData.list.filter((report) => {
            return this.searchMatches(report.name);
        });
    },
    /**
     * render a searchable set of report categories (hardcoded until we get the real ones...)
     */
    render() {
        return (
            <div className={"reportsList"}>
                <div className={"reportsContainer"}>
                    <div className={"reportsTop"}>

                        <div className="searchReports">
                            <SearchBox tabIndex="0"
                                       value={this.state.searchText}
                                       onChange={this.onChangeSearch}
                                       onClearSearch={this.clearSearch}
                                       placeholder={Locale.getMessage('nav.searchReportsPlaceholder')}/>
                        </div>

                    </div>
                    <div className="reportGroups">
                        <ReportGroup reports ={this.reportList()} title={"Recent"} onSelectReport={this.props.onSelectReport}/>
                        <ReportGroup reports ={this.reportList()} title={"Common"} onSelectReport={this.props.onSelectReport}/>
                        <ReportGroup reports ={this.reportList()} title={"My Reports"} onSelectReport={this.props.onSelectReport}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default ReportManager;
