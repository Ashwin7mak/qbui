(function() {
    'use strict';

    var common = Object.freeze({
        equals: 'EQUALS',
        firstLetter: 'BYFIRSTLETTER',
        firstWord: 'BYFIRSTWORD',
        day: 'BYDAY',
        week: 'BYWEEK',
        hour: 'BYHOUR',
        minute: 'BYMINUTE',
        second: 'BYSECOND'
    });

    var groups = Object.freeze({
        delimiter: ',',
        COMMON: {
            equals: common.equals
        },
        DATE: {
            equals: common.equals,
            day: common.day,
            week: common.week,
            month: 'BYMONTH',
            year: 'BYYEAR',
            quarter: 'BYQUARTER',
            fiscalQuarter: 'BYFISCALQUARTER',
            fiscalYear: 'BYFISCALYEAR',
            decade: 'BYDECADE'
        },
        DURATION: {
            equals: common.equals,
            second: common.second,
            minute: common.minute,
            hour: common.hour,
            week: common.week,
            day: common.day
        },
        TIME_OF_DAY: {
            equals: common.equals,
            second: common.second,
            minute: common.minute,
            hour: common.hour,
            am_pm: 'AM_PM'
        },
        EMAIL_ADDRESS: {
            equals: common.equals,
            name: 'BYNAME',
            domain: 'BYDOMAIN',
            domain_topLevel: 'BYTOPDOMAIN'
        },
        NUMERIC: {
            equals: common.equals,
            value: 'BYVALUE',
            range: 'BYINTRANGE',
            thousandth: 'BYTHOUSANDS',
            hundredth: 'BYHUNDREDTHS',
            tenth: 'BYTENTHS',
            one: 'BY1',
            five: 'BY5',
            ten: 'BY10',
            hundred: 'BY100',
            one_k: 'BY1000',
            ten_k: 'BY10000',
            hundred_k: 'BY100000',
            million: 'BY1000000'
        },
        TEXT: {
            equals: common.equals,
            firstLetter: common.firstLetter,
            firstWord: common.firstWord
        },
        USER: {
            equals: common.equals,
            firstLetter: common.firstLetter,
            firstWord: common.firstWord
        }
    });

    module.exports = {
        COMMON: common,
        GROUP_TYPE: groups
    };

}());


