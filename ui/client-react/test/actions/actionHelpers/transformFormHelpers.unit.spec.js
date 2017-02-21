import _ from 'lodash';
import {testArrayBasedFormData} from '../../testHelpers/testFormData';
import {convertFormToObjectForServer} from '../../../src/actions/actionHelpers/transformFormData';

describe('TransformFormHelpers', () => {
    describe('convertFormToObjectForServer', () => {

        let result;

        beforeEach(() => {
            result = convertFormToObjectForServer(testArrayBasedFormData.formMeta);
        });

        it('does not transform data that is not likely well-formed formMeta', () => {
            let badFormMetaData = {foo: 'what is this!?!'};

            expect(convertFormToObjectForServer(badFormMetaData)).toEqual(badFormMetaData);
        });

        it('transforms the tab array to an object', () => {
            expect(_.isObject(result.tabs)).toEqual(true);
            expect(result.tabs[0].title).toEqual(testArrayBasedFormData.formMeta.tabs[0].title);
            expect(result.tabs[1].title).toEqual(testArrayBasedFormData.formMeta.tabs[1].title);
        });

        it('transforms the section array into an object', () => {
            let actualSections = result.tabs[0].sections;

            expect(_.isObject(actualSections)).toEqual(true);
            expect(actualSections[0].headerElement.FormHeaderElement.displayText).toEqual(testArrayBasedFormData.formMeta.tabs[0].sections[0].headerElement.FormHeaderElement.displayText);
        });

        // Server does not currently support columns so they are removed before posting to server
        it('removes the columns array', () => {
            let actualSection = result.tabs[0].sections[0];

            expect(actualSection.columns).toBeUndefined();
        });

        it('removes the rows and replaces them with the positionSameRow property', () => {
            let section = result.tabs[1].sections[0];
            let actualElements = section.elements;

            expect(section.rows).toBeUndefined();
            expect(_.isObject(actualElements)).toEqual(true);

            let fieldIdAndPosition = Object.keys(actualElements).map(key => {
                let element = actualElements[key];
                return {fieldId: element.FormFieldElement.fieldId, positionSameRow: element.FormFieldElement.positionSameRow};
            });

            expect(fieldIdAndPosition).toEqual([
                {fieldId: 14, positionSameRow: false},
                {fieldId: 15, positionSameRow: true},
                {fieldId: 16, positionSameRow: false},
                {fieldId: 17, positionSameRow: true},
                {fieldId: 18, positionSameRow: true},
                {fieldId: 19, positionSameRow: false},
                {fieldId: 20, positionSameRow: false},
            ]);
        });

        it('removes the unique ids that were used by react', () => {
            let tab = result.tabs[0];
            let section = tab.sections[0];
            let element = section.elements[0];

            expect(tab.id).toBeUndefined();
            expect(section.id).toBeUndefined();
            expect(element.id).toBeUndefined();
        });
    });
});
