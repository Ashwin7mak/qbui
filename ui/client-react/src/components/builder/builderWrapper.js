import React, {PropTypes} from 'react';
import FormBuilderContainer from './formBuilderContainer';
import Fluxxor from "fluxxor";
import {connect} from 'react-redux';
import commonNavActions from '../../../../reuse/client/src/components/sideNavs/commonNavActions';
import './builderWrapper.scss';
import GlobalActions from '../actions/globalActions';
import {NotificationContainer} from "react-notifications";
import TopNav from '../../../../reuse/client/src/components/topNav/topNav';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;


/**
 * The AppsStore is needed for globalActions (The User and Help Button Located at the top of the screen)
 * The AppsStore selects the appId.
 * */
export const BuilderWrapper = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('AppsStore')],

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

    getTopGlobalActions() {
        const actions = [];
        return (<GlobalActions actions={actions}
                               position={"top"}
                               dropdownIcon="user"
                               dropdownMsg="globalActions.user"
                               startTabIndex={4}
                               app={this.getSelectedApp()}/>);
    },

    render() {
        /**
         *formId is set to null for now, it is left here, because formId will need to be passed down as a prop in a future story
         * */
        const formId = null;
        const {appId, tblId} = this.props.params;
        const formType = this.props.location.query.formType;

        return (
            <div className="builderWrapperContent">
                <NotificationContainer/>
                <TopNav
                    onNavClick={this.props.toggleNav}
                    globalActions={this.getTopGlobalActions()}
                />

                <div className="builderWrapperBody">
                    <FormBuilderContainer
                    appId={appId}
                    tblId={tblId}
                    formType={formType}
                    formId={formId} />
                </div>

            </div>
        );
    }
});

export default connect(null, commonNavActions('builder'))(BuilderWrapper);
