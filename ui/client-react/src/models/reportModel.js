//  Report model object used by the client to render a report
let reportModel = {

    set: function(reportMeta, reportData) {
        var obj = {
            metaData: {},
            recordData: {}
        };

        //  make available to the client the report meta data
        if (reportMeta && reportMeta.data) {
            obj.metaData = reportMeta.data;
        }

        //  make available to the client the report grid data
        if (reportData && reportData.data) {
            obj.recordData = reportData.data;
        }

        return obj;
    }
};

export default reportModel;
