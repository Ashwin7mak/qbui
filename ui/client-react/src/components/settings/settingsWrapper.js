import React, {PropTypes, Component} from 'react';
import Fluxxor from "fluxxor";
import {connect} from 'react-redux';
import AppShell from '../../../../reuse/client/src/components/appShell/appShell';
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../../reuse/client/src/components/sideNavs/standardLeftNav';
import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import {toggleLeftNav} from '../../actions/shellActions';
import * as FeatureSwitchActions from '../../actions/featureSwitchActions';
import {I18nMessage} from '../../utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

const SettingsWrapper = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            apps: flux.store('AppsStore').getState()
        };
    },

    getSelectedApp() {
        if (this.state.apps.selectedAppId) {
            return _.find(this.state.apps.apps, (a) => a.id === this.state.apps.selectedAppId);
        }
        return null;
    },
    getSelectedTable(tableId) {
        const app = this.getSelectedApp();
        if (app) {
            return _.find(app.tables, (t) => t.id === this.state.apps.selectedTableId);
        }
    },
    componentDidMount() {
        this.props.flux.actions.loadApps(true);

        if (this.props.params.appId) {
            this.props.flux.actions.selectAppId(this.props.params.appId);

            this.props.dispatch(FeatureSwitchActions.getStates(this.props.params.appId));

            if (this.props.params.tblId) {
                this.props.flux.actions.selectTableId(this.props.params.tblId);
            } else {
                this.props.flux.actions.selectTableId(null);
            }
        }
    },
    componentWillReceiveProps(props) {
        if (props.params.appId) {
            if (this.props.params.appId !== props.params.appId) {
                this.props.flux.actions.selectAppId(props.params.appId);

                this.props.dispatch(FeatureSwitchActions.getStates(props.params.appId));
            }
        } else {
            this.props.flux.actions.selectAppId(null);
        }

        if (this.props.params.appId !== props.params.appId) {
            this.props.flux.actions.selectAppId(props.params.appId);
            this.props.dispatch(FeatureSwitchActions.getStates(props.params.appId));
        }
        if (props.params.tblId) {
            if (this.props.params.tblId !== props.params.tblId) {
                this.props.flux.actions.selectTableId(props.params.tblId);
            }
        } else {
            this.props.flux.actions.selectTableId(null);
        }
    },

    render() {
        let selectedTable = this.getSelectedTable();
        return <AppShell functionalAreaName="settings">
            <LeftNav
                isCollapsed={this.props.isNavCollapsed}
                isOpen={true}
                isContextHeaderSmall={true}
                showContextHeader={true}
                contextHeaderIcon={selectedTable ? selectedTable.icon : null}
                contextHeaderIconTypeIsTable={true}
                contextHeaderTitle={selectedTable ? selectedTable.name : ""}
                navItems={[
                {title: <I18nMessage message={"nav.backToApp"}/>, isPrimaryAction: true, secondaryIcon: 'caret-left', link: '/qbase/apps'},
                ]}
            >
                <TopNav onNavClick={this.props.toggleNav}/>
                {React.cloneElement(this.props.children, {
                    app: this.getSelectedApp(),
                    table: this.getSelectedTable()
                })
                }
            </LeftNav>
        </AppShell>;
    }
});

SettingsWrapper.propTypes = {
    isNavCollapsed: PropTypes.bool,
    toggleNav: PropTypes.func
};

const mapStateToProps = (state) => ({
    isNavCollapsed: !state.shell.leftNavExpanded
});

const mapDispatchToProps = (dispatch) => {
    return {
        toggleNav: () =>{
            dispatch(toggleLeftNav());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper);
