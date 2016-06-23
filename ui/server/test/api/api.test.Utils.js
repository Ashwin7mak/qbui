(function() {
    'use strict';
    module.exports = {
        /**
         * Generates and returns a random string of specified length
         */
        generateRandomString: function(size) {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var text = '';
            for (var i = 0; i < size; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
    };

}());
