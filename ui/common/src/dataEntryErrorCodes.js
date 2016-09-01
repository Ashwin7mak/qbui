
/*
 * This module contains the error codes shared between server/node and node/client when changing/setting
 * data in an application database
 * The client code send by node to the client is expected to be interpreted by the client and acted upon appropriately.
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        // data entry error codes (see QuickBaseTrunk/src/SBfield.h deErr_t)
        //NO_ERROR                  : 0,
        //REQUIRED_FIELD_MISSING    : 1, //No value was supplied for the required field
        //REQUIRED_FIELD_NO_ACCESS  : 2,
        REQUIRED_FIELD_EMPTY      : 3, //A blank value was supplied for the required field
        //FILE_UPLOAD_LIMIT         : 4,
        MAX_LEN_EXCEEDED          : 5, //Cannot place more than x in field
        // INVALID_NUMBER            : 6,
        // DOC_RESERVED              : 7,
        // INVALID_CHOICE            : 8,
        // INVALID_USER              : 9,
        // READ_ONLY                 : 10,
        // DUPLICATE                 : 11,
        // DUPLICATE_BY_DEFAULT      : 12,
        // DUPLICATE_BY_FORMULA      : 13,
        // DUPLICATE_NOT_EVALUATED   : 14,
        // OVER_LIMIT                : 15,
        // MISSING_FIELD             : 16,
        // NO_ACCESS_TO_FIELD        : 17,
        // UNSUPPORTED               : 18,
        // INVALID_ENTRY             : 19,
        // EDIT_CONFLICT             : 20,
        // FILE_ERROR                : 21,
        // PREDECESSOR_LOOP          : 22,
        // REC_ID_FAILED             : 23,
        // STORAGE_ENTITLEMENT_LIMIT : 24,
        // TOO_MANY_ENTRIES          : 25,
        // FORM_RULE_ABORT_SAVE      : 26,
        // INVALID_CURRENCY          : 27,
        // INVALID_TOD               : 28  //invalid time of day
    });
}());
