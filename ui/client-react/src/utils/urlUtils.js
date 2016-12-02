import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import WindowLocationUtils from '../utils/windowLocationUtils';
import CommonUrlUtils from '../../../common/src/commonUrlUtils';

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
};

export default UrlUtils;
