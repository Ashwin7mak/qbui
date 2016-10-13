/**
 * Static class of client validation message formatting functions
 */
import Locale from '../locales/locales';

class ValidationMessage {

    static getMessage(results) {
        let message;
        if (results.isInvalid) {
            if (results.error) {
                let error = results.error;
                let data = error.data;
                message = Locale.getMessage(error.messageId, data);
            } else {
                message = Locale.getMessage('invalidMsg.unknown') + JSON.stringify(results);
            }
        }
        return message;
    }
}
export default ValidationMessage;

