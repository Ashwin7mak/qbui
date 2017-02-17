import React, {PropTypes} from 'react';
import FormBuilderContainer from './formBuilderContainer';
import Fluxxor from "fluxxor";
import './builderWrapper.scss';
import GlobalActions from '../actions/globalActions';
import {NotificationContainer} from "react-notifications";

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;


/**
 * The NavStore and the AppsStore are both needed for globalActions (The User and Help Button Located at the top of the screen)
 * The NavStore updates the locale and the AppsStore selects the appId.
 * */
const BuilderWrapper = React.createClass({
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

    getTopGlobalActions() {
        const actions = [];
        return (<GlobalActions actions={actions}
                               flux={this.props.flux}
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
                <div className="topNav">
                    {this.getTopGlobalActions()}
                     <NotificationContainer/>
                </div>

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

export default BuilderWrapper;
