import {createFieldTypeProps} from '../../../src/components/formBuilder/newFieldTypes';
import fieldFormats from '../../../src/utils/fieldFormats';

describe('NewFieldTypes', () => {

    describe('createFieldTypeProps', () => {
        it('returns an object with the correct field type props', () => {
            expect(createFieldTypeProps(fieldFormats.TEXT_FORMAT)).toEqual({
                type: fieldFormats.TEXT_FORMAT,
                title: fieldFormats.TEXT_FORMAT,
                tooltipText: 'Add new field',
                isNewField: true
            });
        });
    });

});
