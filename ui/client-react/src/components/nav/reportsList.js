import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import Locale from '../../locales/locales';

let ReportsList = React.createClass({

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
            report.icon = 'list-alt';

            return this.searchMatches(report.name) && this.props.buildItem(report);
        });
    },
    render() {
        return (
            <div className={"reportsList " + (this.props.reportsOpen ? "open" : "")}>
                {this.props.open ?
                    <ul>

                        <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/> Back</a></li>

                        <li className="searchReports">
                            <input type="text" placeholder={Locale.getMessage('nav.searchReportsPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                        </li>

                        { this.props.buildHeading({key: 'nav.reportsHeading'}, this.props.reportsData.loading) }

                        {this.reportList()}
                    </ul> :
                    <ul>
                        <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/></a></li>
                        {this.reportList()}
                    </ul>}
            </div>
        );
    }
});

export default ReportsList;