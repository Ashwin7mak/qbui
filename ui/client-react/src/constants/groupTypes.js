
let COMMON = {
    equals: 'V',
    firstLetter: 'F',
    firstWord: 'I',
    day: 'D',
    week: 'W'
};

export const GROUP_TYPE = {

    date: {
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
    duration: {
        equals: COMMON.equals,
        second: 's',
        minute: 'm',
        hour: 'h',
        am_pm: 'a',
        week: COMMON.week,
        day: COMMON.day
    },
    email: {
        equals: COMMON.equals,
        name: 'N',
        domain: 'O',
        domain_topLevel: 'C'
    },
    numeric: {
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
    text: {
        equals: COMMON.equals,
        firstLetter: COMMON.firstLetter,
        firstWord: COMMON.firstWord
    },
    user: {
        equals: COMMON.equals,
        firstLetter: COMMON.firstLetter,
        firstWord: COMMON.firstWord
    }
};

export const SUMMARY_TYPE = {
    show: 'show',
    hide: 'hide',
    only: 'only'
};
