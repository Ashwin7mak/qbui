/**
 * form.constants.js holds all constants associated with form element
 * Created by xj on 9/1/16.
 */
(function() {
    'use strict';

    //These are constants common to all fields
    module.exports = Object.freeze({
        //Form property names common to all fields
        formKeys            : {
            TABLE_ID                : 'tableId',
            APP_ID                  : 'appId',
            FORM_NAME               : 'name',
            FORM_DESC               : 'description',
            FORM_WRAP               : 'wrapLabel',
            FORM_INC_BUILDIN        : 'includeBuiltIns',
            FORM_WRAP_ELMNT         : 'wrapElements',
            FORM_NEW_FIELD_ACTION   : 'newFieldAction',
            FORM_TABS               : 'tabs',
        },
        FORM_KEY                    : 'form',
    });
}());
