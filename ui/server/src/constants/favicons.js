(function() {
    'use strict';

    // Different types of favicons generated with https://realfavicongenerator.net/
    const faviconPath = '/qbase/favicons';

    module.exports = Object.freeze({
        ico: `${faviconPath}/favicon.ico`,
        appleTouch: `${faviconPath}/apple-touch-icon.png`,
        smallIcon: `${faviconPath}/favicon-16x16.png`,
        largeIcon: `${faviconPath}/favicon-32x32.png`,
        safariMaskIcon: `${faviconPath}/safari-pinned-tab.svg`,
        androidConfig: `${faviconPath}/manifest.json`, // contains settings for Android devices (android-chrome-192x192.png, android-chrome-512x512.png)
        microsoftConfig: `${faviconPath}/browserconfig.xml`, // contains settings for tiles on microsoft (mstile-150x150.png)
        themeColor: '#ffffff'
    });
}());
