import UrlUtils from '../utils/urlUtils';

let reportsModel = {
    set: function(appId, tblId, reports) {
        let obj = {
            appId: appId,
            tblId: tblId,
            reportsList: []
        };
        if (reports) {
            reports.forEach((rpt) => {
                obj.reportsList.push({
                    id: rpt.id,
                    name: rpt.name,
                    type: rpt.type,
                    link: UrlUtils.getReportLink(appId, tblId, rpt.id)
                });
            });
        }
        return obj;
    }
};
export default reportsModel;
