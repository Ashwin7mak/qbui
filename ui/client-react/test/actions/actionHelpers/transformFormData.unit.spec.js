import _ from 'lodash';
import {buildTestFormData, buildTestArrayBasedFormData} from '../../testHelpers/testFormData';
import {convertFormToArrayForClient, convertFormToObjectForServer} from '../../../src/actions/actionHelpers/transformFormData';

const testFormData = buildTestFormData();
const testArrayBasedFormData = buildTestArrayBasedFormData();

describe('TransformFormData', () => {
    describe('convertFormToArrayForClient', () => {
        let result;
        beforeEach(() => {
            result = convertFormToArrayForClient(testFormData);
        });

        it('skips the transformation if the passed in data is not likely form data', () => {
            const badFormData = {foo: 'what is this!?'};
            expect(convertFormToArrayForClient(badFormData)).toEqual(badFormData);
        });

        it('transforms the tab object into an array', () => {
            let actualTabs = result.formMeta.tabs.map(tab => tab.title);

            expect(actualTabs).toEqual(['Tab1', 'Tab2']);
        });

        it('separates sections into column arrays', () => {
            let actualColumns = result.formMeta.tabs[0].sections[0].columns;

            expect(actualColumns.length).toEqual(1);
            expect(actualColumns[0].orderIndex).toEqual(0);
        });

        it('transforms elements object into an array', () => {
            let actualElements = result.formMeta.tabs[0].sections[0].columns[0].elements.map(element => element.FormFieldElement.displayText);

            expect(actualElements).toEqual([
                'Tab1-Section1-Field1',
                'Tab1-Section1-Field2',
                'Tab1-Section1-Field3',
                'Tab1-Section1-Field4'
            ]);
        });

        it('adds unique Ids that can be used as react keys', () => {
            let tab = result.formMeta.tabs[0];
            let section = tab.sections[0];
            let column = section.columns[0];
            let element = column.elements[0];

            expect(tab.id).toBeDefined();
            expect(section.id).toBeDefined();
            expect(column.id).toBeDefined();
            expect(element.id).toBeDefined();
        });

        it('adds the orderIndex to the containing element for use during drag and drop', () => {
            let element = result.formMeta.tabs[0].sections[1].columns[0].elements[0];

            expect(element.orderIndex).toEqual(0);
        });
    });

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

            expect(Array.isArray(actualSections)).toEqual(false);
            expect(_.isObject(actualSections)).toEqual(true);
            expect(actualSections[0].headerElement.FormHeaderElement.displayText).toEqual(testArrayBasedFormData.formMeta.tabs[0].sections[0].headerElement.FormHeaderElement.displayText);
        });

        // Server does not currently support columns so they are removed before posting to server
        it('removes the columns array', () => {
            let actualSection = result.tabs[0].sections[0];

            expect(actualSection.columns).toBeUndefined();
        });

        it('puts the elements back into the secion instead of in columns', () => {
            let section = result.tabs[1].sections[0];
            let actualElements = section.elements;

            expect(section.columns).toBeUndefined();
            expect(Array.isArray(actualElements)).toEqual(false);
            expect(_.isObject(actualElements)).toEqual(true);

            let fieldIds = Object.keys(actualElements).map(key => {
                let element = actualElements[key];
                return element.FormFieldElement.fieldId;
            });

            expect(fieldIds).toEqual([
                14,
                15,
                16,
                17,
                18,
                19,
                20
            ]);
        });

        it('removes the unique ids that were used by react', () => {
            let tab = result.tabs[0];
            let section = tab.sections[0];
            let element = section.elements[0];

            expect(tab.id).toBeUndefined();
            expect(section.id).toBeUndefined();
            expect(section.rows).toBeUndefined();
            expect(element.id).toBeUndefined();
            expect(element.orderIndex).toBeUndefined();
        });
    });
});
