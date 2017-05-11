/*
 * This module contains formatting request parameter constant values
 */
(function() {
    'use strict';

    module.exports = Object.freeze({
        REQUEST_PARAMETER: {
            FORMAT: 'format',
            FACET_EXPRESSION: 'facetexpression',
            SORT_LIST: 'sortList',
            LIST_DELIMITER: '.',
            GROUP_DELIMITER: ':',
            QUERY: 'query',
            COLUMNS: 'columns',
            OFFSET: 'offset',
            NUM_ROWS: 'numRows',
            HOME_PAGE_ID: 'homePageId',
            OPEN_IN_V3: 'openInV3',
            HYDRATE: 'hydrate',
            META_DATA: {
                WITH_REPORT_DEFAULTS: 'withReportDefaults'
            },
            REALM_ID: 'realmId',
            USER_ID: 'userId',
            //  legacy stack request paameters
            LEGACY_STACK: {
                ACTION: 'a',
                VALUE: 'value'
            },
            TABLE: {
                NAME: 'name',
                ICON: 'tableIcon',
                RECORD_NAME: 'tableNoun',
                DESC: 'description'
            },
            FIELD: {
                NAME: 'name',
                TYPE: 'type',
                DATA_TYPE_ATTRS: 'datatypeAttributes',
                REQUIRED: 'required',
                UNIQUE: 'unique'
            },
            REPORT: {
                NAME: 'name',
                TYPE: 'type',
                SORT_LIST: 'sortList',
                SORT: {
                    FIELD_ID: 'fieldId',
                    SORT_ORDER: 'sortOrder',
                    GROUP_TYPE: 'groupType'
                }
            },
            FORM: {
                NAME: 'name',
                TABS: 'tabs',
                ORDER_IDX: 'orderIndex',
                SECTIONS: 'sections',
                PSEUDO: 'pseudo',
                ELEMENTS: 'elements',
                FORM_FIELD_EL: 'FormFieldElement',
                TYPE: 'type',
                SHOW_AS_RADIO: 'showAsRadio'
            }
        }
    });
}());
