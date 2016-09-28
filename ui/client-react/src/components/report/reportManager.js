import React from 'react';
import Fluxxor from 'fluxxor';
import Locale from '../../locales/locales';
import ReportGroup from './reportGroup';
import './reportManager.scss';
import SearchBox from '../search/searchBox';

let FluxMixin = Fluxxor.FluxMixin(React);

let ReportManager = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        onSelectReport: React.PropTypes.func,
        filterReportsName: React.PropTypes.string,
        reportsData: React.PropTypes.shape({
            list: React.PropTypes.array.isRequired
        })
    },
    getDefaultProps() {
        return {filterReportsName:""};
    },
    onChangeSearch(ev) {
        const flux = this.getFlux();
        flux.actions.filterReportsByName(ev.target.value);
        console.log(ev.target.value);
    },
    clearSearch() {
        const flux = this.getFlux();
        flux.actions.filterReportsByName("");
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.props.filterReportsName.toLowerCase()) !== -1;
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
                                       value={this.props.filterReportsName}
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
