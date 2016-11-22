import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import BaseService from '../services/baseService';

let baseService = new BaseService();

const UrlUtils = {
    getIconForProtocol(protocol) {
        switch (protocol) {
        case 'tel':
        case 'callto':
        case 'skype':
            debugger;
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
        console.log('QBIcon', UrlUtils.getIconForProtocol(protocol));
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
};

export default UrlUtils;
