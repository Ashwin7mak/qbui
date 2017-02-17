// import Html5Backend from 'react-dnd-html5-backend';
// import {default as TouchBackend} from 'react-dnd-touch-backend';

(function() {
    var Html5Backend = require('react-dnd-html5-backend');
    var TouchBackend = require('react-dnd-touch-backend');

    module.exports = {
        /**
         * In order to enable drag and drop on desktop or mobile we need to swap out the backend
         * if a user is on a touchDevice we will use the TouchBackend({enableMouseEvents: true}) for mobile device drag and drop
         * if a user is not on a touchDevice then we will use the Html5backend for drag and drop
         * */
        getBackEnd: function(isTouchDevice) {
            if (!isTouchDevice) {
                return Html5Backend;
            }
            return TouchBackend({enableMouseEvents: true});
        },
        /**
         * touch detection
         * */
        isTouchDevice: function() {
            return "ontouchstart" in window;
        }
    }
}());