describe('Factory: ReportModel', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbapp.reports.manager'));

    var _ReportModel, _ReportService;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function(_ReportModel_, _ReportService_) {
            _ReportModel = _ReportModel_;
            _ReportService = _ReportService_;
            spyOn(_ReportService, 'get').andReturn({id:1});
        })
    );

    it('validate the get service call', function() {
        //  all reports expected to have staging and content template defined
        var model = _ReportModel.get(1);
        expect(_ReportService.get).toHaveBeenCalled();
        expect(model.id).toEqual(1);
    });

});