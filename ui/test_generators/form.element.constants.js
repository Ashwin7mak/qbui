/**
 * form.element.constants.js holds all constants associated with form element
 * Created by xj on 9/6/16.
 */
(function() {
    'use strict';

    //These are constants common to all form elements
    module.exports = Object.freeze({
        //Form element property names common to all elements
        elementKeys         : {
            ORDER_INDEX             : 'orderIndex',
            USE_ALT_LAB             : 'useAlternateLabel',
            READ_ONLY               : 'readOnly',
            REQUIRED                : 'required',
            FIELD_ID                : 'fieldId',
            POSITION_SAME_ROW       : 'positionSameRow',
            DISPLAY_TEXT            : 'displayText',
            LAB_POSITION            : 'labelPosition',
            TYPE                    : 'type',
            DISPLAY_OPTIONS         : 'displayOptions',
        },
    });
}());
