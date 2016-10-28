import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import Breakpoints from '../../utils/breakpoints';
import {I18nMessage} from '../../utils/i18nMessage';

import './appHomePage.scss';

const supportEmail = 'betaprogram@quickbase.com';
function i18nKey(subkey) {
    return `app.homepage.${subkey}`;
}

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
                <div className="appHomePageWidthConstraint">
                    <div className="homePanel topPanel">
                        <div className="topPanelContent">
                            <h2><I18nMessage message={i18nKey('welcomeTitle')} /></h2>
                            <p><I18nMessage message={i18nKey('welcomeText')} /></p>
                        </div>
                        <div className="topPanelLinks">
                            <a className="linkWithImage" href="videotour"><img className="launchTourImage" /><span><I18nMessage message={i18nKey('launchVideoLink')} /></span></a>
                            <a className="linkWithImage" href="guidme"><img className="guideMeImage" /><span><I18nMessage message={i18nKey('guideMeLink')} /></span></a>
                        </div>
                    </div>
                    <div className="mainPanel">
                        <div className="homePanel leftContent">
                            <h4><I18nMessage message={i18nKey('guideTitle')} /></h4>
                            <img className="welcomeGuideImage" />
                            <p><I18nMessage message={i18nKey('guideText')} /></p>
                            <button className="btn btn-primary"><I18nMessage message={i18nKey('guideButton')} /> <small>(.pdf)</small></button>
                        </div>
                        <div className="homePanel rightContent">
                            <h4><I18nMessage message={i18nKey('feedbackTitle')} /></h4>
                            <div className="giveFeedbackImageContainer">
                                <img className="giveFeedbackImage" />
                            </div>
                            <p><I18nMessage message={i18nKey('feedbackText')} /></p>
                            <button className="btn btn-primary btn-feedback"><I18nMessage message={i18nKey('feedbackButton')} /></button>
                        </div>
                    </div>
                    <div className="bottomPanel">
                        <div className="homePanel bottomSubPanel leftBottomPanel">
                            <div className="homePageTipImageContainer">
                                <img className="homePageTipImage" />
                            </div>
                            <div className="leftBottomPanelContent">
                                <h4><I18nMessage message={i18nKey('tipTitle')} /></h4>
                                <p><I18nMessage message={i18nKey('tipText')} /></p>
                            </div>
                        </div>
                        <div className="homePanel bottomSubPanel rightBottomPanel">
                            <img className="homePageHelpImage" />
                            <div className="rightBottomPanelContent">
                                <h4><I18nMessage message={i18nKey('helpTitle')} /></h4>
                                <p><I18nMessage message={i18nKey('helpText')} /></p>
                                <div className="supportEmail">
                                    <QBicon icon="mail"/>
                                    <p className="supportEmailText"><I18nMessage message={i18nKey('helpLinkPreText')} /> <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p>
                                </div>
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
