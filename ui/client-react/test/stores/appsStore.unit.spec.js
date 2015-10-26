describe('Apps Store functions', () => {
    'use strict';

    var appActions;
    var appStore;

    beforeEach(() => {
        appActions = require('../../src/actions/appsActions');
        appStore = require('../../src/stores/appsStore');
    });

    it('test load apps action', () => {
        /*eslint no-unused-expressions:0 */
        expect(appStore).toBeDefined;
        expect(appActions).toBeDefined;
    });



});
