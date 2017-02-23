(function() {
    /**
     * As of right now we are using ontouchstart to detect if it is a touch device for form builder Drag and Drop. The styles for tablets and mobiles are different than
     * the styles on a desktop. Desktop/laptop and tablet screens can potentially be the same size however the styles are, this is why media breakpoints in CSS are not solely being relied on.
     * */
    module.exports = {
        /**
         * touch detection
         * */
        isTouch: function() {
            return "ontouchstart" in window;
        }
    };
}());
