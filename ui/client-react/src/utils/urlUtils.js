import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import WindowLocationUtils from '../utils/windowLocationUtils';
import CommonUrlUtils from '../../../common/src/commonUrlUtils';
import StringUtils from '../utils/stringUtils';

import * as URL from '../constants/urlConstants';

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
        return `https://${CommonUrlUtils.getSubdomain(hostname)}.${CommonUrlUtils.getDomain(hostname)}${URL.SUPPORT_LINK_PATH}`;
    },
    getFeedBackLink() {
        return `https://${URL.FEEDBACK_LINK_PATH}`;
    },
    getReportFeedBackLink() {
        let hostname = WindowLocationUtils.getHostname();
        return `https://${CommonUrlUtils.getSubdomain(hostname)}.${CommonUrlUtils.getDomain(hostname)}${URL.SUPPORT_LINK_PATH}`;
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
        return StringUtils.format(URL.REPORT_LINK, [appId, tblId, rptId]);
    },

    /**
     * Return URL of route for displaying a child report in the following form:
     *
     *   `/qbase/app/${appId}/table/${tableId}/report/${reportId}?detailKeyFid=${detailKeyFid}&detailKeyValue=${detailKeyValue}`
     *
     * @return {string} URL of route for displaying a child report
     */
    getRelatedChildReportLink(appId, tableId, reportId, detailKeyFid, detailKeyValue) {
        return StringUtils.format(URL.CHILD_REPORT_LINK, [...arguments]);
    },

    /**
     * Return URL segment for a record to be displayed in a drawer.
     *
     *   `sr_app_${appId}_table_${tableId}_report_${reportId}_record_${recordId}`
     *
     * @return {string} URL of route for displaying a child report
     */
    getRecordDrawerSegment(appId, tableId, reportId, recordId) {
        return StringUtils.format(URL.DRAWER.RECORD_SEGMENT, [...arguments]);
    },

    /**
     * Return URL segment for a report to be displayed in a drawer.
     *
     *   `sr_report_app_${appId}_table_${tableId}_report_${reportId}_dtFid_${detailKeyFid}_dtVal_${detailKeyValue}`
     *
     * @return {string} URL of route for displaying a report in a drawer
     */
    getReportDrawerSegment(appId, tableId, reportId, detailKeyFid, detailKeyValue) {
        return StringUtils.format(URL.DRAWER.REPORT_SEGMENT, [...arguments]);
    },

    /**
     * Return URL of route for adding a related child in the following form:
     *
     *    `location?${EDIT_RECORD_KEY}=new&${DETAIL_APPID}={detailAppId}${DETAIL_TABLEID}={detailTableId}
     *       ${DETAIL_REPORTID}={detailReportId}${DETAIL_KEY_FID}={detailKeyFid}&${DETAIL_KEY_VALUE}={detailKeyValue}&${EMBEDDED_REPORT}={uniqueEmbeddedReportId}`;
     * @return {string} URL of route for showing new child record
     */
    getAddRelatedChildLink(location, detailAppId, detailTableId, detailReportId, detailKeyFid, detailKeyValue, uniqueEmbeddedReportId) {
        return StringUtils.format(URL.ADD_RELATED_CHILD_LINK, [...arguments]);
    },

    /**
     * Build client url link to app users management page
     *
     * @param appId
     * @returns {string}
     */
    getAppUsersLink(appId) {
        return StringUtils.format(URL.USERS_ROUTE, [appId]);
    },

    /**
     * get link to navigate to after a new table has been created
     * @param appId
     * @param tblId
     */
    getAfterTableCreatedLink(appId, tblId) {
        return `${URL.BUILDER_ROUTE}/app/${appId}/table/${tblId}/form/1`;
    },

    /**
     * Get the link for Table Properties & Settings page
     */
    getTableSettingsLink(appId, tableId) {
        return `${URL.SETTINGS_ROUTE}/app/${appId}/table/${tableId}/properties`;
    },
    /**
     * Get the link for app home page
     */
    getAppHomePageLink(appId) {
        return `${URL.APP_ROUTE}/${appId}`;
    },
    /**
     * Get the link for Automation Settings page
     */
    getAutomationSettingsLink(appId) {
        return `${URL.SETTINGS_ROUTE}/app/${appId}/${URL.AUTOMATION.PATH}`;
    },
    /**
     * Get the link for viewing an Automation
     */
    getAutomationViewLink(appId, automationId) {
        return `${URL.SETTINGS_ROUTE}/app/${appId}/${URL.AUTOMATION.PATH}/${automationId}/${URL.AUTOMATION.VIEW}`;
    }
};

export default UrlUtils;
