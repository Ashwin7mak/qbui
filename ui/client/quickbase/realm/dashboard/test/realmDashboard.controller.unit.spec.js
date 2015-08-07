
describe('Controller: RealmDashboardCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbse.realm.dashboard'));

    var RealmDashboardCtrl;
    var scope;
    var $log;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, _$log_) {
        scope = $rootScope.$new();
        $log = _$log_;
        RealmDashboardCtrl = $controller('RealmDashboardCtrl', {
            $scope: scope,
            $log :$log
        });
    }));

    //placeholder till code is in RealmDashboardCtrl
    it('should have a test...', function() {
        expect(1).toEqual(1);
    });
});

