import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import WindowLocationUtils from '../utils/windowLocationUtils';
import CommonUrlUtils from '../../../common/src/commonUrlUtils';
import StringUtils from '../utils/stringUtils';

import {SUPPORT_LINK_PATH, REPORT_LINK, CHILD_REPORT_LINK, USERS_ROUTE, BUILDER_ROUTE} from '../constants/urlConstants';

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
     * Build client url link to render a report
     *
     * @param appId
     * @param tblId
     * @param rptId
     * @returns {string}
     */
    getReportLink(appId, tblId, rptId) {
        return StringUtils.format(REPORT_LINK, [appId, tblId, rptId]);
    },

    /**
     * Return URL of route for displaying a child report in the following form:
     *
     *   `/qbase/app/${appId}/table/${tableId}/report/${reportId}?detailKeyFid=${detailKeyFid}&detailKeyValue=${detailKeyValue}`
     *
     * @return {string} URL of route for displaying a child report
     */
    getRelatedChildReportLink(appId, tableId, reportId, detailKeyFid, detailKeyValue) {
        return StringUtils.format(CHILD_REPORT_LINK, [...arguments]);
    },

    /**
     * Build client url link to app users management page
     *
     * @param appId
     * @returns {string}
     */
    getAppUsersLink(appId) {
        return StringUtils.format(USERS_ROUTE, [appId]);
    },

    /**
     * get link to navigate to after a new table has been created
     * @param appId
     * @param tblId
     */
    getAfterTableCreatedLink(appId, tblId) {
        return `${BUILDER_ROUTE}/app/${appId}/table/${tblId}/form/1?tc`;
    }
};

export default UrlUtils;
