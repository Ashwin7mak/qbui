import {createScalarDefaultFieldsProperties} from '../../src/utils/defaultFieldsProperties';
import {testCases} from './defaultFieldsPropertiesTestCases';
import jasmineEnzyme from 'jasmine-enzyme';

describe('DefaultFieldsProperties', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    testCases.forEach(function(test) {
        fit(`will return the ${test.userDefault ? 'user\'s' : ''} default properties for ${test.serverType}`, () => {
            let result = createScalarDefaultFieldsProperties(test.userDefault)[test.type];
            expect(result).toEqual(test.expectedResult);
        });
    });
});
