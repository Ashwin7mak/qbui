import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import * as breakpoints from '../../constants/breakpoints';
import './nav.scss';

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
        touch: React.PropTypes.bool,
        history: React.PropTypes.object
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
    hideTrowser() {
        let flux = this.getFlux();
        flux.actions.hideTrowser();
    },
    onSelectTableReports(tableId) {
        const flux = this.getFlux();

        if ((this.context.breakpoint === breakpoints.SMALL_BREAKPOINT) && this.context.touch) {
            flux.actions.toggleLeftNav(false);
        }
        flux.actions.loadReports(this.state.apps.selectedAppId, tableId).then(() => {
            flux.actions.showTrowser();
        });
    },

    getTrowserContent() {

        let selectReport = (report) => {
            this.hideTrowser();
            setTimeout(() => {
                this.context.history.pushState(null, report.link);
            });
        };
        return <ReportManager reportsData={this.state.reportsData}
                              onSelectReport={selectReport}/>;
    },

    toggleAppsList(open) {
        const flux = this.getFlux();
        flux.actions.toggleAppsList(open);
    },
    renderLarge() {
        const flux = this.getFlux();

        let classes = 'navShell ';

        return (<div className={classes}>

            <Trowser position={"top"} visible={this.state.nav.trowserOpen} onCancel={this.hideTrowser} onDone={this.hideTrowser}>
                {this.getTrowserContent()}

            </Trowser>

            <LeftNav
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                onSelectReports={this.onSelectTableReports}
                toggleAppsList={this.toggleAppsList} />
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

        let classes = 'navShell';
        if (this.state.nav.leftNavOpen) {
            classes += ' leftNavOpen';
        }
        return (<div className={classes}>
            <Trowser position={"top"} visible={this.state.nav.trowserOpen} onHide={this.hideTrowser}>
                {this.getTrowserContent()}
            </Trowser>

            <LeftNav
                open={this.state.nav.leftNavOpen}
                appsListOpen={this.state.nav.appsListOpen}
                apps={this.state.apps.apps}
                selectedAppId={this.state.apps.selectedAppId}
                selectedTableId={this.state.apps.selectedTableId}
                toggleAppsList={this.toggleAppsList}
                onSelect={this.onSelectItem}
                onSelectReports={this.onSelectTableReports}
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
