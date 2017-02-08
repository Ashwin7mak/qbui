import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button} from 'react-bootstrap';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter';
import GlobalActions from '../actions/globalActions';
import {NotificationContainer} from "react-notifications";
import AppHistory from '../../globals/appHistory';

const BuilderWrapper = React.createClass({

    /**
     * navigate back/forth to a new record
     * @param recId
     */
    navigateBackToRecord(appId, tblId, rptId, recId) {
        let app = this.props.flux.store('AppsStore').getState();
        const link = `/qbase/app/${appId}/table/${tblId}/report/${rptId}/record/${recId}`;
        this.props.router.push(link);
    },

    onCancel() {
        AppHistory.history.goBack();
    },
    saveClicked() {
        //This will connect with redux
        console.log('Saving!');
    },

    getRightAlignedButtons() {
      return(
          <div>
            <Button bsStyle="primary" onClick={this.onCancel}><I18nMessage message="nav.cancel"/></Button>
            <Button bsStyle="primary" onClick={this.saveClicked}><I18nMessage message="nav.save"/></Button>
          </div>
      );
    },

    getLeftAlignedButtons() {
        return <div></div>
    },

    getCenterAlignedButtons() {
        return <div className={"centerActions"} />;

    },
    getSelectedApp() {
        let app = this.props.flux.store('AppsStore').getState();
        console.log('APP: ', app);
        if (app.selectedAppId) {
            return _.find(app.apps, (a) => a.id === app.selectedAppId);
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
        />
    },
    render() {
        console.log('this.props: ', this.props);
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
