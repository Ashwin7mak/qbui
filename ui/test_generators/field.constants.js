/**
 * field.constants.js holds all constants associated with field types throughout the entire hierarchy
 * divided by hierarchy
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    'use strict';
    var consts = require('../common/src/constants');


    //These are constants common to all fields
    module.exports = Object.freeze({
        //Field property names common to all fields
        fieldKeys          : {
            ID                    : 'id',
            NAME                  : 'name',
            TYPE                  : 'type',
            TABLE_ID              : 'tableId',
            BUILT_IN              : 'builtIn',
            DATA_IS_COPYABLE      : 'dataIsCopyable',
            INCLUDE_IN_QUICKSEARCH: 'includeInQuickSearch',
            CLIENT_SIDE_ATTRIBUTES: 'clientSideAttributes',
            DATA_TYPE_ATTRIBUTES  : 'datatypeAttributes'
        },
        /******************************************************************/
        /*            FIELD TYPES AVAILABLE FOR USE IN TABLES             */
        /******************************************************************/
        availableFieldTypes: [
            consts.FORMULA,
            consts.REPORT_LINK,
            consts.SUMMARY,
            consts.LOOKUP,
            consts.SCALAR,
            consts.CONCRETE],

        /******************************************************************/
        /*                  FIELD JSON KEYS                               */
        /******************************************************************/
        SCALAR     : {
            fieldKeys: addScalarHierarchy({}),
            types    : addJsonTypeScalarHierarchy({})
        },
        FORMULA    : {
            fieldKeys: addFormulaHierarchy({}),
            types    : addJsonTypeFormulaHierarchy({})
        },
        REPORT_LINK: {
            fieldKeys: addReportLinkHierarchy({}),
            types    : addJsonTypeReportLinkHierarchy({})
        },
        SUMMARY    : {
            fieldKeys: addSummaryHierarchy({}),
            types    : addJsonTypeSummaryHierarchy({})
        },
        LOOKUP     : {
            fieldKeys: addVirtualHierarchy({}),
            types    : addJsonTypeVirtualHierarchy({})
        },
        CONCRETE   : {
            fieldKeys: addConcreteHierarchy({}),
            types    : addJsonTypeConcreteHierarchy({})
        }
    });

    /*******************************************************************************************/
    /*                         IMPOSE FIELD HIERARCHY ON JSON PROPERTIES                       */
    /*******************************************************************************************/
    /**
     * Add all of the common field keys to a map
     */
    function addFieldKeys(mapToModify) {
        mapToModify.ID = 'id';
        mapToModify.NAME = 'name';
        mapToModify.TYPE = 'type';
        mapToModify.TABLE_ID = 'tableId';
        mapToModify.BUILT_IN = 'builtIn';
        mapToModify.DATA_IS_COPYABLE = 'dataIsCopyable';
        mapToModify.INCLUDE_IN_QUICKSEARCH = 'includeInQuickSearch';
    }

    function addFormulaKeys(mapToModify) {
        mapToModify.FORMULA = 'formula';
    }

    function addVirtualKeys(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'relationshipId';
        mapToModify.REFERENCE_FIELD_ID = 'referenceFieldId';
    }

    /**
     * Add all of the concrete field keys to a map
     */
    function addConcreteKeys(mapToModify) {
        addFieldKeys(mapToModify);
        mapToModify.USER_EDITABLE_VALUE = 'userEditableValue';
        mapToModify.REQUIRED = 'required';
    }

    /**
     * Add all of the concrete field keys to a map
     */
    function addScalarKeys(mapToModify) {
        mapToModify.UNIQUE = 'unique';
        mapToModify.INDEXED = 'indexed';
        mapToModify.KEY_FIELD = 'keyField';
        mapToModify.FOREIGN_KEY = 'foreignKey';
        mapToModify.PROXY_FIELD_ID = 'proxyFieldId';
        mapToModify.DEFAULT_VALUE = 'defaultValue';
        mapToModify.MULTIPLE_CHOICE = 'multipleChoice';
        mapToModify.MULTIPLE_CHOICE_SOURCE_ALLOWED = 'multipleChoiceSourceAllowed';
    }

    /**
     * Add all report link specific keys to the map
     * @param mapToModify
     */
    function addReportLinkKeys(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'relationshipId';
        mapToModify.DISPLAY_PROTOCOL = 'displayProtocol';
        mapToModify.LINK_TEXT = 'linkText';
        mapToModify.EXACT_MATCH = 'exactMatch';
        mapToModify.MULTI_CHOICE_SOURCE_ALLOWED = 'multiChoiceSourceAllowed';
    }

    /**
     * Add all summary field specific keys to the map
     * @param mapToModify
     */
    function addSummaryKeys(mapToModify) {
        mapToModify.AGGREGATE_FUNCTION = 'aggregateFunction';
        mapToModify.DECIMAL_PLACES = 'decimalPlaces';
        mapToModify.TREAT_NULL_AS_ZERO = 'treatNullAsZero';
        mapToModify.EXPRESSION = 'expression';
    }

    /**
     * Add field and formula keys to the map
     * @param mapToModify
     */
    function addFormulaHierarchy(mapToModify) {
        addFieldKeys(mapToModify);
        addFormulaKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add field keys and concrete keys to the map
     * @param mapToModify
     */
    function addConcreteHierarchy(mapToModify) {
        addFieldKeys(mapToModify);
        addConcreteKeys(mapToModify);
        return mapToModify;
    }

    /**
     * add the concrete hierarchy and the scalar keys to the map
     * @param mapToModify
     */
    function addScalarHierarchy(mapToModify) {
        addConcreteHierarchy(mapToModify);
        addScalarKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add field keys and virtual field keys to the map
     */
    function addVirtualHierarchy(mapToModify) {
        addFieldKeys(mapToModify);
        addVirtualKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add virtual hierarchy and the summary keys to the map
     * @param mapToModify
     */
    function addSummaryHierarchy(mapToModify) {
        addVirtualHierarchy(mapToModify);
        addSummaryKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add field keys and report link keys to the map
     * @param mapToModify
     */
    function addReportLinkHierarchy(mapToModify) {
        addFieldKeys(mapToModify);
        addReportLinkKeys(mapToModify);
        return mapToModify;
    }

    /*******************************************************************************************/
    /*                         IMPOSE FIELD HIERARCHY ON JSON TYPE MAPPING                       */
    /*******************************************************************************************/
    /**
     * Add all of the common field JsonTypes to a map
     */
    function addFieldJsonTypes(mapToModify) {
        //Field property names
        mapToModify.ID = 'string';
        mapToModify.NAME = 'string';
        mapToModify.TYPE = 'string';
        mapToModify.TABLE_ID = 'string';
        mapToModify.BUILT_IN = 'boolean';
        mapToModify.DATA_IS_COPYABLE = 'boolean';
        mapToModify.INCLUDE_IN_QUICKSEARCH = 'boolean';
        mapToModify.CLIENT_SIDE_ATTRIBUTES = 'object';
    }

    function addFormulaJsonTypes(mapToModify) {
        mapToModify.FORMULA = 'string';
    }

    function addVirtualJsonTypes(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'string';
        mapToModify.REFERENCE_FIELD_ID = 'number';
    }

    /**
     * Add all of the concrete field JsonTypes to a map
     */
    function addConcreteJsonTypes(mapToModify) {
        addFieldJsonTypes(mapToModify);
        mapToModify.USER_EDITABLE_VALUE = 'boolean';
        mapToModify.REQUIRED = 'boolean';
    }

    /**
     * Add all of the concrete field JsonTypes to a map
     */
    function addScalarJsonTypes(mapToModify) {
        mapToModify.UNIQUE = 'boolean';
        mapToModify.INDEXED = 'boolean';
        mapToModify.KEY_FIELD = 'boolean';
        mapToModify.FOREIGN_KEY = 'boolean';
        mapToModify.PROXY_FIELD_ID = 'string';
        mapToModify.DEFAULT_VALUE = 'object';
        mapToModify.MULTIPLE_CHOICE = 'object';
        mapToModify.MULTIPLE_CHOICE_SOURCE_ALLOWED = 'boolean';
    }

    /**
     * Add all report link specific JsonTypes to the map
     * @param mapToModify
     */
    function addReportLinkJsonTypes(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'string';
        mapToModify.DISPLAY_PROTOCOL = 'boolean';
        mapToModify.LINK_TEXT = 'string';
        mapToModify.EXACT_MATCH = 'boolean';
        mapToModify.MULTI_CHOICE_SOURCE_ALLOWED = 'boolean';
    }

    /**
     * Add all summary field specific JsonTypes to the map
     * @param mapToModify
     */
    function addSummaryJsonTypes(mapToModify) {
        mapToModify.AGGREGATE_FUNCTION = 'string';
        mapToModify.DECIMAL_PLACES = 'number';
        mapToModify.TREAT_NULL_AS_ZERO = 'boolean';
        mapToModify.EXPRESSION = 'string';
    }

    /**
     * Add field and formula JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeFormulaHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addFormulaJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add field JsonTypes and concrete JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeConcreteHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addConcreteJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * add the concrete hierarchy and the scalar JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeScalarHierarchy(mapToModify) {
        addJsonTypeConcreteHierarchy(mapToModify);
        addScalarJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add field JsonTypes and virtual field JsonTypes to the map
     */
    function addJsonTypeVirtualHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addVirtualJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add virtual hierarchy and the summary JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeSummaryHierarchy(mapToModify) {
        addJsonTypeVirtualHierarchy(mapToModify);
        addSummaryJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add field JsonTypes and report link JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeReportLinkHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addReportLinkJsonTypes(mapToModify);
        return mapToModify;
    }

}());
