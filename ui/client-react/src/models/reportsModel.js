import UrlUtils from '../utils/urlUtils';

let reportsModel = {
    set: function(reports) {
        let reportList = [];
        if (reports && reports.data) {
            reports.data.forEach((rpt) => {
                reportList.push({
                    id: rpt.id,
                    name: rpt.name,
                    type: rpt.type,
                    link: UrlUtils.getReportLink(reports.appId, reports.tblId, rpt.id)
                });
            });
        }
        return reportList;
    }
};
export default reportsModel;
