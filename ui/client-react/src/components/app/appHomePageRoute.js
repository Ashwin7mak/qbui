import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import Breakpoints from '../../utils/breakpoints';

import './appHomePage.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();
/**
 * placeholder for app dashboard route
 */
let AppHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    contextTypes: {
        touch: React.PropTypes.bool
    },
    selectAppId(appId) {
        let flux = this.getFlux();
        flux.actions.selectAppId(appId);
    },
    selectAppFromParams(params, checkParams) {
        if (params) {
            let appId = params.appId;

            if (this.props.selectedAppId === appId) {
                return;
            }

            if (checkParams) {
                if (this.props.params.appId === appId) {
                    return;
                }
            }

            if (appId) {
                logger.debug('Loading app. AppId:' + appId);
                this.selectAppId(appId);
            }
        }
    },

    getTopTitle() {
        return (this.props.selectedApp &&
            <div className="topTitle">
                <QBicon icon="favicon"/>
                <span>{this.props.selectedApp.name}</span>
            </div>
        );
    },

    componentDidMount() {
        // no title for now...
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();
        this.selectAppFromParams(this.props.params);
        flux.actions.doneRoute();
    },
    // Triggered when properties change
    componentWillReceiveProps: function(props) {
        this.selectAppFromParams(props.params, true);
    },

    getPageActions(maxButtonsBeforeMenu = 0) {
        const actions = [
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizePage', icon:'settings-hollow'}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    },
    getStageHeadline() {
        return (this.props.selectedApp &&
            <div className="stageHeadline">
                <h3 className="appName breadCrumbs"><QBicon icon="favicon"/> {this.props.selectedApp.name}</h3>
            </div>
        );
    },
    getSecondaryBar() {
        return (
            <div className="secondaryAppHomePageActions">
                {/* todo */}
            </div>);
    },
    render: function() {
        let isSmall = Breakpoints.isSmallBreakpoint();

        let content = (
            <div className="appHomePage">
                <div className="homePanel topPanel">
                    <div className="topPanelContent">
                        <h2>Welcome to Mercury Beta</h2>
                        <p>
                            Cum demolitione credere, omnes gemnaes vitare rusticus, peritus nutrixes.
                            O, break me jolly roger, ye wet hornpipe! The shark trades with passion, hoist the seychelles until it screams.
                            Break me gibbet, ye evil jack! The wave ransacks with adventure, rob the freighter before it hobbles.
                        </p>
                    </div>
                    <div className="topPanelLinks">
                        <a className="linkWithImage" href="videotour"><QBicon icon="check-reversed" /><span>Launch Video Tour</span></a>
                        <a className="linkWithImage" href="guidme"><QBicon icon="check-reversed" /><span>Guide me through Mercury</span></a>
                    </div>
                </div>
                <div className="homePanel mainPanel">
                    <div className="content leftContent">
                        <h4>Welcome guide</h4>
                        <img src="http://placehold.it/350x300" />
                        <button className="btn btn-primary">Download the Welcome Guide <small>(.pdf)</small></button>
                    </div>
                    <div className="content rightContent">
                        <h4>We want your feedback</h4>
                        <img src="http://placehold.it/350x300" />
                        <button className="btn btn-primary btn-feedback">Give Feedback</button>
                    </div>
                </div>
                <div className="bottomPanel">
                    <div className="homePanel bottomSubPanel leftBottomPanel">
                        <div className="homePageTipImageContainer">
                            <img className="homePageTipImage" />
                        </div>
                        <div className="leftBottomPanelContent">
                            <h4>Nothing happened when I clicked...</h4>
                            <p>This is a work in progress. Belay, black yardarm. go to haiti. Never sail a codfish.</p>
                            <p>Note: Most unsupported features show up in gray.</p>
                        </div>
                    </div>
                    <div className="homePanel bottomSubPanel rightBottomPanel">
                        <img className="homePageHelpImage" />
                        <div className="rightBottomPanelContent">
                            <h4>Need help?</h4>
                            <p>We want you to be successful, that's why we're always here to help. Contact us for assistance with your Mercury App.</p>
                            <div className="supportEmail">
                                <QBicon icon="mail"/>
                                <p className="supportEmailText">Please contact us at <a href="mailto:betaprogram@quickbase.com">betaprogram@quickbase.com</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        if (isSmall) {
            content = (
                <div className="appHomePageContainer">
                    <div className="appHomePageActionsContainer secondaryBar">
                        {this.getSecondaryBar()}
                        {this.getPageActions(2)}
                    </div>
                    {content}
                </div>
            );
        }

        return content;
    }
});

export default AppHomePageRoute;
