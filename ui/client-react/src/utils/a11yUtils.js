/**
 * accessibility utils
 */
class A11Utils {

    static isA11yClick(event) {

        // check for clicks and also touchend (react-fastclick creates the latter)
        if (event.nativeEvent.type === 'click' || event.nativeEvent.type === 'touchend') {
            return true;
        } else if (event.nativeEvent.type === 'keydown') {
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
