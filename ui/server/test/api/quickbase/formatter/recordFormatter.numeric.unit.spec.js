'use strict';

var recordFormatter = require('../../../../src/api/quickbase/formatter/recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for Numeric field formatting
 */
describe('Numeric record formatter unit test', function() {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for numeric field
     */
    //jshint maxstatements:false
    function provider() {
        var numberDecimalOnly = 0.74765432;
        var numberDouble = 98765432100.74765;
        var numberNoSeparator = 99;
        var numberMultipleSeparators = 98765432100;

        //  test various scientific notation formats.
        //  NOTE: because QuickBase has few rules, tests include
        //  values outside of the universally accepted rules on format..
        var numberExponentNoSeparator = '10E4';
        var numberExponent = '4.874915326E7';
        var numberExponentLarge = '1.23456789E50';
        var numberExponentLarge2 = '10E50';
        var numberExponentNegative = '-4.241461458786777E21';
        var numberExponentNegative2 = '-42414.61458786777E-2';
        var numberExponentFraction = '4.874915326E-2';
        var numberExponentFractionLarge = '487.4915326e-20';

        //Incomplete number
        var defaultRecordInput = [[{
            id   : 7,
            value: numberDouble
        }]];
        var defaultRecordExp = [[{
            id     : 7,
            value  : numberDouble,
            display: ''
        }]];

        // Setup the record inputs
        var recordInputDecimalOnly = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputDecimalOnly[0][0].value = numberDecimalOnly;
        var recordInputDouble = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputDouble[0][0].value = numberDouble;
        var recordInputNoSeparator = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputNoSeparator[0][0].value = numberNoSeparator;
        var recordInputMultipleSeparators = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputMultipleSeparators[0][0].value = numberMultipleSeparators;

        var recordInputExDouble = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExDouble[0][0].value = numberExponentNoSeparator;

        var recordInputExDoubleSeparators = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExDoubleSeparators[0][0].value = numberExponent;

        var recordInputExDoubleFraction = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExDoubleFraction[0][0].value = numberExponentFraction;

        var recordInputExDoubleFractionLarge = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExDoubleFractionLarge[0][0].value = numberExponentFractionLarge;

        var recordInputExDoubleNegative2 = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExDoubleNegative2[0][0].value = numberExponentNegative2;

        var recordInputExDoubleNegative = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExDoubleNegative[0][0].value = numberExponentNegative;

        var recordInputExLarge = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExLarge[0][0].value = numberExponentLarge;

        var recordInputExLarge2 = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputExLarge2[0][0].value = numberExponentLarge2;

        /**
         * FieldInfo and expectations for no flags
         */
        var noFlagsFieldInfo = [{
            id                : 7,
            name              : 'numeric',
            datatypeAttributes: {
                type                : 'NUMERIC',
                clientSideAttributes: {}
            },
            type              : 'SCALAR'
        }];

        var expectedDecimal_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_NoFlags[0][0].value = numberDecimalOnly;
        expectedDecimal_NoFlags[0][0].display = '0.74765432';

        var expectedDecimal_ScientificNotation = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation[0][0].value = numberExponentNoSeparator;
        expectedDecimal_ScientificNotation[0][0].display = '100000';

        var expectedDecimal_ScientificNotation_separators = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_separators[0][0].value = numberExponent;
        expectedDecimal_ScientificNotation_separators[0][0].display = '48749153.26';

        var expectedDecimal_ScientificNotation_fraction = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_fraction[0][0].value = numberExponentFraction;
        expectedDecimal_ScientificNotation_fraction[0][0].display = '0.04874915326';

        var expectedDecimal_ScientificNotation_fractionLarge = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_fractionLarge[0][0].value = numberExponentFractionLarge;
        expectedDecimal_ScientificNotation_fractionLarge[0][0].display = '0.000000000000000004874915326';

        var expectedDecimal_ScientificNotation_negative = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_negative[0][0].value = numberExponentNegative;
        expectedDecimal_ScientificNotation_negative[0][0].display = '-4241461458786777000000';

        var expectedDecimal_ScientificNotation_negative2 = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_negative2[0][0].value = numberExponentNegative2;
        expectedDecimal_ScientificNotation_negative2[0][0].display = '-424.1461458786777';

        var expectedDecimal_ScientificNotation_large = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_large[0][0].value = numberExponentLarge;
        expectedDecimal_ScientificNotation_large[0][0].display = '123456789000000000000000000000000000000000000000000';

        var expectedDecimal_ScientificNotation_large2 = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_ScientificNotation_large2[0][0].value = numberExponentLarge2;
        expectedDecimal_ScientificNotation_large2[0][0].display = '1000000000000000000000000000000000000000000000000000';

        // No flags - double number
        var expectedDouble_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDouble_NoFlags[0][0].value = numberDouble;
        expectedDouble_NoFlags[0][0].display = '98765432100.74765';

        // No flags - no separator
        var expectedNoSeparator_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedNoSeparator_NoFlags[0][0].value = numberNoSeparator;
        expectedNoSeparator_NoFlags[0][0].display = '99';

        // No flags - multiple separators
        var expectedMultiSeparators_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedMultiSeparators_NoFlags[0][0].value = numberMultipleSeparators;
        expectedMultiSeparators_NoFlags[0][0].display = '98765432100';

        /**
         * FieldInfo and expectations for flag: decimalPlaces
         */
        var dpFlagFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        dpFlagFieldInfo[0].datatypeAttributes.decimalPlaces = 2;

        // Decimal places only flag - decimal only
        var expectedDecimal_DPFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DPFlags[0][0].display = '0.75';

        // Decimal places only flag - double number
        var expectedDouble_DPFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DPFlags[0][0].display = '98765432100.75';

        // Decimal places only flag - no separator
        var expectedNoSeparator_DPFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DPFlags[0][0].display = '99.00';

        // Decimal places only flag - multiple separators
        var expectedMultiSeparators_DPFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DPFlags[0][0].display = '98765432100.00';

        /**
         * FieldInfo and expectations for flag: separator start
         */
        var separatorStartFlagFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        separatorStartFlagFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_start = 5;

        // Separator start only flag - decimal only
        var expectedDecimal_SeparatorStartFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator start only flag - double number
        var expectedDouble_SeparatorStartFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));

        // Separator start only flag - no separator
        var expectedNoSeparator_SeparatorStartFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start only flag - multiple separators
        var expectedMultiSeparators_SeparatorStartFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flag: separator mark
         */
        var separatorMarkFlagFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        separatorMarkFlagFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';

        // Separator mark only flag - decimal only
        var expectedDecimal_SeparatorMarkFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator mark only flag - double number
        var expectedDouble_SeparatorMarkFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SeparatorMarkFlags[0][0].display = '98.765.432.100.74765';

        // Separator mark only flag - no separator
        var expectedNoSeparator_SeparatorMarkFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator mark only flag - multiple separators
        var expectedMultiSeparators_SeparatorMarkFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_SeparatorMarkFlags[0][0].display = '98.765.432.100';

        /**
         * FieldInfo and expectations for flag: separator pattern
         */
        var separatorPatternFlagFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        separatorPatternFlagFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';

        // Separator pattern only flag - decimal only
        var expectedDecimal_SeparatorPatternFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator pattern only flag - double number
        var expectedDouble_SeparatorPatternFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));

        // Separator mark pattern flag - no separator
        var expectedNoSeparator_SeparatorPatternFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator mark pattern flag - multiple separators
        var expectedMultiSeparators_SeparatorPatternFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flag: decimal mark
         */
        var decimalMarkFlagFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        decimalMarkFlagFieldInfo[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal mark only flag - decimal only
        var expectedDecimal_DecimalMarkFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DecimalMarkFlags[0][0].display = '0,74765432';

        // Separator mark only flag - double number
        var expectedDouble_DecimalMarkFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DecimalMarkFlags[0][0].display = '98765432100,74765';

        // Separator mark only flag - no separator
        var expectedNoSeparator_DecimalMarkFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator mark only flag - multiple separators
        var expectedMultiSeparators_DecimalMarkFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flag: decimal places and decimal mark
         */
        var fieldInfo_DP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_DM[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, decimal mark - decimal only
        var expectedDecimal_DP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_DM[0][0].display = '0,748';

        // Decimal places, decimal mark - double number
        var expectedDouble_DP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_DM[0][0].display = '98765432100,748';

        // Decimal places, decimal mark - no separator
        var expectedNoSeparator_DP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_DM[0][0].display = '99,000';

        // Decimal places, decimal mark - multiple separators
        var expectedMultiSeparators_DP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_DM[0][0].display = '98765432100,000';

        /**
         * FieldInfo and expectations for flag: decimal places and separator start
         */
        var fieldInfo_DP_SS = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SS[0].datatypeAttributes.clientSideAttributes.separator_start = 3;

        // Decimal places, separator start - decimal only
        var expectedDecimal_DP_SS = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS[0][0].display = '0.748';

        // Decimal places, separator start - double number
        var expectedDouble_DP_SS = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS[0][0].display = '98765432100.748';

        // Decimal places, separator start - no separator
        var expectedNoSeparator_DP_SS = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS[0][0].display = '99.000';

        // Decimal places, separator start - multiple separators
        var expectedMultiSeparators_DP_SS = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS[0][0].display = '98765432100.000';

        /**
         * FieldInfo and expectations for flag: decimal places and separator mark
         */
        var fieldInfo_DP_SM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SM[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';

        // Decimal places, separator mark - decimal only
        var expectedDecimal_DP_SM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SM[0][0].display = '0.748';

        // Decimal places, separator mark - double number
        var expectedDouble_DP_SM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SM[0][0].display = '98.765.432.100.748';

        // Decimal places, separator mark - no separator
        var expectedNoSeparator_DP_SM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SM[0][0].display = '99.000';

        // Decimal places, separator mark - multiple separators
        var expectedMultiSeparators_DP_SM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SM[0][0].display = '98.765.432.100.000';

        /**
         * FieldInfo and expectations for flag: decimal places and separator pattern
         */
        var fieldInfo_DP_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SP[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';

        // Decimal places, separator pattern - decimal only
        var expectedDecimal_DP_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SP[0][0].display = '0.748';

        // Decimal places, separator pattern - double number
        var expectedDouble_DP_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SP[0][0].display = '98765432100.748';

        // Decimal places, separator pattern - no separator
        var expectedNoSeparator_DP_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SP[0][0].display = '99.000';

        // Decimal places, separator pattern - multiple separators
        var expectedMultiSeparators_DP_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SP[0][0].display = '98765432100.000';

        /**
         * FieldInfo and expectations for flag: separator start and separator pattern
         */
        var fieldInfo_SS_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_SP[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        fieldInfo_SS_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';

        // Separator start, separator pattern - decimal only
        var expectedDecimal_SS_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator start, separator pattern - double number
        var expectedDouble_SS_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));

        // Separator start, separator pattern - no separator
        var expectedNoSeparator_SS_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, separator pattern - multiple separators
        var expectedMultiSeparators_SS_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flag: separator start and decimal mark
         */
        var fieldInfo_SS_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        fieldInfo_SS_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Separator start, decimal mark - decimal only
        var expectedDecimal_SS_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_SS_DM[0][0].display = '0,74765432';

        // Separator start, decimal mark - double number
        var expectedDouble_SS_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SS_DM[0][0].display = '98765432100,74765';

        // Separator start, decimal mark - no separator
        var expectedNoSeparator_SS_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, decimal mark - multiple separators
        var expectedMultiSeparators_SS_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flag: decimalMark and separatorMark
         */
        var fieldInfo_DM_SM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DM_SM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';
        fieldInfo_DM_SM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';

        // Decimal mark, separator mark - decimal only
        var expectedDecimal_DM_SM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DM_SM[0][0].display = '0,74765432';

        //  Decimal mark, separator mark - double number
        var expectedDouble_DM_SM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DM_SM[0][0].display = '98.765.432.100,74765';

        //  Decimal mark, separator mark - no separator
        var expectedNoSeparator_DM_SM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DM_SM[0][0].display = '99';

        // Decimal mark, separator mark - multiple separators
        var expectedMultiSeparators_DM_SM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DM_SM[0][0].display = '98.765.432.100';

        /**
         * FieldInfo and expectations for flags: separator start, separator mark
         */
        var fieldInfo_SS_SM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_SM[0].datatypeAttributes.clientSideAttributes.separator_start = 5;
        fieldInfo_SS_SM[0].datatypeAttributes.clientSideAttributes.separator_mark = ',';

        // Separator start, separator mark flags - decimal only
        var expectedDecimal_SS_SM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator start, separator mark flags - double number
        var expectedDouble_SS_SM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SS_SM[0][0].display = '98,765,432,100.74765';

        // Separator start, separator mark flags - no separator
        var expectedNoSeparator_SS_SM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, separator mark flags - multiple separators
        var expectedMultiSeparators_SS_SM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_SS_SM[0][0].display = '98,765,432,100';

        /**
         * FieldInfo and expectations for flags: separator mark, separator pattern
         */
        var fieldInfo_SM_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_mark = ',';
        fieldInfo_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';

        // Separator start, separator mark flags - decimal only
        var expectedDecimal_SM_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator mark, separator pattern flags - double number
        var expectedDouble_SM_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SM_SP[0][0].display = '98,76,54,32,100.74765';

        // Separator mark, separator pattern flags - no separator
        var expectedNoSeparator_SM_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator mark, separator pattern flags - multiple separators
        var expectedMultiSeparators_SM_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_SM_SP[0][0].display = '98,76,54,32,100';

        /**
         * FieldInfo and expectations for flags: separator pattern, decimal mark
         */
        var fieldInfo_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        fieldInfo_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Separator pattern, decimal mark flags - decimal only
        var expectedDecimal_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_SP_DM[0][0].display = '0,74765432';

        // Separator pattern, decimal mark flags - double number
        var expectedDouble_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SP_DM[0][0].display = '98765432100,74765';

        // Separator pattern, decimal mark flags - no separator
        var expectedNoSeparator_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator pattern, decimal mark flags - multiple separators
        var expectedMultiSeparators_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flags: decimal places, separator start, separator mark
         */
        var fieldInfo_DP_SS_SM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS_SM[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SS_SM[0].datatypeAttributes.clientSideAttributes.separator_start = 12;
        fieldInfo_DP_SS_SM[0].datatypeAttributes.clientSideAttributes.separator_mark = ',';

        // Decimal places, separator start, separator mark - decimal only
        var expectedDecimal_DP_SS_SM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS_SM[0][0].display = '0.748';

        // Decimal places, separator start, separator mark - double number
        var expectedDouble_DP_SS_SM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS_SM[0][0].display = '98765432100.748';

        // Decimal places, separator start, separator mark - no separator
        var expectedNoSeparator_DP_SS_SM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS_SM[0][0].display = '99.000';

        // Decimal places, separator start, separator mark - multiple separators
        var expectedMultiSeparators_DP_SS_SM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS_SM[0][0].display = '98765432100.000';

        /**
         * FieldInfo and expectations for flags: decimal places, separator start, separator pattern
         */
        var fieldInfo_DP_SS_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS_SP[0].datatypeAttributes.decimalPlaces = 2;
        fieldInfo_DP_SS_SP[0].datatypeAttributes.clientSideAttributes.separator_start = 1;
        fieldInfo_DP_SS_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';

        // Decimal places, separator start, separator pattern - decimal only
        var expectedDecimal_DP_SS_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS_SP[0][0].display = '0.75';

        // Decimal places, separator start, separator pattern - double number
        var expectedDouble_DP_SS_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS_SP[0][0].display = '98765432100.75';

        // Decimal places, separator start, separator pattern - no separator
        var expectedNoSeparator_DP_SS_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS_SP[0][0].display = '99.00';

        // Decimal places, separator start, separator pattern - multiple separators
        var expectedMultiSeparators_DP_SS_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS_SP[0][0].display = '98765432100.00';

        /**
         * FieldInfo and expectations for flags: decimal places, separator start, decimal mark
         */
        var fieldInfo_DP_SS_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS_DM[0].datatypeAttributes.decimalPlaces = 2;
        fieldInfo_DP_SS_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 1;
        fieldInfo_DP_SS_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, separator start, decimal mark - decimal only
        var expectedDecimal_DP_SS_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS_DM[0][0].display = '0,75';

        // Decimal places, separator start, decimal mark - double number
        var expectedDouble_DP_SS_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS_DM[0][0].display = '98765432100,75';

        // Decimal places, separator start, decimal mark - no separator
        var expectedNoSeparator_DP_SS_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS_DM[0][0].display = '99,00';

        // Decimal places, separator start, decimal mark - multiple separators
        var expectedMultiSeparators_DP_SS_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS_DM[0][0].display = '98765432100,00';

        /**
         * FieldInfo and expectations for flags: decimal places, separator mark, separator pattern
         */
        var fieldInfo_DP_SM_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SM_SP[0].datatypeAttributes.decimalPlaces = 2;
        fieldInfo_DP_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_DP_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'EVERY_THREE';

        // Decimal places, separator mark, separator pattern - decimal only
        var expectedDecimal_DP_SM_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SM_SP[0][0].display = '0.75';

        // Decimal places, separator mark, separator pattern - double number
        var expectedDouble_DP_SM_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SM_SP[0][0].display = '98.765.432.100.75';

        // Decimal places, separator mark, separator pattern - no separator
        var expectedNoSeparator_DP_SM_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SM_SP[0][0].display = '99.00';

        // Decimal places, separator mark, separator pattern - multiple separators
        var expectedMultiSeparators_DP_SM_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SM_SP[0][0].display = '98.765.432.100.00';

        /**
         * FieldInfo and expectations for flags: decimal places, separator mark, decimal mark
         */
        var fieldInfo_DP_SM_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SM_DM[0].datatypeAttributes.decimalPlaces = 2;
        fieldInfo_DP_SM_DM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_DP_SM_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, separator mark, decimal mark - decimal only
        var expectedDecimal_DP_SM_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SM_DM[0][0].display = '0,75';

        // Decimal places, separator mark, decimal mark - double number
        var expectedDouble_DP_SM_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SM_DM[0][0].display = '98.765.432.100,75';

        // Decimal places, separator mark, decimal mark - no separator
        var expectedNoSeparator_DP_SM_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SM_DM[0][0].display = '99,00';

        // Decimal places, separator mark, decimal mark - multiple separators
        var expectedMultiSeparators_DP_SM_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SM_DM[0][0].display = '98.765.432.100,00';

        /**
         * FieldInfo and expectations for flags: decimal places, separator pattern, decimal mark
         */
        var fieldInfo_DP_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SP_DM[0].datatypeAttributes.decimalPlaces = 2;
        fieldInfo_DP_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'EVERY_THREE';
        fieldInfo_DP_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, separator pattern, decimal mark - decimal only
        var expectedDecimal_DP_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SP_DM[0][0].display = '0,75';

        // Decimal places, separator pattern, decimal mark - double number
        var expectedDouble_DP_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SP_DM[0][0].display = '98765432100,75';

        // Decimal places, separator pattern, decimal mark - no separator
        var expectedNoSeparator_DP_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SP_DM[0][0].display = '99,00';

        // Decimal places, separator pattern, decimal mark - multiple separators
        var expectedMultiSeparators_DP_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SP_DM[0][0].display = '98765432100,00';

        /**
         * FieldInfo and expectations for flags: separator start, separator mark, separator pattern
         */
        var fieldInfo_SS_SM_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_start = 12;
        fieldInfo_SS_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_mark = ',';
        fieldInfo_SS_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'EVERY_THREE';

        // Separator start, separator mark, separator pattern - decimal only
        var expectedDecimal_SS_SM_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));

        // Separator start, separator mark, separator pattern - double number
        var expectedDouble_SS_SM_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));

        // Separator start, separator mark, separator pattern - no separator
        var expectedNoSeparator_SS_SM_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, separator mark, separator pattern - multiple separators
        var expectedMultiSeparators_SS_SM_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flags: separator start, separator mark, decimal mark
         */
        var fieldInfo_SS_SM_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_SM_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 1;
        fieldInfo_SS_SM_DM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_SS_SM_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Separator start, separator mark, decimal mark - decimal only
        var expectedDecimal_SS_SM_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_SS_SM_DM[0][0].display = '0,74765432';

        // Separator start, separator mark, decimal mark - double number
        var expectedDouble_SS_SM_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SS_SM_DM[0][0].display = '98.765.432.100,74765';

        // Separator start, separator mark, decimal mark - no separator
        var expectedNoSeparator_SS_SM_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, separator mark, decimal mark - multiple separators
        var expectedMultiSeparators_SS_SM_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_SS_SM_DM[0][0].display = '98.765.432.100';

        /**
         * FieldInfo and expectations for flags: separator start, separator pattern, decimal mark
         */
        var fieldInfo_SS_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 1;
        fieldInfo_SS_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        fieldInfo_SS_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Separator start, separator pattern, decimal mark - decimal only
        var expectedDecimal_SS_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_SS_SP_DM[0][0].display = '0,74765432';

        // Separator start, separator pattern, decimal mark - double number
        var expectedDouble_SS_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SS_SP_DM[0][0].display = '98765432100,74765';

        // Separator start, separator pattern, decimal mark - no separator
        var expectedNoSeparator_SS_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, separator pattern, decimal mark - multiple separators
        var expectedMultiSeparators_SS_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));

        /**
         * FieldInfo and expectations for flags: separator mark, separator pattern, decimal mark
         */
        var fieldInfo_SM_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        fieldInfo_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Separator mark, separator pattern, decimal mark - decimal only
        var expectedDecimal_SM_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_SM_SP_DM[0][0].display = '0,74765432';

        // Separator mark, separator pattern, decimal mark - double number
        var expectedDouble_SM_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SM_SP_DM[0][0].display = '98.76.54.32.100,74765';

        // Separator mark, separator pattern, decimal mark - no separator
        var expectedNoSeparator_SM_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator mark, separator pattern, decimal mark - multiple separators
        var expectedMultiSeparators_SM_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_SM_SP_DM[0][0].display = '98.76.54.32.100';

        /**
         * FieldInfo and expectations for decimal places, separator start, separator mark, separator pattern flags
         */
        var fieldInfo_DP_SS_SM_SP = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS_SM_SP[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SS_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        fieldInfo_DP_SS_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_DP_SS_SM_SP[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';

        // Decimal places, separator start, separator mark, and separator pattern flags - decimal only
        var expectedDecimal_DP_SS_SM_SP = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS_SM_SP[0][0].display = '0.748';

        // Decimal places, separator start, separator mark, and separator pattern flags - double number
        var expectedDouble_DP_SS_SM_SP = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS_SM_SP[0][0].display = '98.76.54.32.100.748';

        // Decimal places, separator start, separator mark, and separator pattern flags - no separator
        var expectedNoSeparator_DP_SS_SM_SP = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS_SM_SP[0][0].display = '99.000';

        // Decimal places, separator start, separator mark, and separator pattern flags - multiple separators
        var expectedMultiSeparators_DP_SS_SM_SP = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS_SM_SP[0][0].display = '98.76.54.32.100.000';

        /**
         * FieldInfo and expectations for decimal places, separator start, separator mark, decimal mark flags
         */
        var fieldInfo_DP_SS_SM_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS_SM_DM[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SS_SM_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        fieldInfo_DP_SS_SM_DM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_DP_SS_SM_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, separator start, separator mark, and decimal mark flags - decimal only
        var expectedDecimal_DP_SS_SM_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS_SM_DM[0][0].display = '0,748';

        // Decimal places, separator start, separator mark, and decimal mark flags - double number
        var expectedDouble_DP_SS_SM_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS_SM_DM[0][0].display = '98.765.432.100,748';

        // Decimal places, separator start, separator mark, and decimal mark flags - no separator
        var expectedNoSeparator_DP_SS_SM_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS_SM_DM[0][0].display = '99,000';

        // Decimal places, separator start, separator mark, and decimal mark flags - multiple separators
        var expectedMultiSeparators_DP_SS_SM_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS_SM_DM[0][0].display = '98.765.432.100,000';

        /**
         * FieldInfo and expectations for decimal places, separator start, separator pattern, decimal mark flags
         */
        var fieldInfo_DP_SS_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SS_SP_DM[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SS_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        fieldInfo_DP_SS_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        fieldInfo_DP_SS_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, separator start, separator pattern, and decimal mark flags - decimal only
        var expectedDecimal_DP_SS_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SS_SP_DM[0][0].display = '0,748';

        // Decimal places, separator start, separator pattern, and decimal mark flags - double number
        var expectedDouble_DP_SS_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SS_SP_DM[0][0].display = '98765432100,748';

        // Decimal places, separator start, separator pattern, and decimal mark flags - no separator
        var expectedNoSeparator_DP_SS_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SS_SP_DM[0][0].display = '99,000';

        // Decimal places, separator start, separator pattern, and decimal mark flags - multiple separators
        var expectedMultiSeparators_DP_SS_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SS_SP_DM[0][0].display = '98765432100,000';


        /**
         * FieldInfo and expectations for decimal places, separator mark, separator pattern, decimal mark flags
         */
        var fieldInfo_DP_SM_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_DP_SM_SP_DM[0].datatypeAttributes.decimalPlaces = 3;
        fieldInfo_DP_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_DP_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        fieldInfo_DP_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Decimal places, separator mark, separator pattern, and decimal mark flags - decimal only
        var expectedDecimal_DP_SM_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_DP_SM_SP_DM[0][0].display = '0,748';

        // Decimal places, separator mark, separator pattern, and decimal mark flags - double number
        var expectedDouble_DP_SM_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_DP_SM_SP_DM[0][0].display = '98.76.54.32.100,748';

        // Decimal places, separator mark, separator pattern, and decimal mark flags - no separator
        var expectedNoSeparator_DP_SM_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_DP_SM_SP_DM[0][0].display = '99,000';

        // Decimal places, separator mark, separator pattern, and decimal mark flags - multiple separators
        var expectedMultiSeparators_DP_SM_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_DP_SM_SP_DM[0][0].display = '98.76.54.32.100,000';

        /**
         * FieldInfo and expectations for separator start, separator mark, separator pattern, decimal mark flags
         */
        var fieldInfo_SS_SM_SP_DM = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        fieldInfo_SS_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        fieldInfo_SS_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        fieldInfo_SS_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        fieldInfo_SS_SM_SP_DM[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // Separator start, separator mark, separator pattern, and decimal mark flags - decimal only
        var expectedDecimal_SS_SM_SP_DM = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_SS_SM_SP_DM[0][0].display = '0,74765432';

        // Separator start, separator mark, separator pattern, and decimal mark flags - double number
        var expectedDouble_SS_SM_SP_DM = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_SS_SM_SP_DM[0][0].display = '98.76.54.32.100,74765';

        // Separator start, separator mark, separator pattern, and decimal mark flags - no separator
        var expectedNoSeparator_SS_SM_SP_DM = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));

        // Separator start, separator mark, separator pattern, and decimal mark flags - multiple separators
        var expectedMultiSeparators_SS_SM_SP_DM = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_SS_SM_SP_DM[0][0].display = '98.76.54.32.100';

        /**
         * FieldInfo and expectations for all flags
         */
        var allFlagsFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        allFlagsFieldInfo[0].datatypeAttributes.decimalPlaces = 1;
        allFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_start = 3;
        allFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_mark = '.';
        allFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'THREE_THEN_TWO';
        allFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.decimal_mark = ',';

        // All flags - decimal only
        var expectedDecimal_AllFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_AllFlags[0][0].display = '0,7';

        // All flags - double number
        var expectedDouble_AllFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_AllFlags[0][0].display = '98.76.54.32.100,7';

        // All flags - no separator
        var expectedNoSeparator_AllFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_AllFlags[0][0].display = '99,0';

        // All flags - multiple separators
        var expectedMultiSeparators_AllFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_AllFlags[0][0].display = '98.76.54.32.100,0';

        /**
         * FieldInfo and expectations for invalid flags - Using invalid flags in the fieldInfo should format the
         * flags using default flag values
         */
        var invalidFlagsFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        invalidFlagsFieldInfo[0].datatypeAttributes.decimalPlaces = -1;
        invalidFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_start = -1;
        invalidFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_mark = 'invalid';
        invalidFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.separator_pattern = 'invalid';
        invalidFlagsFieldInfo[0].datatypeAttributes.clientSideAttributes.decimal_mark = 'invalid';

        // Invalid flags - decimal only
        var expectedDecimal_InvalidFlags = JSON.parse(JSON.stringify(expectedDecimal_NoFlags));
        expectedDecimal_InvalidFlags[0][0].display = numberDecimalOnly;

        // Invalid flags - double number
        var expectedDouble_InvalidFlags = JSON.parse(JSON.stringify(expectedDouble_NoFlags));
        expectedDouble_InvalidFlags[0][0].display = numberDouble;

        // Invalid flags - no separator
        var expectedNoSeparator_InvalidFlags = JSON.parse(JSON.stringify(expectedNoSeparator_NoFlags));
        expectedNoSeparator_InvalidFlags[0][0].display = numberNoSeparator;

        // Invalid flags - multiple separators
        var expectedMultiSeparators_InvalidFlags = JSON.parse(JSON.stringify(expectedMultiSeparators_NoFlags));
        expectedMultiSeparators_InvalidFlags[0][0].display = numberMultipleSeparators;

        var cases = [
            {message: 'Numeric - decimal with no format', records: recordInputDecimalOnly, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_NoFlags},
            {message: 'Numeric - double with no format', records: recordInputDouble, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDouble_NoFlags},
            {message: 'Numeric - no separator with no format', records: recordInputNoSeparator, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedNoSeparator_NoFlags},
            {message: 'Numeric - multiple separators with no format', records: recordInputMultipleSeparators, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedMultiSeparators_NoFlags},

            // 1 flag
            {message: 'Numeric - decimal with decimalPlaces format', records: recordInputDecimalOnly, fieldInfo: dpFlagFieldInfo, expectedRecords: expectedDecimal_DPFlags},
            {message: 'Numeric - double with decimalPlaces format', records: recordInputDouble, fieldInfo: dpFlagFieldInfo, expectedRecords: expectedDouble_DPFlags},
            {message: 'Numeric - no separator with decimalPlaces format', records: recordInputNoSeparator, fieldInfo: dpFlagFieldInfo, expectedRecords: expectedNoSeparator_DPFlags},
            {message: 'Numeric - multiple separators with decimalPlaces format', records: recordInputMultipleSeparators, fieldInfo: dpFlagFieldInfo, expectedRecords: expectedMultiSeparators_DPFlags},

            {message: 'Numeric - decimal with separatorStart format', records: recordInputDecimalOnly, fieldInfo: separatorStartFlagFieldInfo, expectedRecords: expectedDecimal_SeparatorStartFlags},
            {message: 'Numeric - double with separatorStart format', records: recordInputDouble, fieldInfo: separatorStartFlagFieldInfo, expectedRecords: expectedDouble_SeparatorStartFlags},
            {message: 'Numeric - no separator with separatorStart format', records: recordInputNoSeparator, fieldInfo: separatorStartFlagFieldInfo, expectedRecords: expectedNoSeparator_SeparatorStartFlags},
            {message: 'Numeric - multiple separators with separatorStart format', records: recordInputMultipleSeparators, fieldInfo: separatorStartFlagFieldInfo, expectedRecords: expectedMultiSeparators_SeparatorStartFlags},

            {message: 'Numeric - decimal with separatorMark format', records: recordInputDecimalOnly, fieldInfo: separatorMarkFlagFieldInfo, expectedRecords: expectedDecimal_SeparatorMarkFlags},
            {message: 'Numeric - double with separatorMark format', records: recordInputDouble, fieldInfo: separatorMarkFlagFieldInfo, expectedRecords: expectedDouble_SeparatorMarkFlags},
            {message: 'Numeric - no separator with separatorMark format', records: recordInputNoSeparator, fieldInfo: separatorMarkFlagFieldInfo, expectedRecords: expectedNoSeparator_SeparatorMarkFlags},
            {message: 'Numeric - multiple separators with separatorMark format', records: recordInputMultipleSeparators, fieldInfo: separatorMarkFlagFieldInfo, expectedRecords: expectedMultiSeparators_SeparatorMarkFlags},

            {message: 'Numeric - decimal with separatorPattern format', records: recordInputDecimalOnly, fieldInfo: separatorPatternFlagFieldInfo, expectedRecords: expectedDecimal_SeparatorPatternFlags},
            {message: 'Numeric - double with separatorPattern format', records: recordInputDouble, fieldInfo: separatorPatternFlagFieldInfo, expectedRecords: expectedDouble_SeparatorPatternFlags},
            {message: 'Numeric - no separator with separatorPattern format', records: recordInputNoSeparator, fieldInfo: separatorPatternFlagFieldInfo, expectedRecords: expectedNoSeparator_SeparatorPatternFlags},
            {message: 'Numeric - multiple separators with separatorPattern format', records: recordInputMultipleSeparators, fieldInfo: separatorPatternFlagFieldInfo, expectedRecords: expectedMultiSeparators_SeparatorPatternFlags},

            {message: 'Numeric - decimal with decimalMark format', records: recordInputDecimalOnly, fieldInfo: decimalMarkFlagFieldInfo, expectedRecords: expectedDecimal_DecimalMarkFlags},
            {message: 'Numeric - double with decimalMark format', records: recordInputDouble, fieldInfo: decimalMarkFlagFieldInfo, expectedRecords: expectedDouble_DecimalMarkFlags},
            {message: 'Numeric - no separator with decimalMark format', records: recordInputNoSeparator, fieldInfo: decimalMarkFlagFieldInfo, expectedRecords: expectedNoSeparator_DecimalMarkFlags},
            {message: 'Numeric - multiple separators with decimalMark format', records: recordInputMultipleSeparators, fieldInfo: decimalMarkFlagFieldInfo, expectedRecords: expectedMultiSeparators_DecimalMarkFlags},

            // 2 flags
            {message: 'Numeric - decimal with decimalPlaces, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_DM, expectedRecords: expectedDecimal_DP_DM},
            {message: 'Numeric - double with decimalPlaces, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_DM, expectedRecords: expectedDouble_DP_DM},
            {message: 'Numeric - no separator with decimalPlaces, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_DM, expectedRecords: expectedNoSeparator_DP_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_DM, expectedRecords: expectedMultiSeparators_DP_DM},

            {message: 'Numeric - decimal with decimalPlaces, separatorStart formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS, expectedRecords: expectedDecimal_DP_SS},
            {message: 'Numeric - double with decimalPlaces, separatorStart formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS, expectedRecords: expectedDouble_DP_SS},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS, expectedRecords: expectedNoSeparator_DP_SS},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS, expectedRecords: expectedMultiSeparators_DP_SS},

            {message: 'Numeric - decimal with decimalPlaces, separatorMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SM, expectedRecords: expectedDecimal_DP_SM},
            {message: 'Numeric - double with decimalPlaces, separatorMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SM, expectedRecords: expectedDouble_DP_SM},
            {message: 'Numeric - no separator with decimalPlaces, separatorMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SM, expectedRecords: expectedNoSeparator_DP_SM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SM, expectedRecords: expectedMultiSeparators_DP_SM},

            {message: 'Numeric - decimal with decimalPlaces, separatorPattern formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SP, expectedRecords: expectedDecimal_DP_SP},
            {message: 'Numeric - double with decimalPlaces, separatorPattern formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SP, expectedRecords: expectedDouble_DP_SP},
            {message: 'Numeric - no separator with decimalPlaces, separatorPattern formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SP, expectedRecords: expectedNoSeparator_DP_SP},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorPattern formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SP, expectedRecords: expectedMultiSeparators_DP_SP},

            {message: 'Numeric - decimal with separatorStart, separatorPattern formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_SP, expectedRecords: expectedDecimal_SS_SP},
            {message: 'Numeric - double with separatorStart, separatorPattern formats', records: recordInputDouble, fieldInfo: fieldInfo_SS_SP, expectedRecords: expectedDouble_SS_SP},
            {message: 'Numeric - no separator with separatorStart, separatorPattern formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_SP, expectedRecords: expectedNoSeparator_SS_SP},
            {message: 'Numeric - multiple separators with separatorStart, separatorPattern formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_SP, expectedRecords: expectedMultiSeparators_SS_SP},

            {message: 'Numeric - decimal with separatorStart, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_DM, expectedRecords: expectedDecimal_SS_DM},
            {message: 'Numeric - double with separatorStart, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_SS_DM, expectedRecords: expectedDouble_SS_DM},
            {message: 'Numeric - no separator with separatorStart, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_DM, expectedRecords: expectedNoSeparator_SS_DM},
            {message: 'Numeric - multiple separators with separatorStart, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_DM, expectedRecords: expectedMultiSeparators_SS_DM},

            {message: 'Numeric - decimal with decimalMark, separatorMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DM_SM, expectedRecords: expectedDecimal_DM_SM},
            {message: 'Numeric - double with decimalMark, separatorMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DM_SM, expectedRecords: expectedDouble_DM_SM},
            {message: 'Numeric - no separator with decimalMark, separatorMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DM_SM, expectedRecords: expectedNoSeparator_DM_SM},
            {message: 'Numeric - multiple separators with decimalMark, separatorMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DM_SM, expectedRecords: expectedMultiSeparators_DM_SM},

            {message: 'Numeric - decimal with separatorStart, separatorMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_SM, expectedRecords: expectedDecimal_SS_SM},
            {message: 'Numeric - double with separatorStart, separatorMark formats', records: recordInputDouble, fieldInfo: fieldInfo_SS_SM, expectedRecords: expectedDouble_SS_SM},
            {message: 'Numeric - no separator with separatorStart, separatorMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_SM, expectedRecords: expectedNoSeparator_SS_SM},
            {message: 'Numeric - multiple separators with separatorStart, separatorMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_SM, expectedRecords: expectedMultiSeparators_SS_SM},

            {message: 'Numeric - decimal with separatorMark, separatorPattern formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SM_SP, expectedRecords: expectedDecimal_SM_SP},
            {message: 'Numeric - double with separatorMark, separatorPattern formats', records: recordInputDouble, fieldInfo: fieldInfo_SM_SP, expectedRecords: expectedDouble_SM_SP},
            {message: 'Numeric - no separator with separatorMark, separatorPattern formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SM_SP, expectedRecords: expectedNoSeparator_SM_SP},
            {message: 'Numeric - multiple separators with separatorMark, separatorPattern formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SM_SP, expectedRecords: expectedMultiSeparators_SM_SP},

            {message: 'Numeric - decimal with separatorPattern, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SP_DM, expectedRecords: expectedDecimal_SP_DM},
            {message: 'Numeric - double with separatorPattern, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_SP_DM, expectedRecords: expectedDouble_SP_DM},
            {message: 'Numeric - no separator with separatorPattern, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SP_DM, expectedRecords: expectedNoSeparator_SP_DM},
            {message: 'Numeric - multiple separators with separatorPattern, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SP_DM, expectedRecords: expectedMultiSeparators_SP_DM},

            // 3 flags
            {message: 'Numeric - decimal with decimalPlaces, separatorStart, separatorMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS_SM, expectedRecords: expectedDecimal_DP_SS_SM},
            {message: 'Numeric - double with decimalPlaces, separatorStart, separatorMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS_SM, expectedRecords: expectedDouble_DP_SS_SM},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart, separatorMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS_SM, expectedRecords: expectedNoSeparator_DP_SS_SM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart, separatorMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS_SM, expectedRecords: expectedMultiSeparators_DP_SS_SM},

            {message: 'Numeric - decimal with decimalPlaces, separatorStart, separatorPattern formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS_SP, expectedRecords: expectedDecimal_DP_SS_SP},
            {message: 'Numeric - double with decimalPlaces, separatorStart, separatorPattern formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS_SP, expectedRecords: expectedDouble_DP_SS_SP},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart, separatorPattern formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS_SP, expectedRecords: expectedNoSeparator_DP_SS_SP},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart, separatorPattern formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS_SP, expectedRecords: expectedMultiSeparators_DP_SS_SP},

            {message: 'Numeric - decimal with decimalPlaces, separatorStart, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS_DM, expectedRecords: expectedDecimal_DP_SS_DM},
            {message: 'Numeric - double with decimalPlaces, separatorStart, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS_DM, expectedRecords: expectedDouble_DP_SS_DM},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS_DM, expectedRecords: expectedNoSeparator_DP_SS_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS_DM, expectedRecords: expectedMultiSeparators_DP_SS_DM},

            {message: 'Numeric - decimal with decimalPlaces, separatorMark, separatorPattern formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SM_SP, expectedRecords: expectedDecimal_DP_SM_SP},
            {message: 'Numeric - double with decimalPlaces, separatorMark, separatorPattern formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SM_SP, expectedRecords: expectedDouble_DP_SM_SP},
            {message: 'Numeric - no separator with decimalPlaces, separatorMark, separatorPattern formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SM_SP, expectedRecords: expectedNoSeparator_DP_SM_SP},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorMark, separatorPattern formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SM_SP, expectedRecords: expectedMultiSeparators_DP_SM_SP},

            {message: 'Numeric - decimal with decimalPlaces, separatorMark, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SM_DM, expectedRecords: expectedDecimal_DP_SM_DM},
            {message: 'Numeric - double with decimalPlaces, separatorMark, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SM_DM, expectedRecords: expectedDouble_DP_SM_DM},
            {message: 'Numeric - no separator with decimalPlaces, separatorMark, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SM_DM, expectedRecords: expectedNoSeparator_DP_SM_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorMark, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SM_DM, expectedRecords: expectedMultiSeparators_DP_SM_DM},

            {message: 'Numeric - decimal with decimalPlaces, separatorPattern, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SP_DM, expectedRecords: expectedDecimal_DP_SP_DM},
            {message: 'Numeric - double with decimalPlaces, separatorPattern, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_DP_SP_DM, expectedRecords: expectedDouble_DP_SP_DM},
            {message: 'Numeric - no separator with decimalPlaces, separatorPattern, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SP_DM, expectedRecords: expectedNoSeparator_DP_SP_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorPattern, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SP_DM, expectedRecords: expectedMultiSeparators_DP_SP_DM},

            {message: 'Numeric - decimal with separatorStart, separatorMark, separatorPattern formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_SM_SP, expectedRecords: expectedDecimal_SS_SM_SP},
            {message: 'Numeric - double with separatorStart, separatorMark, separatorPattern formats', records: recordInputDouble, fieldInfo: fieldInfo_SS_SM_SP, expectedRecords: expectedDouble_SS_SM_SP},
            {message: 'Numeric - no separator with separatorStart, separatorMark, separatorPattern formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_SM_SP, expectedRecords: expectedNoSeparator_SS_SM_SP},
            {message: 'Numeric - multiple separators with separatorStart, separatorMark, separatorPattern formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_SM_SP, expectedRecords: expectedMultiSeparators_SS_SM_SP},

            {message: 'Numeric - decimal with separatorStart, separatorMark, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_SM_DM, expectedRecords: expectedDecimal_SS_SM_DM},
            {message: 'Numeric - double with separatorStart, separatorMark, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_SS_SM_DM, expectedRecords: expectedDouble_SS_SM_DM},
            {message: 'Numeric - no separator with separatorStart, separatorMark, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_SM_DM, expectedRecords: expectedNoSeparator_SS_SM_DM},
            {message: 'Numeric - multiple separators with separatorStart, separatorMark, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_SM_DM, expectedRecords: expectedMultiSeparators_SS_SM_DM},

            {message: 'Numeric - decimal with separatorStart, separatorPattern, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_SP_DM, expectedRecords: expectedDecimal_SS_SP_DM},
            {message: 'Numeric - double with separatorStart, separatorPattern, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_SS_SP_DM, expectedRecords: expectedDouble_SS_SP_DM},
            {message: 'Numeric - no separator with separatorStart, separatorPattern, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_SP_DM, expectedRecords: expectedNoSeparator_SS_SP_DM},
            {message: 'Numeric - multiple separators with separatorStart, separatorPattern, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_SP_DM, expectedRecords: expectedMultiSeparators_SS_SP_DM},

            {message: 'Numeric - decimal with separatorMark, separatorPattern, decimalMark formats', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SM_SP_DM, expectedRecords: expectedDecimal_SM_SP_DM},
            {message: 'Numeric - double with separatorMark, separatorPattern, decimalMark formats', records: recordInputDouble, fieldInfo: fieldInfo_SM_SP_DM, expectedRecords: expectedDouble_SM_SP_DM},
            {message: 'Numeric - no separator with separatorMark, separatorPattern, decimalMark formats', records: recordInputNoSeparator, fieldInfo: fieldInfo_SM_SP_DM, expectedRecords: expectedNoSeparator_SM_SP_DM},
            {message: 'Numeric - multiple separators with separatorMark, separatorPattern, decimalMark formats', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SM_SP_DM, expectedRecords: expectedMultiSeparators_SM_SP_DM},

            // 4 flags
            {message: 'Numeric - decimal with decimalPlaces, separatorStart, separatorMark, separatorPattern format flags', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS_SM_SP, expectedRecords: expectedDecimal_DP_SS_SM_SP},
            {message: 'Numeric - double with decimalPlaces, separatorStart, separatorMark, separatorPattern format flags', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS_SM_SP, expectedRecords: expectedDouble_DP_SS_SM_SP},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart, separatorMark, separatorPattern format flags', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS_SM_SP, expectedRecords: expectedNoSeparator_DP_SS_SM_SP},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart, separatorMark, separatorPattern format flags', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS_SM_SP, expectedRecords: expectedMultiSeparators_DP_SS_SM_SP},

            {message: 'Numeric - decimal with decimalPlaces, separatorStart, separatorMark, decimalMark format flags', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS_SM_DM, expectedRecords: expectedDecimal_DP_SS_SM_DM},
            {message: 'Numeric - double with decimalPlaces, separatorStart, separatorMark, decimalMark format flags', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS_SM_DM, expectedRecords: expectedDouble_DP_SS_SM_DM},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart, separatorMark, decimalMark format flags', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS_SM_DM, expectedRecords: expectedNoSeparator_DP_SS_SM_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart, separatorMark, decimalMark format flags', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS_SM_DM, expectedRecords: expectedMultiSeparators_DP_SS_SM_DM},

            {message: 'Numeric - decimal with decimalPlaces, separatorStart, separatorPattern, decimalMark format flags', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SS_SP_DM, expectedRecords: expectedDecimal_DP_SS_SP_DM},
            {message: 'Numeric - double with decimalPlaces, separatorStart, separatorPattern, decimalMark format flags', records: recordInputDouble, fieldInfo: fieldInfo_DP_SS_SP_DM, expectedRecords: expectedDouble_DP_SS_SP_DM},
            {message: 'Numeric - no separator with decimalPlaces, separatorStart, separatorPattern, decimalMark format flags', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SS_SP_DM, expectedRecords: expectedNoSeparator_DP_SS_SP_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorStart, separatorPattern, decimalMark format flags', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SS_SP_DM, expectedRecords: expectedMultiSeparators_DP_SS_SP_DM},

            {message: 'Numeric - decimal with decimalPlaces, separatorMark, separatorPattern, decimalMark format flags', records: recordInputDecimalOnly, fieldInfo: fieldInfo_DP_SM_SP_DM, expectedRecords: expectedDecimal_DP_SM_SP_DM},
            {message: 'Numeric - double with decimalPlaces, separatorMark, separatorPattern, decimalMark format flags', records: recordInputDouble, fieldInfo: fieldInfo_DP_SM_SP_DM, expectedRecords: expectedDouble_DP_SM_SP_DM},
            {message: 'Numeric - no separator with decimalPlaces, separatorMark, separatorPattern, decimalMark format flags', records: recordInputNoSeparator, fieldInfo: fieldInfo_DP_SM_SP_DM, expectedRecords: expectedNoSeparator_DP_SM_SP_DM},
            {message: 'Numeric - multiple separators with decimalPlaces, separatorMark, separatorPattern, decimalMark format flags', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_DP_SM_SP_DM, expectedRecords: expectedMultiSeparators_DP_SM_SP_DM},

            {message: 'Numeric - decimal with separatorStart, separatorMark, separatorPattern, decimalMark format flags', records: recordInputDecimalOnly, fieldInfo: fieldInfo_SS_SM_SP_DM, expectedRecords: expectedDecimal_SS_SM_SP_DM},
            {message: 'Numeric - double with separatorStart, separatorMark, separatorPattern, decimalMark format flags', records: recordInputDouble, fieldInfo: fieldInfo_SS_SM_SP_DM, expectedRecords: expectedDouble_SS_SM_SP_DM},
            {message: 'Numeric - no separator with separatorStart, separatorMark, separatorPattern, decimalMark format flags', records: recordInputNoSeparator, fieldInfo: fieldInfo_SS_SM_SP_DM, expectedRecords: expectedNoSeparator_SS_SM_SP_DM},
            {message: 'Numeric - multiple separators with separatorStart, separatorMark, separatorPattern, decimalMark format flags', records: recordInputMultipleSeparators, fieldInfo: fieldInfo_SS_SM_SP_DM, expectedRecords: expectedMultiSeparators_SS_SM_SP_DM},

            // All flags
            {message: 'Numeric - decimal with all format flags', records: recordInputDecimalOnly, fieldInfo: allFlagsFieldInfo, expectedRecords: expectedDecimal_AllFlags},
            {message: 'Numeric - double with all format flags', records: recordInputDouble, fieldInfo: allFlagsFieldInfo, expectedRecords: expectedDouble_AllFlags},
            {message: 'Numeric - no separator with all format flags', records: recordInputNoSeparator, fieldInfo: allFlagsFieldInfo, expectedRecords: expectedNoSeparator_AllFlags},
            {message: 'Numeric - multiple separators with all format flags', records: recordInputMultipleSeparators, fieldInfo: allFlagsFieldInfo, expectedRecords: expectedMultiSeparators_AllFlags},

            {message: 'Numeric - decimal with invalid format flags', records: recordInputDecimalOnly, fieldInfo: invalidFlagsFieldInfo, expectedRecords: expectedDecimal_InvalidFlags},
            {message: 'Numeric - double with invalid format flags', records: recordInputDouble, fieldInfo: invalidFlagsFieldInfo, expectedRecords: expectedDouble_InvalidFlags},
            {message: 'Numeric - no separator with invalid format flags', records: recordInputNoSeparator, fieldInfo: invalidFlagsFieldInfo, expectedRecords: expectedNoSeparator_InvalidFlags},
            {message: 'Numeric - multiple separators with invalid format flags', records: recordInputMultipleSeparators, fieldInfo: invalidFlagsFieldInfo, expectedRecords: expectedMultiSeparators_InvalidFlags},

            {message: 'Numeric - exponent', records: recordInputExDouble, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation},
            {message: 'Numeric - exponent separator', records: recordInputExDoubleSeparators, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_separators},
            {message: 'Numeric - negative exponent separator', records: recordInputExDoubleFraction, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_fraction},
            {message: 'Numeric - negative exponent separator', records: recordInputExDoubleFractionLarge, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_fractionLarge},
            {message: 'Numeric - negative exponent separator', records: recordInputExDoubleNegative, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_negative},
            {message: 'Numeric - negative exponent separator', records: recordInputExDoubleNegative2, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_negative2},
            {message: 'Numeric - negative exponent separator', records: recordInputExLarge, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_large},
            {message: 'Numeric - negative exponent separator', records: recordInputExLarge2, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_ScientificNotation_large2}
        ];

        return cases;
    }

    /**
     * Unit test that validates Numeric records formatting with various field property flags set
     */
    describe('should format a numeric record with various properties for display', function() {
        provider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
