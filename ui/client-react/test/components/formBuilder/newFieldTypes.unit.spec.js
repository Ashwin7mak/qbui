import {createFieldTypeProps, getTooltipForNewField, __RewireAPI__ as NewFieldTypesRewireAPI} from '../../../src/components/formBuilder/newFieldTypes';
import fieldFormats from '../../../src/utils/fieldFormats';

const mockLocale = {
    getMessage(key) {return key;}
};

describe('NewFieldTypes', () => {

    beforeEach(() => {
        NewFieldTypesRewireAPI.__Rewire__('Locale', mockLocale);
    });

    afterEach(() => {
        NewFieldTypesRewireAPI.__ResetDependency__('Locale');
    });

    describe('createFieldTypeProps', () => {
        it('returns an object with the correct field type props', () => {
            expect(createFieldTypeProps(fieldFormats.TEXT_FORMAT)).toEqual({
                key: `fieldType_${fieldFormats.TEXT_FORMAT}`,
                type: fieldFormats.TEXT_FORMAT,
                title: `fieldsDefaultLabels.${fieldFormats.TEXT_FORMAT}`,
                tooltipText: 'builder.tooltips.addNewFieldTooltip',
                isNewField: true
            });
        });
    });

    describe('getTooltipForNewField', () => {
        beforeEach(() => {
            spyOn(mockLocale, 'getMessage');
            NewFieldTypesRewireAPI.__Rewire__('Locale', mockLocale);
        });

        let testCases = [
            {description: 'Checkbox', fieldType: fieldFormats.CHECKBOX_FORMAT, expectedKey: 'builder.tooltips.addNewCheckboxTooltip'},
            {description: 'Text Multi Choice', fieldType: fieldFormats.TEXT_FORMAT_MULTICHOICE, expectedKey: 'builder.tooltips.addNewChoiceListTooltip'},
            {description: 'Text Radio', fieldType: fieldFormats.TEXT_FORMAT_RADIO_BUTTONS, expectedKey: 'builder.tooltips.addNewRadioListTooltip'},
            {description: 'Default', fieldType: fieldFormats.TEXT_FORMAT, expectedKey: 'builder.tooltips.addNewFieldTooltip', expectedFieldName: {fieldName: ''}},
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                getTooltipForNewField(testCase.fieldType, testCase.fieldName);

                if (testCase.expectedFieldName) {
                    expect(mockLocale.getMessage).toHaveBeenCalledWith(testCase.expectedKey, testCase.expectedFieldName);
                } else {
                    expect(mockLocale.getMessage).toHaveBeenCalledWith(testCase.expectedKey);
                }
            });
        });
    });
});
