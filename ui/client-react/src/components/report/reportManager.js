import React from 'react';
import Fluxxor from 'fluxxor';
import Locale from '../../locales/locales';
import ReportGroup from './reportGroup';
import './reportManager.scss';
import SearchBox from '../search/searchBox';
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);

let ReportManager = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        onSelectReport: React.PropTypes.func,
        filterReportsName: React.PropTypes.string.isRequired,
        reportsData: React.PropTypes.object.isRequired
    },
    getDefaultProps() {
        return {filterReportsName:""};
    },
    onChangeSearch(ev) {
        const flux = this.getFlux();
        flux.actions.filterReportsByName(ev.target.value);
    },
    clearSearch() {
        const flux = this.getFlux();
        flux.actions.filterReportsByName("");
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.props.filterReportsName.toLowerCase()) !== -1;
    },
    reportList() {
        let filterList = [];
        if (_.has(this.props, 'reportsData.list')) {
            if (Array.isArray(this.props.reportsData.list)) {
                filterList = this.props.reportsData.list.filter((report) => {
                    return this.searchMatches(report.name || '');
                });
            }
        }
        return filterList;
    },

    /**
     * render a searchable set of report categories (hardcoded until we get the real ones...)
     */
    render() {
        const groupTitle = Locale.getMessage("reports.allReports");
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
                        <ReportGroup reports ={this.reportList()} title={groupTitle} onSelectReport={this.props.onSelectReport}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default ReportManager;
