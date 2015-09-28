/**
 * This file uses the Page Object pattern to define the requestReport page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function() {
    'use strict';

    var RequestSessionTicketPage = function() {
        this.get = function(sessionTicketRequest) {
            //This is a Non-Angular page, need to set this otherwise Protractor will wait forever for Angular to load
            browser.ignoreSynchronization = true;
            browser.get(sessionTicketRequest);
            browser.ignoreSynchronization = false;
        };
    };

    module.exports = new RequestSessionTicketPage();
}());