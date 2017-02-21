(function() {
    module.exports = {
        /**
         * touch detection
         * */
        isTouchDevice: function() {
            return "ontouchstart" in window;
        }
    }
}());