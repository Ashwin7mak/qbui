(function() {
    'use strict';

    var cookie = require('../constants/cookie');

    module.exports = {
        /**  final String ticket = this.currentTicketVersion + "_" + ob32When + "_" + ob32UserID + "_" + ob32RealmID + "_" + ob32UserTicketVersion + "_" + digest;
         * A ticket is made up of 6 sections
         * 0) current ticket version
         * 1) ob32 encoded time in milliseconds when ticket expires
         * 2) ob32 encoded userId
         * 3) ob32 encoded realmId
         * 4) ob32 encoded user Ticket Version
         * 5) sha256 digest value (refer to createTicket in QBTicket.java for more information)
         *
         * @param fullTicket: the complete ticket as stored in the req.headers object
         * @param section: the section of the ticket you want to return
         * @returns {*}
         */
        breakTicketDown: function(fullTicket, section) {
            var ticket = fullTicket.replace(cookie.TICKET + "=", "");
            var ticketSections = ticket.split("_");
            return ticketSections[section];
        }
    };

}());
