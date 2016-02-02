/**
 * Created by skamineni on 1/21/16.
 */

var poPages = function () {
    global.e2eBase = requireCommon('common/e2eBase')();
    global.consts = require('../../server/api/constants');
    global.e2eConsts = requireCommon('common/e2eConsts');

    //Load the page Objects
    global.ReportServicePage = requirePO('qbapp/reports/reportService');
    global.requestAppsPage = requirePO('qbapp/reports/requestApps');
    global.requestSessionTicketPage = requirePO('qbapp/reports/requestSessionTicket');

}

module.exports = poPages;