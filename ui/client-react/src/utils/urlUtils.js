import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import WindowLocationUtils from '../utils/windowLocationUtils';
import CommonUrlUtils from '../../../common/src/commonUrlUtils';
import {SUPPORT_LINK_PATH} from '../constants/urlConstants';
import constants from '../services/constants';
import StringUtils from '../utils/stringUtils';

const reportLink =  `${constants.BASE_URL.CLIENT}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}`;

const UrlUtils = {
    getIconForProtocol(protocol) {
        switch (protocol) {
        case 'tel':
        case 'callto':
        case 'skype':
            return 'phone-outline';
        case 'mailto':
            return 'mail';
        case 'sms':
        case 'imessage':
            return 'speechbubble-outline';
        default:
            return '';
        }
    },
    renderIconForUrl(url) {
        let protocol = UrlFileAttachmentReportLinkFormatter.getProtocolFromUrl(url);
        if (protocol) {
            return (
                <QBicon icon={this.getIconForProtocol(protocol)} />
            );
        } else {
            return <span />;
        }
    },
    getQuickBaseClassicLink(selectedAppId) {
        let hostname = WindowLocationUtils.getHostname();
        let realmId = CommonUrlUtils.getSubdomain(hostname);
        let domain = CommonUrlUtils.getDomain(hostname);
        let link = `https://${realmId}.${domain}/db/`;

        if (selectedAppId) {
            link += selectedAppId;
        } else {
            link += 'main';
        }

        return link;
    },
    getSupportLink() {
        let hostname = WindowLocationUtils.getHostname();
        return `https://${CommonUrlUtils.getSubdomain(hostname)}.${CommonUrlUtils.getDomain(hostname)}${SUPPORT_LINK_PATH}`;
    },

    /**
     * Build url link to render a client report
     *
     * @param appId
     * @param tblId
     * @param rptId
     * @returns {string}
     */
    getReportLink(appId, tblId, rptId) {
        return StringUtils.format(reportLink, [appId, tblId, rptId]);
    }
};

export default UrlUtils;
