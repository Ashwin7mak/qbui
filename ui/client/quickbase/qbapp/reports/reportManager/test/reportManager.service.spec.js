describe('Service: ReportService', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbapp.reports.manager'));

    var _ReportService;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function(_ReportService_) {
            _ReportService = _ReportService_;
            // TODO will need to mock out the http call once that is implemented
        })
    );

    it('validate the get service call a json object', function() {
        var report = _ReportService.get(1);
        expect(report.id).toEqual(1);
    });

});