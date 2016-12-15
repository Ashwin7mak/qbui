import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import {NotificationManager} from 'react-notifications';
import UrlUtils from '../../utils/urlUtils';
import {WALKME_ID_FOR_LARGE} from '../../constants/urlConstants';
import * as CompConsts from '../../constants/componentConstants';

import LaunchTourImg from './Launch-tour.png';
import GuideMeImg from './Guide-me.png';
import WelcomeGuideImg from './Welcome-guide.png';
import GiveFeedbackImg from './GiveFeedback.png';
import TipImg from './Tip.png';
import NeedHelpImg from './Need-help.png';

import './appHomePage.scss';

function i18nKey(subkey) {
    return `app.homepage.${subkey}`;
}

const videoTourLink = 'https://quickbase.wistia.com/medias/zl4za7cf5e';
const welcomeGuideLink = 'https://d2qhvajt3imc89.cloudfront.net/customers/QuickBase/MercuryBeta_WelcomeGuide-v1.0.pdf';
const feedbackLink = 'https://quickbase.uservoice.com/forums/378045-mercury';

/**
 * App Home page (displays when no app or table is selected)
 */
const AppHomePage = React.createClass({
    contextTypes: {
        touch: React.PropTypes.bool
    },

    launchGuideMe() {
        try {
            WalkMeAPI.startWalkthruById(WALKME_ID_FOR_LARGE);
        } catch (err) {
            NotificationManager.info(Locale.getMessage('missingWalkMe'), '', CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        }
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
                                    <img src={LaunchTourImg} /><span><I18nMessage message={i18nKey('launchVideoLink')} /></span>
                                </a>
                            </span>
                            {!this.context.touch && <a className="linkWithImage" onClick={this.launchGuideMe}><img src={GuideMeImg} /><span><I18nMessage message={i18nKey('guideMeLink')} /></span></a>}
                        </div>
                    </div>
                    <div className="mainPanel">
                        <div className="homePanel leftContent">
                            <h4><I18nMessage message={i18nKey('guideTitle')} /></h4>
                            <img src={WelcomeGuideImg} />
                            <p><I18nMessage message={i18nKey('guideText')} /></p>
                            <a className="btn btn-primary" href={welcomeGuideLink} target="_blank"><I18nMessage message={i18nKey('guideButton')} /> <small>(.pdf)</small></a>
                        </div>
                        <div className="homePanel rightContent">
                            <h4><I18nMessage message={i18nKey('feedbackTitle')} /></h4>
                            <div className="giveFeedbackImageContainer">
                                <img src={GiveFeedbackImg} />
                            </div>
                            <p><I18nMessage message={i18nKey('feedbackText')} /></p>
                            <a className="btn btn-primary btn-feedback" href={feedbackLink} target="_blank"><I18nMessage message={i18nKey('feedbackButton')} /></a>
                        </div>
                    </div>
                    <div className="bottomPanel">
                        <div className="homePanel bottomSubPanel leftBottomPanel">
                            <div className="homePageTipImageContainer">
                                <img src={TipImg} />
                            </div>
                            <div className="leftBottomPanelContent">
                                <h4><I18nMessage message={i18nKey('tipTitle')} /></h4>
                                <p><I18nMessage message={i18nKey('tipText')} /></p>
                            </div>
                        </div>
                        <div className="homePanel bottomSubPanel rightBottomPanel">
                            <img src={NeedHelpImg} />
                            <div className="rightBottomPanelContent">
                                <h4><I18nMessage message={i18nKey('helpTitle')} /></h4>
                                <p><I18nMessage message={i18nKey('helpText')} /></p>
                                <div className="supportEmail">
                                    <p className="supportEmailText">
                                        <I18nMessage message={i18nKey('helpLinkPreText')} />
                                        <a href={UrlUtils.getSupportLink()} target="_blank">
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
