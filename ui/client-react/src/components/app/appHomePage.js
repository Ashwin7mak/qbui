import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {NotificationManager} from 'react-notifications';
import {SUPPORT_LINK} from '../../constants/urlConstants';

import './appHomePage.scss';

function i18nKey(subkey) {
    return `app.homepage.${subkey}`;
}

const videoTourLink = 'https://quickbase.wistia.com/medias/zl4za7cf5e';
const welcomeGuideLink = 'https://d2qhvajt3imc89.cloudfront.net/customers/QuickBase/MercuryBeta_WelcomeGuide-v1.0.pdf';
const feedbackLink = 'https://quickbase.uservoice.com/forums/378045-mercury';

/**
 * Scripts for Wistia video popover
 * These script tags are only relevant to this temporary homepage
 * They load script from a video hosting service called Wistia and allow the walk-through video to load as a popover
 */
const wistiaScriptPart1 = document.createElement("script");
wistiaScriptPart1.src = "//fast.wistia.com/embed/medias/zl4za7cf5e.jsonp";
wistiaScriptPart1.async = true;

const wistiaScriptPart2 = document.createElement("script");
wistiaScriptPart2.src = "//fast.wistia.com/assets/external/E-v1.js";
wistiaScriptPart2.async = true;

/**
 * Temporary homepage for M5 Beta
 */
const AppHomePage = React.createClass({
    launchGuideMe() {
        try {
            WalkMeAPI.startWalkthruById(228348);
        } catch (err) {
            NotificationManager.info(Locale.getMessage(i18nKey('missingWalkMe')), '', 1500);
        }
    },
    componentWillMount() {
        document.body.appendChild(wistiaScriptPart1);
        document.body.appendChild(wistiaScriptPart2);
    },
    componentWillUnmount() {
        document.body.removeChild(wistiaScriptPart1);
        document.body.removeChild(wistiaScriptPart2);
    },
    render() {
        return (
            <div className="appHomePage">
                <div className="appHomePageWidthConstraint">
                    <div className="homePanel topPanel">
                        <div className="topPanelContent">
                            <h2><I18nMessage message={i18nKey('welcomeTitle')} /></h2>
                            <p><I18nMessage message={i18nKey('welcomeText')} /></p>
                        </div>
                        <div className="topPanelLinks">
                            <span className="wistia_embed wistia_async_zl4za7cf5e popover=true popoverContent=link">
                                <a className="linkWithImage" href={videoTourLink} target="_blank">
                                    <img className="launchTourImage" /><span><I18nMessage message={i18nKey('launchVideoLink')} /></span>
                                </a>
                            </span>
                            <a className="linkWithImage" onClick={this.launchGuideMe}><img className="guideMeImage" /><span><I18nMessage message={i18nKey('guideMeLink')} /></span></a>
                        </div>
                    </div>
                    <div className="mainPanel">
                        <div className="homePanel leftContent">
                            <h4><I18nMessage message={i18nKey('guideTitle')} /></h4>
                            <img className="welcomeGuideImage" />
                            <p><I18nMessage message={i18nKey('guideText')} /></p>
                            <a className="btn btn-primary" href={welcomeGuideLink} target="_blank"><I18nMessage message={i18nKey('guideButton')} /> <small>(.pdf)</small></a>
                        </div>
                        <div className="homePanel rightContent">
                            <h4><I18nMessage message={i18nKey('feedbackTitle')} /></h4>
                            <div className="giveFeedbackImageContainer">
                                <img className="giveFeedbackImage" />
                            </div>
                            <p><I18nMessage message={i18nKey('feedbackText')} /></p>
                            <a className="btn btn-primary btn-feedback" href={feedbackLink} target="_blank"><I18nMessage message={i18nKey('feedbackButton')} /></a>
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
                                    <p className="supportEmailText">
                                        <I18nMessage message={i18nKey('helpLinkPreText')} />
                                        <a href={SUPPORT_LINK} target="_blank">
                                            <I18nMessage message={i18nKey('helpLinkText')} />
                                        </a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default AppHomePage;
