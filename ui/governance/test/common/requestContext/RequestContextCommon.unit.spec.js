import {checkDataFetchingError} from '../../../src/common/requestContext/RequestContextCommon';
import jasmineEnzyme from 'jasmine-enzyme';

describe('RequestContextCommon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe('checkDataFetchingError', () => {
        it('should return null on a 401', () => {
            expect(checkDataFetchingError({data: {statusCode: 401}})).toBeNull();
        });

        it('should return an error otherwise', () => {
            let error = 'error';
            expect(checkDataFetchingError(error)).toEqual(error);
        });
    });
});
