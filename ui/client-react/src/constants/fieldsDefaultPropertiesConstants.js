const serverTypeConsts = require('../../../common/src/constants');

(function() {
    'use strict';
    module.exports = Object.freeze({
        DEFAULT_TEXT_FIELD: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": serverTypeConsts.CHECKBOX
            },
            "name": "undefined"
        },

        DEFAULT_NUMERIC_FIELD: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": serverTypeConsts.NUMERIC
            },
            "name": "undefined"
        },

        DEFAULT_CHECKBOX_FIELD: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": serverTypeConsts.CHECKBOX
            },
            "name": "undefined"
        },

        DEFAULT_FIELD: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": serverTypeConsts.TEXT,
                "htmlAllowed": false
            },
            "name": "Text",
            "builtIn": false,
            "dataIsCopyable": true,
            "includeInQuickSearch": true,
            "userEditableValue": true,
            "required": false,
            "unique": false,
            "indexed": false,
            "multiChoiceSourceAllowed": false
        }
    })
}());
