import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import * as breakpoints from '../../constants/breakpoints';
import './nav.scss';
import Button from 'react-bootstrap/lib/Button';
import Trowser from '../trowser/trowser';
import TrowserRecordActions from '../actions/trowserRecordActions';
import Fluxxor from 'fluxxor';
import LeftNav from './leftNav';
import TopNav from '../header/topNav';
import Footer from '../footer/footer';
import ReportManager from '../report/reportManager';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Nav = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore', 'ReportsStore', 'ReportDataStore')],

    contextTypes: {
        breakpoint: React.PropTypes.string,
        touch: React.PropTypes.bool
    },
    // todo: maybe we should move this up another level into the router...
    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
            reportsData: flux.store('ReportsStore').getState(),
            reportData: flux.store('ReportDataStore').getState()
        };
    },

    getGlobalActions() {

        return [
            {msg:'globalActions.user', link:'/user', icon:'user'},
            {msg:'globalActions.help', link:'/help', icon:'help'}
        ];
    },
    hideTrowserExample() {
        let flux = this.getFlux();
        flux.actions.hideTrowser();
    },
    onSelectTableReports(tableId) {
        const flux = this.getFlux();

        flux.actions.loadReports(this.state.apps.selectedAppId, tableId);

        let reportManager = <ReportManager reportsData={this.state.reportsData} />;

        flux.actions.showTrowser(reportManager);
    },
    onHideTableReports() {
        const flux = this.getFlux();
        flux.actions.hideReports();
    },
    toggleAppsList(open) {
        const flux = this.getFlux();
        flux.actions.toggleAppsList(open);
    },
    renderLarge() {
        const flux = this.getFlux();

        let classes = 'navShell ';

        return (<div className={classes}>

            <Trowser position={"top"} visible={this.state.nav.trowserOpen} onHide={this.hideTrowserExample}>
                {this.state.nav.trowserContent}
                <div style={{height: "40px"}}>
                    <Button bsStyle="success" onClick={this.hideTrowserExample}
                        style={{position:"absolute", bottom:"10px", right:"10px"}}>Done</Button>
                </div>
            </Trowser>

            <LeftNav
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                reportsData={this.state.reportsData}
                selectedReportId={this.state.reportData.rptId}
                showReports={this.state.nav.showReports}
                toggleAppsList={this.toggleAppsList}
                onSelectReports={this.onSelectTableReports}
                onHideReports={this.onHideTableReports}/>

            <div className="main">
                <TopNav title="QuickBase"
                        globalActions={this.getGlobalActions()}
                        onNavClick={this.toggleNav}
                        flux={flux} />
                {this.props.children && <div className="mainContent" >
                    {/* insert the component passed in by the router */}
                    {React.cloneElement(this.props.children, {
                        key: this.props.location ? this.props.location.pathname : "",
                        selectedAppId: this.state.apps.selectedAppId,
                        reportData: this.state.reportData,
                        flux: flux}
                    )}
                </div>}

                <Footer flux= {flux} />
            </div>
        </div>);
    },
    onSelectItem() {
        const flux = this.getFlux();
        flux.actions.toggleLeftNav(false); // hide left nav after selecting items on small breakpoint
    },
    renderSmall() {
        const flux = this.getFlux();

        const searchBarOpen = this.state.nav.searchBarOpen;
        const searching = this.state.nav.searching;

        let classes = 'navShell';
        if (this.state.nav.leftNavOpen) {
            classes += ' leftNavOpen';
        }
        return (<div className={classes}>
            <Trowser position={"bottom"} visible={this.state.nav.trowserOpen} onHide={this.hideTrowserExample}>
                <TrowserRecordActions onClose={this.hideTrowserExample}/>
            </Trowser>

            <LeftNav
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                reportsData={this.state.reportsData}
                selectedReportId={this.state.reportData.rptId}
                showReports={this.state.nav.showReports}
                toggleAppsList={this.toggleAppsList}
                onSelectReports={this.onSelectTableReports}
                onHideReports={this.onHideTableReports}
                onSelect={this.onSelectItem}
                globalActions={this.getGlobalActions()} />

            <div className="main">
                <TopNav title="QuickBase"
                        globalActions={this.getGlobalActions()}
                        onNavClick={this.toggleNav}
                        flux={flux} />

                {this.props.children && <div className="mainContent" >
                    {/* insert the component passed in by the router */}
                    {React.cloneElement(this.props.children, {
                        key: this.props.location ? this.props.location.pathname : "",
                        selectedAppId: this.state.apps.selectedAppId,
                        reportData: this.state.reportData,
                        flux: flux}
                    )}
                </div>}

            </div>

        </div>);
    },
    render() {
        if ((this.context.breakpoint === breakpoints.SMALL_BREAKPOINT) && this.context.touch) {
            return this.renderSmall();
        } else {
            return this.renderLarge();
        }
    }
});

export default Nav;
