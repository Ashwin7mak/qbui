(function() {
    'use strict';
    var ob32utils = require('./ob32Utils');

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
         * NOTE: Currently old stack userids are numeric while new stack creates userids are alphanumeric with an underscore in the middle which look like RHVCGZ_UB.
         * The old stack userids are ob32encoded in the ticket while new stack userids are not.
         * As of 03/2017 the plan is to use old stack only for all users but this service is not available. In the meantime the tests create and use users from new stack
         * This method supports both kinds of userid formats.
         *
         * @param ticket: the ticket cookie value
         * @param section: the section of the ticket you want to return
         * @returns {*}
         */
        breakTicketDown: function(ticket, section) {
            if (!ticket) {
                return null;
            }
            if (typeof section === 'string') {
                section = parseInt(section);
            }
            var ticketSections = ticket.split("_");
            if (ticketSections.length > 6) {
                //the userId must contain an underscore
                if (section > 2) {
                    return ticketSections[section + 1];
                } else if (section === 2) {
                    return ticketSections[section] + '_' + ticketSections[section + 1];
                } else {
                    return ticketSections[section];
                }
            }
            return ticketSections[section];
        },
        getUserId: function(ticket) {
            if (!ticket) {
                return null;
            }
            let userId = this.breakTicketDown(ticket, 2);
            if (userId.indexOf('_') === -1) {
                //its an numeric so we need to decode it
                userId = ob32utils.decoder(userId);
            }
            return userId;
        }
    };
}());
