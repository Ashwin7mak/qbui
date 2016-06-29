(function() {
    'use strict';

    module.exports = {
        /**
         * Decode a ob32 encoded string
         *
         * @param ticket
         * @return ob32 decoded string
         */
        ob32decoder: function(ob32string) {
            var ob32Characters = "abcdefghijkmnpqrstuvwxyz23456789";
            var decoded = 0;
            var place = 1;
            for (var counter = ob32string.length - 1; counter >= 0; counter--) {
                var oneChar = ob32string.charAt(counter);
                var oneDigit = ob32Characters.indexOf(oneChar);
                decoded += (oneDigit * place);
                place = place * 32;
            }
            return decoded;
        }
    };

}());
