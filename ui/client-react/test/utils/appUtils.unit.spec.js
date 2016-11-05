import AppUtils from '../../src/utils/appUtils';

describe('AppUtils', () => {
    describe('appExists', () => {

        let existingAppId = '1234';
        let nonExistingAppId = 'abcd';

        let testApps = [
            {id: '4567'},
            {id: existingAppId},
            {id: '8901'}
        ];

        let testCases = [
            {
                description: 'returns the app (object) if the app exists in the list provided',
                selectedAppId: existingAppId,
                apps: testApps,
                expectation: {id: existingAppId}
            },
            {
                description: 'returns false if the app does not exist in the list',
                selectedAppId: nonExistingAppId,
                apps: testApps,
                expectation: false
            },
            {
                description: 'returns false if a selectedAppId is not provided',
                selectedAppId: null,
                apps: testApps,
                expectation: false
            },
            {
                description: 'returns false if apps are not provided',
                selectedAppId: existingAppId,
                apps: null,
                expectation: false
            },
            {
                description: 'returns false if there are no apps in the apps array provided',
                selectedAppId: existingAppId,
                apps: [],
                expectation: false
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(AppUtils.appExists(testCase.selectedAppId, testCase.apps)).toEqual(testCase.expectation);
            });
        });
    });
});
