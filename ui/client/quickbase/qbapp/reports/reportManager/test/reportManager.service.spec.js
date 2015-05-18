describe('Service: ReportService', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbse.qbapp.reports.manager'));

    var ReportService;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function(_ReportService_) {
            ReportService = _ReportService_;
            // TODO will need to mock out the http call once that is implemented
        })
    );

    it('validate the get service call a json object', function() {
        var report = ReportService.get(1);
        expect(report.id).toEqual(1);
    });

});
