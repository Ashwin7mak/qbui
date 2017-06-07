/**
 * Created by msyed on 4/3/17.
 */
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';
import AutomationService from '../services/automationService';
import Logger from '../utils/logger';
import Locale from '../locales/locales';

class AutomationUtils  {

    //Custom class for all automation related utility methods, including invoking automations.
    /**
     * Invoke 'approve' automation
     */
    static approveRecord(appId, tblId, recId) {
        var logger = new Logger();
        let automationService = new AutomationService();
        let payload = {
            "parameters": {
                "appId" : appId,
                "tableId": tblId,
                "recordId": recId
            }
        };
        return automationService.invokeAutomation(appId, "ApproveProjectRecord", payload).then(
            response => {
                logger.debug('Automation success');
                NotificationManager.info(Locale.getMessage('automation.approverecord.success'), Locale.getMessage('success'));
            },
            error => {
                NotificationManager.error(Locale.getMessage('automation.approverecord.error'), Locale.getMessage('failed'));
                //  if a validation error, print each one individually..
                logger.parseAndLogError(LogLevel.ERROR, error.response, 'Automation');
            });
    }
}
export default AutomationUtils;
