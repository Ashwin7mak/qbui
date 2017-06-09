import ColumnTransform from "../../../../src/common/grid/transforms/columnTransform";
import jasmineEnzyme from 'jasmine-enzyme';

describe('columns', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('returns columns to the instance of the ColumnTransform', () => {

        let testColumnTransform = new ColumnTransform();
        spyOn(testColumnTransform, 'apply');
        expect(testColumnTransform.apply).toBeDefined();
    });
});
