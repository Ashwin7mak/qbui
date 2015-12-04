import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import Locale from '../../locales/locales';

let ReportsList = React.createClass({

    propTypes: {
        open: React.PropTypes.bool.isRequired,
        reportsOpen: React.PropTypes.bool.isRequired,
        onBack: React.PropTypes.func.isRequired,
        buildItem: React.PropTypes.func.isRequired,
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
            report.icon = 'list-alt';

            return this.searchMatches(report.name) && this.props.buildItem(report, this.props.onSelect);
        });
    },
    render() {
        return (
            <div className={"reportsList " + (this.props.reportsOpen ? "open" : "")}>
                {this.props.open ?
                    <div className={"reportsContainer"}>
                        <ul className={"reportsTop"}>
                            <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/> Back</a></li>

                            <li className="searchReports">
                                <input type="text" placeholder={Locale.getMessage('nav.searchReportsPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                            </li>

                            { this.props.buildHeading({key: 'nav.reportsHeading'}, this.props.reportsData.loading) }
                        </ul>
                        <ul className={"reportItems"}>
                            {this.reportList()}
                        </ul>
                    </div> :
                    <div className={"reportsContainer"}>
                        <ul lassName={"reportsTop"}>
                            <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/></a></li>
                        </ul>
                        <ul className={"reportItems"}>
                            {this.reportList()}
                        </ul>
                    </div>}
            </div>
        );
    }
});

export default ReportsList;
