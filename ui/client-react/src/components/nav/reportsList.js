import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import Locale from '../../locales/locales';
import NavItem from './navItem';

let ReportsList = React.createClass({

    propTypes: {
        open: React.PropTypes.bool.isRequired,
        reportsOpen: React.PropTypes.bool.isRequired,
        onBack: React.PropTypes.func.isRequired,
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
            report.icon = 'list';

            return this.searchMatches(report.name) && <NavItem key={report.id} item={report} onSelect={this.props.onSelect} {...this.props} />;
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

                            <NavItem item={{msg: 'nav.reportsHeading'}} loadingCheck={this.props.reportsData.loading} isHeading={true} {...this.props} />
                        </ul>
                        <ul className={"reportItems"}>
                            {this.reportList()}
                        </ul>
                    </div> :
                    <div className={"reportsContainer"}>
                        <ul className={"reportsTop"}>
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
