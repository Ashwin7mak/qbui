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
                tooltipText: `builder.formBuilder.tooltips.addNew${fieldFormats.TEXT_FORMAT}`,
                isNewField: true
            });
        });
    });
});
