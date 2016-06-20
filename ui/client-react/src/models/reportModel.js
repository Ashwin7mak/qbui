//  Report model object used by the client to render a report
let reportModel = {
    set: function(reportMeta, reportData) {
        let obj = {
            metaData: {},
            recordData: {},
            rptId: null
        };

        //  make available to the client the report meta data
        if (reportMeta && reportMeta.data) {
            obj.metaData = reportMeta.data;
            if (reportMeta.data.id) {
                obj.rptId = reportMeta.data.id.toString();
            }
        }

        //  make available to the client the report grid data
        if (reportData && reportData.data) {
            obj.recordData = reportData.data;
        }

        return obj;
    }
};

export default reportModel;
