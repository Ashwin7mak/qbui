describe('Factory: ReportModel', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbapp.reports.manager'));

    var ReportModel, ReportService;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function(_ReportModel_, _ReportService_) {
            ReportModel = _ReportModel_;
            ReportService = _ReportService_;
            spyOn(ReportService, 'get').and.returnValue({id:1});
        })
    );

    it('validate the get service call', function() {
        //  all reports expected to have staging and content template defined
        var model = ReportModel.get(1);
        expect(ReportService.get).toHaveBeenCalled();
        expect(model.id).toEqual(1);
    });

});
