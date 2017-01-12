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
        let rowInstance = new RowTransformer(testId, options);

        expect(rowInstance.id).toEqual(testId);
        expect(rowInstance.isEditing).toEqual(true);
        expect(rowInstance.isSelected).toEqual(false);
        expect(rowInstance.randomProp).toEqual(1234);
    });
});
