let ElementControlWrapper = require('../common/controls/elementControlWrapper.po');

module.exports = class EmailBodyElementWrapper extends ElementControlWrapper {
    constructor(selector) {
        super(selector);
    }

    set text(text) {
        if (browser.desiredCapabilities.browserName === 'MicrosoftEdge') {
            super.setTextInTextArea(text, 0);
        } else {
            super.text = text;
        }
    }

    get text() {
        return super.text;
    }
};
