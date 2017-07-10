import ColumnTransform from "../../../../src/common/grid/transforms/columnTransform";
import jasmineEnzyme from 'jasmine-enzyme';

describe('columns', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    let mockColumns = [{
        "property":"firstName",
        "header":{
            "label":"First Name"
        },
        "fieldDef":{
            "id":1,
            "datatypeAttributes":{
                "type":"TEXT"
            }
        }
    }];

    it('test the constructor function', () => {
        let testColumnTransform = new ColumnTransform();
        testColumnTransform.constructor('mockGrid', 'mockProp');
        expect(testColumnTransform.grid).toEqual('mockGrid');
        expect(testColumnTransform.props).toEqual('mockProp');
    });

    it('returns columns to the instance of the ColumnTransform', () => {

        let testColumnTransform = new ColumnTransform();
        let result = testColumnTransform.apply(mockColumns);
        expect(result).toEqual(mockColumns);
    });

});
