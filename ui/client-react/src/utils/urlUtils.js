import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import BaseService from '../services/baseService';
import {SUPPORT_LINK_PATH} from '../constants/urlConstants';

let baseService = new BaseService();

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
                <QBicon icon={UrlUtils.getIconForProtocol(protocol)} />
            );
        } else {
            return <span />;
        }
    },
    getQuickBaseClassicLink(selectedAppId) {
        let realmId = baseService.getSubdomain();
        let domain = baseService.getDomain();
        let link = `https://${realmId}.${domain}/db/`;

        if (selectedAppId) {
            link += selectedAppId;
        } else {
            link += 'main';
        }

        return link;
    },
    getSupportLink() {
        return `https://${baseService.getSubdomain()}.${baseService.getDomain()}${SUPPORT_LINK_PATH}`;
    },
};

export default UrlUtils;
