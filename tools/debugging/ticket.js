/**
 * Created by rbeyer on 1/11/17.
 */
let ob32Utils = require('../../ui/server/src/utility/ob32Utils');
var ticket = process.argv[2];
var ticketSections = ticket.split("_");
var ticketOut = {
    0: "ticketVersion: ",
    1: "millisecondsExpiration: ",
    2: "userId: ",
    3: "realmId: ",
    4: "userTicketVersion: ",
    5: "sha256DigestValue: "
};
ticketSections.forEach(function (val, index, array) {
    ticketOut[index] = ticketOut[index] + ob32Utils.decoder(val);
});
console.log(ticketOut);