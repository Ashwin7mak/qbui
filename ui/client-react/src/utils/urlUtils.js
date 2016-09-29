import React from 'react';
import QBicon from '../components/qbIcon/qbIcon.js';

const UrlUtils = {
    getProtocolFromUrl(url) {
        return url.split(':')[0];
    },
    getIconForProtocol(protocol) {
        switch(protocol) {
            case 'tel':
            case 'callto':
            case 'skype':
                return 'phone-outline';
            case 'mailto':
                return 'mail';
            case 'sms':
            case 'imessage':
                return 'speechbubble-outline';
            case 'file':
                return 'report-summary';
            default:
                return '';
        }
    },
    renderIconForUrl(url) {
        let protocol = UrlUtils.getProtocolFromUrl(url);

        if(protocol && protocol !== '') {
            return (
                <QBicon icon={UrlUtils.getIconForProtocol(protocol)} />
            );
        } else {
            return <span />;
        }
    }
};

export default UrlUtils;
