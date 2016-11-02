import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';
import UrlFileAttachmentReportLinkFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';

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
    getRealmId(url) {
        if (!url) {
            return null;
        }

        // Return the first part of the subdomain (which is the realm id)
        return url.split('//')[1].split('.')[0];
    },
    getQuickBaseClassicLink(selectedAppId) {
        let realmId = this.getRealmId(window.location.href);
        let link = `https://${realmId}.quickbase.com/db/`;

        if (selectedAppId) {
            link += selectedAppId;
        } else {
            link += 'main';
        }

        return link;
    }
};

export default UrlUtils;
