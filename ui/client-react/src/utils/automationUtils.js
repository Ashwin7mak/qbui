/**
 * Created by msyed on 4/3/17.
 */
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';
import AutomationService from '../services/automationService';
import Logger from '../utils/logger';

class AutomationUtils  {

    //Custom class for all automation related utility methods, including invoking automations.
    /**
     * Invoke 'approve' automation
     */
     static approveRecord(appId, tblId, recId){
        var logger = new Logger();
        let automationService = new AutomationService();
        let payload = {
            "parameters": {
                "appId" : appId,
                "tableId": tblId,
                "recordId": recId
            }
        }
        return automationService.invokeAutomation("http://localhost:8089", "0duiiaaaaab", "ApproveProjectRecord", payload).then(
            response => {
                logger.debug('Automation success');
                NotificationManager.info("Record Approved.");
            },
            error => {
                NotificationManager.error("An Error occured when invoking automation");
                let errors = [];

                //  if a validation error, print each one individually..
                if (errors.length > 0) {
                    logger.debug('RecordService createRecord success');
                } else {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'Automation');
                }
            })
    };
}
export default AutomationUtils;
