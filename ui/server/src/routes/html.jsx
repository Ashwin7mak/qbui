import React, {PropTypes} from "react";
import _ from "lodash";

import favicons from '../constants/favicons';

var Html = React.createClass({
    propTypes: {
        title: PropTypes.string,
        lang: PropTypes.string,
        jsPath: PropTypes.string,
        hostBase: PropTypes.string,
        isClientPerfTrackingEnabled: PropTypes.bool
    },
    renderNodeConfig() {
        return `
            var nodeConfig = {
                isClientPerfTrackingEnabled : ${this.props.isClientPerfTrackingEnabled || false},
                lang :  "${this.props.lang}"
            };
        `;
    },
    renderPerfList() {
        let components = [];
        let nodeConfig = this.renderNodeConfig();

        if (this.props.isClientPerfTrackingEnabled) {
            let scriptKey = 1;
            let initialUrl = _.has(this.props, 'req.url') ? this.props.req.url : 'undefined';
            components.push(<script key={"s" + scriptKey++}  dangerouslySetInnerHTML={{__html:`
                var userInfo = {};
                userInfo.url = "${initialUrl}";
                ${nodeConfig}

                var EPISODES = EPISODES || {};
                EPISODES.q = [];    // command queue
                EPISODES.mark = function(mn, mt) { EPISODES.q.push( ["mark", mn, mt || new Date().getTime()] ); };
                EPISODES.measure = function(en, st, en) { EPISODES.q.push( ["measure", en, st, en || new Date().getTime()] ); };
                EPISODES.run = function(fn, context, params) { EPISODES.q.push( ["run", fn, context, params] ); };

                EPISODES.bSendBeacon = 1;         // 1 == beacon back the resulting metrics
                EPISODES.beaconUrl = '/api/n/v1/clientPerf';  // URL to use for the metrics beacon
                EPISODES.beaconType = 'POST';  // URL to use for the metrics beacon
                EPISODES.bPostMessage = false; // no iframes to notify
                EPISODES.autorun = false; // done will be called after all routes rendering is done
                EPISODES.bResourceTimingAgg = false; // no Resource Timing aggregate (only loads a js)
                EPISODES.mark("firstbyte");
            `}} ></script>);
            components.push(<script key={"s" + scriptKey++} async="async" defer="defer" src="/vendor/episodes.js"></script>);

        } else {
            components.push(<script key="s1"  dangerouslySetInnerHTML={{__html:`
                ${nodeConfig}
            `}} ></script>);
        }
        return components;
    },

    renderFavicons() {
        // This an array to get around JSX requirement that sibling elements must be wrapped in a parent component
        return [
            <link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href={favicons.appleTouch} />,
            <link key="small-icon" rel="icon" type="image/png" href={favicons.smallIcon} sizes="16x16" />,
            <link key="large-icon" rel="icon" type="image/png" href={favicons.largeIcon} sizes="32x32" />,
            <link key="android-manifest" rel="manifest" href={favicons.androidConfig} />,
            <link key="safari-mask" rel="mask-icon" href={favicons.safariMaskIcon} color="#5bbad5" />,
            <link key="favicon" rel="shortcut icon" href={favicons.ico} />,
            <meta key="microsoft-config" name="msapplication-config" content={favicons.microsoftConfig} />,
            <meta key="icon-theme-color" name="theme-color" content={favicons.themeColor} />,
        ];
    },

    render() {
        return (
            <html lang={this.props.lang}>
                <head>
                    <meta charSet="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <link rel="stylesheet" type="text/css" href="/qbase/css/loadingScreen.css" />
                    {this.renderPerfList()}

                        <title>{this.props.title}</title>

                        {this.renderFavicons()}

                        {this.props.styleTagStringContent ? (
                                <style type="text/css">
                                    {this.props.styleTagStringContent}
                                </style>
                        ) : (
                                null)
                        }
                </head>
                <body>
                    {this.props.children}
                </body>
            </html>
        );
    }
});

module.exports = Html;
