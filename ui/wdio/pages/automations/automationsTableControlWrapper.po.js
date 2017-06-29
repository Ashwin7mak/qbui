let QbGridControlWrapper = require('../common/controls/qbGridControlWrapper.po.js');

module.exports = class AutomationsGridControlWrapper extends QbGridControlWrapper {
    get automations() {
        let AutomationRowControlWrapper = require('./automationRowControlWrapper.po.js');
        let rows = this.rows.map(rowControl => new AutomationRowControlWrapper(rowControl.control));
        return rows;
    }
};
