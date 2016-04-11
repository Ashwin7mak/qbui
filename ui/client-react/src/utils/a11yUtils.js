/**
 * accessibility utils
 */
class A11Utils {

    static isA11yClick(event) {

        if (event.nativeEvent.type === 'click') {
            return true;
        } else if (event.nativeEvent.type === 'keypress') {
            var code = event.charCode || event.keyCode;
            if ((code === 32) || (code === 13)) {
                return true;
            }
        } else {
            return false;
        }
    }
}

export default A11Utils;
