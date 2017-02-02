import * as types from '../actions/types';

// mock data
const switches = [
    {
        id: 1,
        name: 'Feature A',
        team: 'Team with no name',
        description: 'My first feature switch',
        defaultOn: true
    },
    {
        id: 2,
        name: 'Feature B',
        team: 'Jade Empier',
        description: 'Another feature switch',
        defaultOn: false
    }
];

const exceptions = [
    {
        id: 1,
        entityType: 'realm',
        entityValue: '123',
        on: true
    },
    {
        id: 1,
        entityType: 'app',
        entityValue: 'ksdfjsldkf',
        on: false
    }
];

export const setSwitches = () => {
    return {
        type: types.SET_FEATURE_SWITCHES,
        switches: switches
    };
};

export const setExceptions = () => {
    return {
        type: types.SET_FEATURE_SWITCH_EXCEPTIONS,
        exceptions: exceptions
    };
};

export const setStatuses = () => {
    return {
        type: types.SET_FEATURE_SWITCH_STATUSES,
        statuses: []
    };
};

