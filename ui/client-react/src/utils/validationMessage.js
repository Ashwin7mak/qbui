/**
 * Static class of client validation message formatting functions
 */
import Locale from '../locales/locales';

class ValidationMessage {

    static getMessage(results) {
        let message;

        if (results.isInvalid && results.error) {
            let error = results.error;
            let data = error.data;
            switch (error.messageId) {
            case 'invalidMsg.required' :
                message = Locale.getMessage('invalidMsg.required',
                            {fieldName: data.fieldName});
                break;

            case 'invalidMsg.maxChars' :
                message = Locale.getMessage('invalidMsg.maxChars',
                            {maxNum: data.maxNum});
                break;

            default:
                message = "unknown message " + JSON.stringify(results);
                break;

            }
        }
        return message;
    }
}
export default ValidationMessage;
