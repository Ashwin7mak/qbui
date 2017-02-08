import React from 'react';
import Fluxxor from "fluxxor";
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import GlobalActions from '../actions/globalActions';
import {NotificationContainer} from "react-notifications";
import AppHistory from '../../globals/appHistory';


let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

const BuilderWrapper = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('NavStore', 'AppsStore')],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            nav: flux.store('NavStore').getState(),
            apps: flux.store('AppsStore').getState(),
        };
    },

    onCancel() {
        AppHistory.history.goBack();
    },
    saveClicked() {
        //This will connect with redux
    },

    getRightAlignedButtons() {
        return (
              <div>
                <Button bsStyle="primary" onClick={this.onCancel}><I18nMessage message="nav.cancel"/></Button>
                <Button bsStyle="primary" onClick={this.saveClicked}><I18nMessage message="nav.save"/></Button>
              </div>
      );
    },

    getLeftAlignedButtons() {
        return <div></div>;
    },

    getCenterAlignedButtons() {
        return <div className={"centerActions"} />;

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

    saveOrCancelFooter() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAligendButtons={this.getCenterAlignedButtons()}
            leftAligendBUttons={this.getLeftAlignedButtons()}
        />;
    },
    render() {
        return (
            <div className="builderWrapperContent" >
                <div className="main">
                    <div className="topNav">
                        {this.getTopGlobalActions()}
                        <NotificationContainer/>
                    </div>
                </div>
                <div className="builderWrapperChildren">
                    {this.props.children}

                </div>
                <SaveOrCancelFooter
                    rightAlignedButtons={this.getRightAlignedButtons()}
                    centerAligendButtons={this.getCenterAlignedButtons()}
                    leftAligendBUttons={this.getLeftAlignedButtons()} />
            </div>
        );
    }
});

export default BuilderWrapper;
