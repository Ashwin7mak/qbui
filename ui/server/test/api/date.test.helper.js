(function() {
    'use strict';

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var thisYear = new Date().getFullYear();
    var thisYear2 = new Date().getYear() - 100;

    module.exports = {
        thisYear: thisYear,
        thisYear2 : thisYear2,
        dayOfWeekAprilTwelve :weekday[(new Date(thisYear + '-04-12T18:51:19z').getUTCDay())]
    };

}());
