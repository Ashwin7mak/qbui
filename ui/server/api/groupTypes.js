(function() {
    'use strict';

    let COMMON = {
        equals: 'V',
        firstLetter: 'F',
        firstWord: 'I',
        day: 'D',
        week: 'W',
        hour: 'h',
        minute: 'm',
        second: 's'
    };

    module.exports = Object.freeze({
        delimiter: ',',
        DATE: {
            equals: COMMON.equals,
            day: COMMON.day,
            week: COMMON.week,
            month: 'M',
            year: 'Y',
            quarter: 'Q',
            fiscalQuarter: 'U',
            fiscalYear: 'FY',
            decade: 'T'
        },
        DURATION: {
            equals: COMMON.equals,
            second: COMMON.second,
            minute: COMMON.minute,
            hour: COMMON.hour,
            week: COMMON.week,
            day: COMMON.day
        },
        TIME_OF_DAY: {
            equals: COMMON.equals,
            second: COMMON.second,
            minute: COMMON.minute,
            hour: COMMON.hour,
            am_pm: 'a'
        },
        EMAIL_ADDRESS: {
            equals: COMMON.equals,
            name: 'N',
            domain: 'O',
            domain_topLevel: 'C'
        },
        NUMERIC: {
            equals: COMMON.equals,
            range: 'R',
            thousandth: 'K',
            hundredth: 'H',
            tenth: 'A',
            one: '0',
            five: 'B',
            ten: '1',
            hundred: '2',
            one_k: '3',
            ten_k: '4',
            hundred_k: '5',
            million: '6'
        },
        TEXT: {
            equals: COMMON.equals,
            firstLetter: COMMON.firstLetter,
            firstWord: COMMON.firstWord
        },
        USER: {
            equals: COMMON.equals,
            firstLetter: COMMON.firstLetter,
            firstWord: COMMON.firstWord
        }
    });
}());


