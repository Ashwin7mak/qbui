import React, {PropTypes} from 'react';
import FormBuilderContainer from './formBuilderContainer';
import Fluxxor from "fluxxor";
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import GlobalActions from '../actions/globalActions';
import {NotificationContainer} from "react-notifications";
import AppHistory from '../../globals/appHistory';
import Logger from '../../utils/logger';
import {updateForm} from '../../actions/formActions';
import {connect} from 'react-redux';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

let logger = new Logger();

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

    onCancel() {
        AppHistory.history.goBack();
    },
    saveClicked() {
        logger.debug('clicked form save');
        // get the form meta data from the store..hard code offset for now...this is going to change..
        let formMeta = this.props.qbui.forms[0].formData.formMeta;
        let formType = this.props.qbui.forms[0].formData.formType;
        this.props.updateForm(formMeta.appId, formMeta.tableId, formType, formMeta);
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

    getSaveOrCancelFooter() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAlignedButtons={this.getCenterAlignedButtons()}
            leftAlignedButtons={this.getLeftAlignedButtons()}
        />;
    },
    render() {
        /**
         *formId is set to null for now, it is left here, because formId will need to be passed down as a prop in a future story
         * */
        const formId = null;
        const {appId, tblId} = this.props.params;
        const formType = this.props.location.query.formType;

        return (
            <div className="builderWrapperContent" >
                <div className="main">
                    <div className="topNav">
                    {this.getTopGlobalActions()}
                     <NotificationContainer/>
                </div>
            </div>

                <FormBuilderContainer
                appId={appId}
                tblId={tblId}
                formType={formType}
                formId={formId} />

                {this.getSaveOrCancelFooter()}
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        forms: state.forms
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateForm: (appId, tblId, formType, form) => {
            dispatch(updateForm(appId, tblId, formType, form));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuilderWrapper);
