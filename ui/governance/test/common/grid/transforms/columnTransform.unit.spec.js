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

    it('returns columns to the instance of the ColumnTransform', () => {

        let testColumnTransform = new ColumnTransform();
        spyOn(testColumnTransform, 'apply');
        // expect(testColumnTransform.apply).toBeDefined();
        let result = testColumnTransform.apply(mockColumns);
        console.log(result);
        expect(testColumnTransform.apply).toHaveBeenCalled();
        expect(result).toEqual(mockColumns);
    });
});
