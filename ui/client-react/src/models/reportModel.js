//  Report model object used by the client to render a report
import ReportUtils from '../utils/reportUtils';
import Constants from '../../../common/src/constants';

let reportModel = {
    set: function(reportMeta, reportData) {
        let obj = {
            metaData: {},
            recordData: {},
            recordCount: 0,
            rptId: null,
            sortList: null
        };

        //  make available to the client the report meta data
        if (reportMeta) {
            obj.metaData = reportMeta;
            if (reportMeta.id) {
                obj.rptId = reportMeta.id.toString();
            } else {
                //  if there's no id, we loading the table default report
                obj.rptId = Constants.DEFAULT_TABLE_REPORT.ID;
            }

            //  for convenience, convert from the meta data the sort/group info(if any) into a list delimited string.
            obj.sortList = Array.isArray(reportMeta.sortList) ? ReportUtils.getSortListFromObject(reportMeta.sortList) : '';
        }

        //  make available to the client report grid info
        if (reportData) {
            obj.recordData = reportData;
            obj.recordCount = reportData.filteredCount;
        }

        return obj;
    }
};

export default reportModel;
