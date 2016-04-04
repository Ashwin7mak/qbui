import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
import FilterSearchBox from '../facet/filterSearchBox';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import FilterUtils from '../../utils/filterUtils';
import './reportHeader.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var ReportHeader = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        reportData: React.PropTypes.object,
        nameForRecords: React.PropTypes.string,
        searchTheString: React.PropTypes.func,
        clearSearchString: React.PropTypes.func,
    },
    getInitialState() {
        return {
            searching: false,
        };
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    handleSearchChange(e) {
        if (this.props.searchTheString) {
            var searchTxt = e.target.value;
            this.props.searchTheString(searchTxt);
        }
    },
    // show the search elements
    startSearching() {
        this.setState({searching: true});
    },
    // hide the search elements
    cancelSearch() {
        this.setState({searching: false});
    },

    render: function() {
        const headerClasses = "reportHeader" + (this.state.searching ? " searching" : "");

        const reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (<div className={headerClasses}>
            <div className="left">
                <a className="iconLink toggleNavButton" href="#" onClick={this.onNavClick}>
                    <QBicon icon="hamburger" />
                </a>
            </div>

            <div className="center title">
                <QBicon icon="report-menu-3"/><span className="reportLabel">{reportName}</span>
            </div>

            <div className="center searchElements">
                <FilterSearchBox onChange={this.handleSearchChange}
                                 nameForRecords={this.props.nameForRecords}
                                 searchBoxKey="reportHeader"
                                {...this.props} />
                <a className="textLink" href="#" onClick={this.cancelSearch}>
                    <I18nMessage message="cancel"/>
                </a>
            </div>

            <div className="right">
                <a className="iconLink" href="#" onClick={this.startSearching}>
                    <QBicon icon="search" />
                </a>
                <a className="iconLink" href="#">
                    <QBicon icon="star-full" />
                </a>
            </div>
        </div>);
    }
});

export default ReportHeader;
