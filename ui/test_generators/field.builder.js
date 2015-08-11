/**
 * Here are all of the functions useful in building a field.
 * They are structured using the builder pattern
 * Created by cschneider1 on 5/31/15.
 */
(function() {
    var fieldConstants = require('./field.constants');

    //These are constants common to all fields
    module.exports = {

        builder: function() {
            var fieldUnderConstruction = {};

            return {
                build: function() {
                    return fieldUnderConstruction;
                },

                /************************************************************/
                /*                      Field Properties                    */
                /************************************************************/

                withId: function(id) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.ID] = id;
                    return this;
                },

                withName: function(name) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.NAME] = name;
                    return this;
                },

                withFieldType: function(type) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.TYPE] = type;
                    return this;
                },

                withDataTypeAttributes: function(datatypeAttributes) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.DATA_TYPE_ATTRIBUTES] = datatypeAttributes;
                    return this;
                },

                withTableId: function(tableId) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.TABLE_ID] = tableId;
                    return this;
                },

                withBuiltIn: function(isBuiltIn) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.BUILT_IN] = isBuiltIn;
                    return this;
                },

                withDataIsCopyable: function(isDataCopyable) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.DATA_IS_COPYABLE] = isDataCopyable;
                    return this;
                },

                withIncludeInQuickSearch: function(includeInQuickSearch) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.INCLUDE_IN_QUICKSEARCH] = includeInQuickSearch;
                    return this;
                },

                withClientSideAttributes: function(clientSideAttributes) {
                    fieldUnderConstruction[fieldConstants.fieldKeys.CLIENT_SIDE_ATTRIBUTES] = clientSideAttributes;
                    return this;
                },

                /************************************************************/
                /*               Formula Field Properties                   */
                /************************************************************/

                withFormula: function(formula, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].FORMULA] = formula;
                    return this;
                },

                /************************************************************/
                /*               Virtual Field Properties                   */
                /************************************************************/
                withRelationshipId: function(relationshipId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].RELATIONSHIP_ID] = relationshipId;
                    return this;
                },

                withReferenceFieldId: function(referenceFieldId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].REFERENCE_FIELD_ID] = referenceFieldId;
                    return this;
                },

                /************************************************************/
                /*               Concrete Field Properties                  */
                /************************************************************/

                withUserEditable: function(isUserEditable, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].USER_EDITABLE_VALUE] = isUserEditable;
                    return this;
                },

                withRequired: function(isRequired, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].REQUIRED] = isRequired;
                    return this;
                },

                /************************************************************/
                /*               Scalar Field Properties                    */
                /************************************************************/

                withUnique: function(isUnique, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].UNIQUE] = isUnique;
                    return this;
                },

                withIndexed: function(isIndexed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].INDEXED] = isIndexed;
                    return this;
                },

                withKeyField: function(isKeyField, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].KEY_FIELD] = isKeyField;
                    return this;
                },

                withForeignKey: function(isForeignKey, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].FOREIGN_KEY] = isForeignKey;
                    return this;
                },

                withProxyFieldId: function(proxyFieldId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].PROXY_FIELD_ID] = proxyFieldId;
                    return this;
                },

                withDefaultValue: function(defaultValue, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DEFAULT_VALUE] = defaultValue;
                    return this;
                },

                withMultipleChoice: function(multipleChoice, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].MULTIPLE_CHOICE] = multipleChoice;
                    return this;
                },

                withMultipleChoiceSourceAllowed: function(isMultipleChoiceSourceAllowed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].MULTIPLE_CHOICE_SOURCE_ALLOWED] = isMultipleChoiceSourceAllowed;
                    return this;
                },

                /************************************************************/
                /*               Specific Field Properties                  */
                /************************************************************/

                //REPORT LINK STUFF
                withReportLinkText: function(linkText, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].LINK_TEXT] = linkText;
                    return this;
                },

                withLinkRelationshipId: function(relationshipId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].RELATIONSHIP_ID] = relationshipId;
                    return this;
                },

                withExactMatch: function(exactMatch, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].EXACT_MATCH] = exactMatch;
                    return this;
                },

                withReportDisplayProtocol: function(displayProtocol, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DISPLAY_PROTOCOL] = displayProtocol;
                    return this;
                },

                withMultiChoiceSourceAllowed: function(multiChoiceSourceAllowed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].MULTI_CHOICE_SOURCE_ALLOWED] = multiChoiceSourceAllowed;
                    return this;
                },

                //SUMMARY FIELD STUFF
                withAggregateFunction: function(aggregateFunction, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].AGGREGATE_FUNCTION] = aggregateFunction;
                    return this;
                },

                withSummaryDecimalPlaces: function(decimalPlaces, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DECIMAL_PLACES] = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero: function(treatNullAsZero, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].TREAT_NULL_AS_ZERO] = treatNullAsZero;
                    return this;
                },

                withExpression: function(expression, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].EXPRESSION] = expression;
                    return this;
                }
            };
        }

    };

}());