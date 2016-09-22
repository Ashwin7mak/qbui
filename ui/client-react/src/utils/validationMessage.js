/**
 * Static class of client validation message formatting functions
 */
import Locales from '../locales/locales';

class ValidationMessage {
    static getMessage(results) {
        let message;
        if (results.isInvalid) {
            let error = results.error;
            switch (error.messageId) {
            case 'invalidMsg.required' : {
                message = Locales.getMessage('invalidMsg.required',
                        {fieldName: error.fieldName});
                break;
            }
            case 'invalidMsg.maxChars' : {
                message = Locales.getMessage('invalidMsg.maxChars',
                        {maxNum: error.maxNum});
                break;
            }
            default: {
                message = "unknown message " + JSON.stringify(results);
                break;
            }
            }
        }
        return message;
    }
}


export default ValidationMessage;
