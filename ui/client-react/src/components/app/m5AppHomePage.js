import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';

import './appHomePage.scss';

const supportEmail = 'betaprogram@quickbase.com';
function i18nKey(subkey) {
    return `app.homepage.${subkey}`;
}

const M5AppHomePage = React.createClass({
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
    }
});

export default M5AppHomePage;
