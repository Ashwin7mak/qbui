import _ from 'lodash';
import testFormData, {testArrayBasedFormData} from '../../testHelpers/testFormData';
import {convertFormToArrayForClient, convertFormToObjectForServer} from '../../../src/actions/actionHelpers/transformFormData';

describe('TransformFormHelpers', () => {
    describe('convertFormToArrayForClient', () => {
        let result;
        beforeEach(() => {
            result = convertFormToArrayForClient(testFormData);
        });

        it('transforms the tab object into an array', () => {
            let actualTabs = result.formMeta.tabs.map(tab => tab.title);

            expect(actualTabs).toEqual(['Tab1', 'Tab2']);
        });

        it('transforms sections object into an array', () => {
            let actualSections = result.formMeta.tabs[0].sections.map(section => section.headerElement.FormHeaderElement.displayText);

            expect(actualSections).toEqual(['Tab1-Section1', 'Tab1-Section2']);
        });

        it('separates sections into column arrays', () => {
            let actualColumns = result.formMeta.tabs[0].sections[0].columns;

            expect(actualColumns.length).toEqual(1);
            expect(actualColumns[0].orderIndex).toEqual(0);
        });


        it('transforms elements object into an array', () => {
            let actualElements = result.formMeta.tabs[0].sections[0].columns[0].rows.map(row => row.elements[0].FormFieldElement.displayText);

            expect(actualElements).toEqual([
                'Tab1-Section1-Field1',
                'Tab1-Section1-Field2',
                'Tab1-Section1-Field3',
                'Tab1-Section1-Field4'
            ]);
        });

        it('puts elements into rows based on the positionSameRow property', () => {
            let actualRows = result.formMeta.tabs[1].sections[0].columns[0].rows.map(row => {
                return row.elements.map(element => element.FormFieldElement.displayText);
            });

            expect(actualRows).toEqual([
                ['Tab2-Section1-Field1', 'Tab2-Section1-Field2'],
                ['Tab2-Section1-Field3', 'Tab2-Section1-Field4', 'Tab2-Section1-Field5'],
                ['Tab2-Section1-Field6'],
                ['Tab2-Section1-Field7']
            ]);
        });

        it('adds unique Ids that can be used as react keys', () => {
            let tab = result.formMeta.tabs[0];
            let section = tab.sections[0];
            let column = section.columns[0];
            let row = column.rows[0];
            let element = row.elements[0];

            expect(tab.id).toBeDefined();
            expect(section.id).toBeDefined();
            expect(column.id).toBeDefined();
            expect(row.id).toBeDefined();
            expect(element.id).toBeDefined();
        });

        it('adds the orderIndex to the containing element for use during drag and drop', () => {
            let element = result.formMeta.tabs[0].sections[1].columns[0].rows[0].elements[0];

            expect(element.orderIndex).toEqual(0);

            let elementInRow = result.formMeta.tabs[1].sections[0].columns[0].rows[1].elements[2];
            expect(elementInRow.orderIndex).toEqual(2);
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
