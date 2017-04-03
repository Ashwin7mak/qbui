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
    static approveRecord(appId, wfId){
        var logger = new Logger();
        let automationService = new AutomationService();
        let payload = {
            "parameters": { "number": "6"}
        };
        automationService.invokeAutomation("http://localhost:8089", "0duiiaaaaab", "7fb492ae-3b5e-4c93-92b0-727aa2da6481", payload).then(
            response => {
                logger.debug('Automation success');
                NotificationManager.info(response.data.message);
            },
            error => {
                let errors = [];

                //  if a validation error, print each one individually..
                if (errors.length > 0) {
                    logger.debug('RecordService createRecord success');
                } else {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'Automation');
                }
                NotificationManager.error("An Error occured when invoking automation");
            })
        };
}
export default AutomationUtils;