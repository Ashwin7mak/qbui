
describe('Controller: RealmDashboardCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbse.realm.dashboard'));

    var RealmDashboardCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        RealmDashboardCtrl = $controller('RealmDashboardCtrl', {
            $scope: scope
        });
    }));

    //placeholder till code is in RealmDashboardCtrl
    it('should have a test...', function() {
        expect(1).toEqual(1);
    });
});

