import {createFieldTypeProps, getTooltipForNewField, __RewireAPI__ as NewFieldTypesRewireAPI} from '../../../src/components/formBuilder/newFieldTypes';
import fieldFormats from '../../../src/utils/fieldFormats';
import {createScalarDefaultFieldsProperties} from '../../../src/utils/defaultFieldsProperties';

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
            const expectedId = `fieldType_${fieldFormats.TEXT_FORMAT}`;
            const expectedElement = createScalarDefaultFieldsProperties()[fieldFormats.TEXT_FORMAT];
            expect(createFieldTypeProps(fieldFormats.TEXT_FORMAT)).toEqual({
                containingElement: {id: expectedId, FormFieldElement: {positionSameRow: false, ...expectedElement}},
                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, elementIndex: 0},
                key: expectedId,
                type: fieldFormats.TEXT_FORMAT,
                relatedField: expectedElement,
                title: `fieldsDefaultLabels.${fieldFormats.TEXT_FORMAT}`,
                tooltipText: `builder.formBuilder.tooltips.addNew${fieldFormats.TEXT_FORMAT}`,
                isNewField: true
            });
        });
    });
});
