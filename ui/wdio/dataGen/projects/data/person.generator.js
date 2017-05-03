/**
 * Generate a person with a random name, url, phone
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    const _ = require('lodash');
    const DEFAULT_NUM_PERSONS = 10;
    const BDAY_YEAR_RANGE = {min:1940, max:2000};
    const rawValueGenerator = require('../../../../test_generators/rawValue.generator');
    let persons = {};
    let directors = [];
    let managers = [];
    let ceos = [];
    let titlesByDept = {
        'Ops' : {name: ['Director', 'Manager', 'Network Admin', 'System Admin', 'Sr Application Operations Engineer',
            'Application Operations Engineer', 'IT Support'],
            weight : [1, 5, 1, 1, 10, 10, 10]},
        'R&D' : {name: ['Director', 'Manager', 'Architect', 'Principle Engineer', 'Sr Engineer',
            'XD', 'Visual Designer', 'Quality Engineer', 'Engineer'],
            weight : [1, 5, 1, 1, 4, 2, 2, 10, 20]},
        'Finance and Admin' :  {name: ['CEO', 'VP', 'Director', 'Manager', 'Billing Collector', 'Bookkeeper',
            'HR Specialist', 'Accounting Specialist', 'Legal Secretary', 'Office Manager', 'Payroll', 'Clerk', 'Admin'],
            weight : [1, 1, 1, 5, 1, 2, 2, 2, 2, 2, 2, 2, 20]},
        'Marketing' :  {name: ['Director', 'Manager',  'Webmaster', 'Events Planner',
            'Media Specialist',  'Marketing Specialist', 'Communications Specialist'],
            weight : [1, 5, 1, 1, 1, 10, 10]},
        'Sales' :  {name: ['Director', 'Regional Manager', 'Account Executive', 'Sales Representative'],
            weight : [1, 5, 10, 20]},
        'Customer Care' :  {name: ['Director', 'Manager', 'Account Executive', 'Support Representative'],
            weight : [1, 5, 2, 10]},
    };

    function init() {
        persons = {};
        directors = [];
        managers = [];
        ceos = [];
    }
    function isManager(title) {
        return (title.indexOf('Manager') !== -1);
    }

    function isDirector(title) {
        return (title === 'Director');
    }

    function isCEO(title) {
        return (title === 'CEO');
    }

    function isNonMgt(title) {
        return  (!isDirector(title) && !isManager(title) && !isCEO(title));
    }

    chance.mixin({
        uniqueName: function(options) {
            let answer = chance.name(options);
            while (persons[answer] !== undefined) {
                answer = chance.name(options);
            }
            return answer;
        },
        person: function(options) {
            let fullname = options && options.fullname ? options.fullname : chance.uniqueName(options);
            let birthday = options && options.birthday ? options.birthday : rawValueGenerator.generateDate({year: chance.integer(BDAY_YEAR_RANGE)});
            let department = options && options.department ? options.department : chance.department();
            let dptTitle  = titlesByDept[department];
            let title = options && options.title ? options.title : chance.weighted(dptTitle.name, dptTitle.weight);
            let companyName = options && options.companyName ? options.companyName : '';
            let manager = options && options.manager ? options.manager : '';


            let newPerson = {
                fullname,
                title,
                birthday,
                department,
                manager,
                companyName,
            };
            if (isDirector(title)) {
                directors.push(newPerson);
            }
            if (isManager(title)) {
                managers.push(newPerson);
            }
            if (isCEO(title)) {
                ceos.push(newPerson);
            }
            persons[fullname] = newPerson;
            return newPerson;
        }
    });


    const fidToProp = {
        6 : 'fullname',
        7 : 'title',
        8 : 'birthday',
        9 : 'department',
        10 : 'manager',
        11 : 'companyName',
    };
    const propToFid = {
        'fullname' : 6,
        'title' : 7,
        'birthday' : 8,
        'department' : 9,
        'manager' : 10,
        'companyName' : 11,
    };

    let api = {
        init,

        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },
        getFidFromProp : function(prop) {
            return propToFid[prop];
        },

        addSchemaFields: function(tableToFieldToFieldTypeMap, tablePeopleName, addColumn) {
            tableToFieldToFieldTypeMap[tablePeopleName] = {};
            addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Full Name', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Title');
            addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.DATE, 'Birthday');
            addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Department');
            addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Manager');
            addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Company');
        },
            /**
         * Generate a person with random properties
         * @param options
         * @returns {*}
         */
        personToJson: function(person) {
            return JSON.stringify(person);
        },

        getPerson : function(fullName) {
            return persons[fullname];
        },

        getManager : function(person) {
            if (isNonMgt(person.title)) {
                return  _.pick(managers).fullname;
            } else if (isManager(person.title)) {
                return _.pick(directors).fullname;
            } else if (isDirector(person.title)) {
                return _.pick(ceos).fullname;
            }
        }
    };
    return api;
};
