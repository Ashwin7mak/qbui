import RowTransformer from '../../../src/components/dataTable/qbGrid/rowTransformer';

describe('RowTransformer', () => {
    const testId = 23;

    it('creates a new instance of a RowTransformer with default options', () => {
        let rowInstance = new RowTransformer(testId);

        expect(rowInstance.id).toEqual(testId);
        expect(rowInstance.isEditing).toEqual(false);
        expect(rowInstance.isSubHeader).toEqual(false);
        expect(rowInstance.isSelected).toEqual(false);
        expect(rowInstance.classes).toEqual([]);
    });

    it('overrides options and attaches them as properties for the instance of RowTransformer', () => {
        const options = {isEditing: true, randomProp: 1234};
        let rowInstance = new RowTransformer(testId, [], options);

        expect(rowInstance.id).toEqual(testId);
        expect(rowInstance.isEditing).toEqual(true);
        expect(rowInstance.isSelected).toEqual(false);
        expect(rowInstance.randomProp).toEqual(1234);
    });

    it('uses the ids of the cells passed in to add the cells to the row with the correct properties', () => {
        const cells = [{id: 1, text: 'cell 1'}, {id: 2, text: 'cell 2'}];

        let rowInstance = new RowTransformer(testId, cells);

        expect(rowInstance[1]).toEqual(cells[0]);
        expect(rowInstance[2]).toEqual(cells[1]);
    });
});
