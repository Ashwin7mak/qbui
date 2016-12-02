/**
 * Constants for the User object. Primarily comprised of the expected keys
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        ID                  : 'id',
        FIRST               : 'firstName',
        LAST                : 'lastName',
        SCREEN_NAME         : 'screenName',
        EMAIL               : 'email',
        DEACTIVATED         : 'deactivated',
        ANONYMOUS           : 'anonymous',
        ADMINISTRATOR       : 'administrator',
        CHALLENGE_QUESTION  : 'challengeQuestion',
        CHALLENGE_ANSWER    : 'challengeAnswer',
        PASSWORD            : 'password',
        TICKET_VERSION      : 'ticketVersion',
        DEFAULT_ID          : 1000000,
        DEFAULT_TICKET_VERSION: 8
    });
}());
