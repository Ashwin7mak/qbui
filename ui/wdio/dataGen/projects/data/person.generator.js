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
            weight : [0, 0, 1, 1, 10, 10, 10]},
        'R&D' : {name: ['Director', 'Manager', 'Architect', 'Principle Engineer', 'Sr Engineer',
            'XD', 'Visual Designer', 'Quality Engineer', 'Engineer'],
            weight : [0, 0, 1, 1, 4, 2, 2, 10, 20]},
        'Finance and Admin' :  {name: ['CEO', 'VP', 'Director', 'Manager', 'Billing Collector', 'Bookkeeper',
            'HR Specialist', 'Accounting Specialist', 'Legal Secretary', 'Office Manager', 'Payroll', 'Clerk', 'Admin'],
            weight : [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 20]},
        'Marketing' :  {name: ['Director', 'Manager',  'Webmaster', 'Events Planner',
            'Media Specialist',  'Marketing Specialist', 'Communications Specialist'],
            weight : [0, 0, 1, 1, 1, 10, 10]},
        'Sales' :  {name: ['Director', 'Regional Manager', 'Account Executive', 'Sales Representative'],
            weight : [0, 0, 10, 20]},
        'Customer Care' :  {name: ['Director', 'Manager', 'Account Executive', 'Support Representative'],
            weight : [0, 0, 2, 10]},
    };
    const companyCeos = {
        "Apple": {realCeo: "Tim Cook"},
        "Microsoft": {realCeo: "Satya Nadella"},
        "AT&T": {realCeo: "Randall L. Stephenson"},
        "Xerox": {realCeo: "Jeff Jacobson"},
        "Johnson & Johnson": {realCeo: "Alex Gorsky"},
        "J.Deere" : {realCeo: "Samuel R. Allen"},
        "Time": {realCeo: "Joseph A Ripp"},
        "Intuit": {realCeo: "Brad D. Smith"},
        "Quick Base": {realCeo: "Rick Willett"},
        "Walgreens": {realCeo: "Stefano Pessina"},
        "Black & Decker": {realCeo: "James M. Loree"},
        "Tesla": {realCeo: "Elon Musk"},
        "Ford": {realCeo: "Mark Fields"},
        "Staples": {realCeo: "Shira D. Goodman"},
        "Boeing": {realCeo: "Dennis Muilenburg"},
        "Intel": {realCeo: "Brian Krzanich"},
        "Motorola": {realCeo: "Gregory Q. Brown"},
        "FedEx": {realCeo: "Frederick W. Smith"},
        "Cisco": {realCeo: "Chuck Robbins"},
        "Rutoxio Energy": {realCeo: "John Doe"},
        "Gartner": {realCeo: "Eugene A. Hall"},
    };
    function init() {
        directors = [];
        managers = [];
        ceos = [];
    }
    function getDepartments(employees) {
        let uniqueDeps = _.unionBy(employees, 'department');
        return _.map(uniqueDeps, 'department');
    }
    function genManagers(options) {
        //get the departments from the options.employees
        let answer = [];
        if (options.employees) {
            let depts = getDepartments(options.employees);
            //create some managers for each department
            depts.forEach(department => {
                let title = titlesByDept[department].name.find(item => item.indexOf('Manager') !== -1);
                let dptManagers = chance.n(chance.person, chance.integer({min:2, max:4}), Object.assign(options, {department, title}));
                answer = answer.concat(dptManagers);
            });
        }
        managers = managers.concat(answer);
        return answer;
    }
    function genDirectors(options) {
        //get the departments from the options.employees
        let answer = [];
        if (options.employees) {
            let depts = getDepartments(options.employees);
            // for each department create a director
            // for F&A create CEO too
            depts.forEach(department => {
                let dptDirector = chance.n(chance.person,  chance.integer({min:1, max:2}), Object.assign(options, {department, title:'Director'}));
                answer = answer.concat(dptDirector);
                directors = directors.concat(dptDirector);
                let VP = chance.person(Object.assign(options, {department, title:'VP'}));
                answer = answer.concat(VP);
                directors = directors.concat(VP);
            });
            let department = 'Finance and Admin';
            let VP = chance.person(Object.assign(options, {department, title:'VP'}));
            answer = answer.concat(VP);
            directors = directors.concat(VP);
            let CEO = chance.person(Object.assign(options, {department, title:'CEO'}));
            answer = answer.concat(CEO);
            ceos = ceos.concat(CEO);
        }
        return answer;

    }

    function addSchemaFields(tableToFieldToFieldTypeMap, tablePeopleName, addColumn) {
        tableToFieldToFieldTypeMap[tablePeopleName] = {};
        addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Full Name', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Title');
        addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.DATE, 'Birthday');
        addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Department');
        addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Manager');
        addColumn(tableToFieldToFieldTypeMap[tablePeopleName], e2eConsts.dataType.TEXT, 'Company');
    }


    function getManager(person) {
        let answer;
        if (isNonMgt(person.title)) {
            answer = chance.pickone(managers.filter(leader => leader.department === person.department)).fullName;
        } else if (isManager(person.title)) {
            answer = chance.pickone(directors.filter(leader => leader.department === person.department)).fullName;
        } else if (isDirector(person.title)) {
            answer = chance.pickone(ceos).fullName;
        } else {
            answer = person.fullName;
        }

        return answer;
    }

    function isManager(title) {
        return (title.indexOf('Manager') !== -1);
    }

    function isDirector(title) {
        return (title === 'Director' || title === 'VP');
    }

    function isCEO(title) {
        return (title === 'CEO');
    }

    function isNonMgt(title) {
        return  (!isDirector(title) && !isManager(title) && !isCEO(title));
    }

    function getUniqueName(options) {
        let answer = chance.name(options);
        while (persons[answer] !== undefined) {
            answer = chance.name(options);
        }
        return answer;
    }

    function getRealCEO(companyName) {
        if (_.has(companyCeos, companyName + '.realCeo')) {
            return _.get(companyCeos, companyName + '.realCeo');
        } else {
            return getUniqueName();
        }
    }

    chance.mixin({
        uniqueName: function(options) {
            return getUniqueName(options);
        },
        person: function(options) {
            let fullName = options && options.fullName ? options.fullName : chance.uniqueName(options);
            let birthday = options && options.birthday ? options.birthday : rawValueGenerator.generateDate({year: chance.integer(BDAY_YEAR_RANGE)});
            let department = options && options.department ? options.department : chance.department();
            let dptTitle  = titlesByDept[department];
            let title = options && options.title ? options.title : chance.weighted(dptTitle.name, dptTitle.weight);
            let companyName = options && options.companyName ? options.companyName : '';
            let manager = options && options.manager ? options.manager : '';

            if (isCEO(title)) {
                let ceoName = getRealCEO(companyName);
                if (ceoName) {
                    fullName = ceoName;
                }
            }

            let newPerson = {
                fullName,
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
            persons[fullName] = newPerson;
            return newPerson;
        }
    });


    const fidToProp = {
        6 : 'fullName',
        7 : 'title',
        8 : 'birthday',
        9 : 'department',
        10 : 'manager',
        11 : 'companyName',
    };
    const propToFid = {
        'fullName' : 6,
        'title' : 7,
        'birthday' : 8,
        'department' : 9,
        'manager' : 10,
        'companyName' : 11,
    };

    let api = {
        init,
        genManagers,
        genDirectors,
        getManager,

        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },
        getFidFromProp : function(prop) {
            return propToFid[prop];
        },
        addSchemaFields,

        getPerson : function(fullName) {
            return persons[fullName];
        },

    };
    return api;
};
