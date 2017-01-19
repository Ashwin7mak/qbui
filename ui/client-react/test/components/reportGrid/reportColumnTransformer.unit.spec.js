import ReportColumnTransformer from '../../../src/components/dataTable/reportGrid/reportColumnTransformer';
import SchemaConsts from '../../../../common/src/constants';

const testFieldDef = {fieldDef: true};


describe('ReportColumnTransformer', () => {
    describe('tranformColumnsForGrid', () => {
        it('returns an empty array if no columns are passed in', () => {
            expect(ReportColumnTransformer.transformColumnsForGrid(null)).toEqual([]);
        });

        it('calls the function to transform every element in the array to a ColumnTransformer and returns the array', () => {
            spyOn(ReportColumnTransformer, 'createFromApiColumn').and.returnValue('transformed');

            const testArray = [1, 2, 3];
            const expectedArray = ['transformed', 'transformed', 'transformed'];

            let results = ReportColumnTransformer.transformColumnsForGrid(testArray);

            expect(results).toEqual(expectedArray);
        });
    });

    describe('createFromApiColumn', () => {
        it('transforms data from the api call into a new ColumnTransformer', () => {
            ReportColumnTransformer.__Rewire__('FieldUtils', {getColumnHeaderClasses(fieldDef) {return fieldDef.datatypeAttributes.type;}});

            const testApiColumnData = {
                id: 2,
                headerName: 'test',
                fieldDef: {datatypeAttributes: {type: SchemaConsts.TEXT}}
            };

            const expectedResult = new ReportColumnTransformer(testApiColumnData.id, testApiColumnData.fieldDef, testApiColumnData.headerName, SchemaConsts.TEXT);

            expect(ReportColumnTransformer.createFromApiColumn(testApiColumnData)).toEqual(expectedResult);

            ReportColumnTransformer.__ResetDependency__('FieldUtils');
        });
    });

    describe('addHeaderMenu', () => {
        it('adds the fieldDef to the properties passed down to the header menu', () => {
            const component = 'Header component';
            const props = {test: 'props'};

            let reportColumnTransformer = new ReportColumnTransformer(2, testFieldDef, 'test', 'classes');
            reportColumnTransformer.addHeaderMenu(component, props);

            expect(reportColumnTransformer.headerMenuComponent).toEqual(component);
            expect(reportColumnTransformer.headerMenuProps).toEqual({...props, fieldDef: testFieldDef});
        });
    });

    describe('New', () => {
        it('creates a new instance of ReportColumnTransformer', () => {
            const testFieldId = 2;
            const testHeaderLabel = 'test';
            const testClasses = 'classes';
            let reportColumnTransformer = new ReportColumnTransformer(testFieldId, testFieldDef, testHeaderLabel, testClasses);
            expect(reportColumnTransformer.fieldId).toEqual(testFieldId);
            expect(reportColumnTransformer.fieldDef).toEqual(testFieldDef);
            expect(reportColumnTransformer.headerLabel).toEqual(testHeaderLabel);
            expect(reportColumnTransformer.headerClasses).toEqual(testClasses);
            expect(reportColumnTransformer.cellIdentifierValue).toEqual(testFieldId);
        });
    });
});
