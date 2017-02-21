(function() {
    /**
     * As of right now we are using ontouchstart to detect if it is a touch device for form builder Drag and Drop. The styles for tablets and mobiles are different than
     * the styles on a desktop. Desktop and tablet screens can potentially be the same dimensions, this is why media breakpoints in CSS are solely being relied on.
     * */
    module.exports = {
        /**
         * touch detection
         * */
        isTouchDevice: function() {
            return "ontouchstart" in window;
        }
    };
}());
