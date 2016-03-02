import FacetSelections from '../../src/components/facet/facetSelections';

describe('FacetSelections', () => {
    'use strict';

    var mySelections;
    beforeEach(function() {
        mySelections = {
            fieldid1: ["selectedValueA", "selectedValueB"],
            fieldid2: ["selectedValueC", "selectedValueD"],
            fieldid3: ["selectedValueY", "selectedValueZ"],
            fieldid4: [],
        };
    });

    describe('test FacetSelections init', () => {
        it('is empty', () => {
            let testInit = new FacetSelections();
            expect(testInit.getSelections()).not.toBe(null);
            expect(testInit.selectionsHash).not.toBe(null);
            expect(testInit.selectionsHash).toEqual({});
        });
    });

    describe('test FacetSelections initSelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it('sets selection values', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.getSelections()).toEqual(mySelections);
        });


        it('ignores invalid input null', () => {
            testSelections.initSelections(mySelections);
            testSelections.initSelections(null);
            expect(testSelections.getSelections()).toEqual(mySelections);
        });

        it('ignores invalid input number', () => {
            testSelections.initSelections(mySelections);
            testSelections.initSelections(4);
            expect(testSelections.getSelections()).toEqual(mySelections);
        });

    });

    describe('test FacetSelections hasAnySelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it('has selections', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.hasAnySelections()).toBeTruthy();
        });

        it('initialized doesn\'t have selections', () => {
            testSelections.initSelections();
            expect(testSelections.hasAnySelections()).toBeFalsy();
        });

        it('emptied array doesn\'t have selections', () => {
            testSelections.initSelections({emptyList:[]});
            expect(testSelections.hasAnySelections()).toBeFalsy();
        });
    });

    describe('test FacetSelections whichHasAnySelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it('which has selections', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.whichHasAnySelections().length).toBe(3);
            expect(_.includes(testSelections.whichHasAnySelections(), 'fieldid1', 'fieldid2', 'fieldid3'));
        });

        it('initialized doesn\'t have selections', () => {
            testSelections.initSelections();
            expect(testSelections.whichHasAnySelections().length).toBe(0);
        });

        it('emptied array doesn\'t have selections', () => {
            testSelections.initSelections({emptyList:[]});
            expect(testSelections.whichHasAnySelections().length).toBe(0);
        });
    });



    describe('test FacetSelections isValueInSelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it('isValueInSelections', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.isValueInSelections('fieldid1', 'selectedValueA')).toBeTruthy();
        });

        it('doesn\'t isValueInSelections', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.isValueInSelections('fieldid1', 'nogInThere')).toBeFalsy();
        });

    });
    describe('test FacetSelections getFieldSelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it('works', () => {
            testSelections.initSelections(mySelections);
            var expected = mySelections.fieldid1;
            expect(testSelections.getFieldSelections('fieldid1')).toEqual(expected);
        });

        it(' doesn\'t getFieldSelections invalid input', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.getFieldSelections('fieldidNotThere')).toEqual([]);
        });
    });

    describe('test FacetSelections getSelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it('works', () => {
            testSelections.initSelections(mySelections);
            expect(testSelections.getSelections()).toEqual(mySelections);
        });

        it(' with empty input', () => {
            testSelections.initSelections([]);
            expect(testSelections.getSelections()).toEqual([]);
        });
    });

    describe('test FacetSelections addSelection', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it(' to field with existing facets', () => {
            testSelections.initSelections(mySelections);
            testSelections.addSelection('fieldid1', 'addedVal');
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'addedVal')).toBeTruthy();
        });

        it(' several to existing', () => {
            testSelections.initSelections(mySelections);
            testSelections.addSelection('fieldid1', 'addedVal1');
            testSelections.addSelection('fieldid1', 'addedVal2');
            testSelections.addSelection('fieldid1', 'addedVal3');
            testSelections.addSelection('fieldid1', 'addedVal4');
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'addedVal1')).toBeTruthy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'addedVal2')).toBeTruthy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'addedVal3')).toBeTruthy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'addedVal4')).toBeTruthy();
        });

        it(' to field with no facets', () => {
            testSelections.initSelections();
            testSelections.addSelection('newFid', 'addedVal');
            expect(_.includes(testSelections.getFieldSelections('newFid'), 'addedVal')).toBeTruthy();
        });

        it(' to field with empty facets', () => {
            testSelections.initSelections();
            testSelections.addSelection('fieldid4', 'addedVal');
            expect(_.includes(testSelections.getFieldSelections('fieldid4'), 'addedVal')).toBeTruthy();
        });
    });
    describe('test FacetSelections removeSelection', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it(' from field with existing facets', () => {
            testSelections.initSelections(mySelections);
            testSelections.removeSelection('fieldid1', 'selectedValueB');
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueB')).toBeFalsy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueA')).toBeTruthy();
        });

        it(' several times from existing', () => {
            testSelections.initSelections(mySelections);
            testSelections.removeSelection('fieldid1', 'selectedValueB');
            testSelections.removeSelection('fieldid1', 'selectedValueA');
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueB')).toBeFalsy();
            //original untouched
            expect(_.includes(mySelections.fieldid1, 'selectedValueB')).toBeTruthy();
            expect(_.includes(mySelections.fieldid1, 'selectedValueA')).toBeTruthy();
        });

        it(' from field with no facets', () => {
            testSelections.initSelections();
            let result = testSelections.removeSelection('newFid', 'addedVal');
            expect(result).toEqual(null);
        });

        it(' from field with empty facets', () => {
            testSelections.initSelections();
            testSelections.removeSelection('fieldid4', 'addedVal');
            expect(_.includes(testSelections.getFieldSelections('fieldid4'), 'addedVal')).toBeFalsy();
        });
    });
    describe('test FacetSelections removeAllFieldSelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it(' from field with existing facets', () => {
            testSelections.initSelections(mySelections);
            testSelections.removeAllFieldSelections('fieldid1');
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueB')).toBeFalsy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueA')).toBeFalsy();
        });

        it(' several from existing', () => {
            testSelections.initSelections(mySelections);
            testSelections.removeAllFieldSelections('fieldid1');
            testSelections.removeAllFieldSelections('fieldid1');
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueB')).toBeFalsy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueA')).toBeFalsy();
            //original untouched
            expect(_.includes(mySelections.fieldid1, 'selectedValueB')).toBeTruthy();
            expect(_.includes(mySelections.fieldid1, 'selectedValueA')).toBeTruthy();
        });

        it(' from field with no facets', () => {
            testSelections.initSelections();
            let result = testSelections.removeAllFieldSelections('newFid');
            expect(result).toEqual(null);
        });

        it(' from field with empty facets', () => {
            testSelections.initSelections();
            testSelections.removeAllFieldSelections('fieldid4');
            expect(testSelections.getFieldSelections('fieldid4').length).toEqual(0);
        });
    });
    describe('test FacetSelections removeAllSelections', () => {
        let testSelections;
        beforeEach(function() {
            testSelections = new FacetSelections();
        });

        it(' from field with existing facets', () => {
            testSelections.initSelections(mySelections);
            testSelections.removeAllSelections();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueB')).toBeFalsy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueA')).toBeFalsy();
            expect(testSelections.hasAnySelections()).toBeFalsy();
        });

        it(' several times from existing', () => {
            testSelections.initSelections(mySelections);
            testSelections.removeAllSelections();
            testSelections.removeAllSelections();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueB')).toBeFalsy();
            expect(_.includes(testSelections.getFieldSelections('fieldid1'), 'selectedValueA')).toBeFalsy();
            expect(testSelections.hasAnySelections()).toBeFalsy();
            //original untouched
            expect(_.includes(mySelections.fieldid1, 'selectedValueB')).toBeTruthy();
            expect(_.includes(mySelections.fieldid1, 'selectedValueA')).toBeTruthy();
        });

        it(' from field with no facets', () => {
            testSelections.initSelections();
            let result = testSelections.removeAllSelections();
            expect(result).toEqual({});
            expect(testSelections.hasAnySelections()).toBeFalsy();
        });

        it(' from field with empty facets', () => {
            testSelections.initSelections();
            testSelections.removeAllSelections();
            expect(testSelections.getFieldSelections('fieldid4').length).toEqual(0);
            expect(testSelections.hasAnySelections()).toBeFalsy();
        });
    });

    describe('test FacetSelections setFacetValueSelectState ', () => {
        it('it toggles', () => {
            let testSelections = new FacetSelections();
            let facetField = {
                id : 'fieldid',
            };
            testSelections.setFacetValueSelectState(facetField, 'addSelect', true);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'addSelect')).toBeTruthy();
            testSelections.setFacetValueSelectState(facetField, 'addSelect', false);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'addSelect')).toBeFalsy();
        });
    });

    describe('test FacetSelections setFacetValueSelectState checkboxes', () => {
        let testSelections = new FacetSelections();
        let facetField = {
            type:"CHECKBOX",
            id : 'fieldid',
        };
        it('it has false selected', () => {
            testSelections.setFacetValueSelectState(facetField, 'No', true);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'No')).toBeTruthy();
        });
        it('it has true selected', () => {
            testSelections.setFacetValueSelectState(facetField, 'Yes', true);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'Yes')).toBeTruthy();
        });
        it('it has selects false and true is not selected', () => {
            testSelections.setFacetValueSelectState(facetField, 'No', true);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'Yes')).toBeFalsy();
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'No')).toBeTruthy();
        });

        it('it has selects true and false is not selected', () => {
            testSelections.setFacetValueSelectState(facetField, 'Yes', true);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'Yes')).toBeTruthy();
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'No')).toBeFalsy();
        });

        it('it has selects true and false is still not selected', () => {
            testSelections.setFacetValueSelectState(facetField, 'Yes', true);
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'Yes')).toBeTruthy();
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'No')).toBeFalsy();
        });
    });

    describe('test FacetSelections toggleSelectFacetValue ', () => {
        it('it toggles', () => {
            let testSelections = new FacetSelections();
            let facetField = {
                id : 'fieldid',
            };
            testSelections.toggleSelectFacetValue(facetField, 'addSelect');
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'addSelect')).toBeTruthy();
            testSelections.toggleSelectFacetValue(facetField, 'addSelect');
            expect(_.includes(testSelections.getFieldSelections('fieldid'), 'addSelect')).toBeFalsy();
        });
    });

});
