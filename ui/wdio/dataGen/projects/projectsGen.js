/**
 * Generate Companies, Project, Tasks example data
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    const e2eConsts = require('../../common/e2eConsts');
    const departments = ['Ops', 'R&D', 'Finance and Admin', 'Marketing', 'Sales', 'Customer Care'];
    chance.mixin({
        department: function() {
            return chance.pickone(departments);
        }
    });
    const companyGen = require('./data/company.generator.js')(chance);
    const projectGen = require('./data/project.generator.js')(chance);
    const taskGen = require('./data/task.generator.js')(chance);
    const peopleGen = require('./data/person.generator.js')(chance);

    const baseTextClientRequiredProps = {
        width: 50,
        bold: false,
        word_wrap: false
    };

    const tableCompaniesName = 'Companies';
    const tableProjectsName = 'Projects';
    const tableTasksName = 'Tasks';
    const tablePeopleName = 'Employees';

    // const defaultMinNumOfPeople = 22;
    // const defaultMaxNumOfPeople = 200;
    // const defaultMinNumOfCompanies = 5;
    // const defaultMaxNumOfCompanies = 21;
    // const defaultMinNumOfProjects = 10;
    // const defaultMaxNumOfProjects = 20;
    // const defaultMinNumOfTasks = 4;
    // const defaultMaxNumOfTasks = 10;
    //
    const defaultMinNumOfPeople = 2;
    const defaultMaxNumOfPeople = 7;
    const defaultMinNumOfCompanies = 12;
    const defaultMaxNumOfCompanies = 15;
    const defaultMinNumOfProjects = 12;
    const defaultMaxNumOfProjects = 36;
    const defaultMinNumOfTasks = 21;
    const defaultMaxNumOfTasks = 40;

    const api = {

        genSchema: (tableToFieldToFieldTypeMap, addColumn) => {
            const multiLineProps = {dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 6})}};
            //Company
            companyGen.addSchemaFields(tableToFieldToFieldTypeMap, tableCompaniesName, addColumn);
            //Project
            projectGen.addSchemaFields(tableToFieldToFieldTypeMap, tableProjectsName, addColumn, multiLineProps);
            //Task
            taskGen.addSchemaFields(tableToFieldToFieldTypeMap, tableTasksName, addColumn);
            //People
            peopleGen.addSchemaFields(tableToFieldToFieldTypeMap, tablePeopleName, addColumn);
            return (tableToFieldToFieldTypeMap);
        },

        tableCompaniesName,
        tableProjectsName,
        tableTasksName,
        tablePeopleName,

        defaultMinNumOfProjects,
        defaultMaxNumOfProjects,
        defaultMinNumOfTasks,
        defaultMaxNumOfTasks,
        defaultMinNumOfPeople,
        defaultMaxNumOfPeople,
        defaultMinNumOfCompanies,
        defaultMaxNumOfCompanies,

        companyGen,
        peopleGen,
        projectGen,
        taskGen,

        initCompanies: companyGen.init,
        genCompanies : (opts, num = defaultMinNumOfCompanies) => chance.n(chance.company, num, Object.assign({full: true}, opts)),
        initPeople: peopleGen.init,
        genPeople: (opts, num = defaultMinNumOfPeople) => chance.n(chance.person, num, Object.assign({full: true}, opts)),
        initProjects: projectGen.init,
        genProjects : (opts, num = defaultMinNumOfProjects) => chance.n(chance.project, num, Object.assign({full: true}, opts)),
        initTasks: taskGen.init,
        genTasks : (opts, num = defaultMinNumOfTasks) => chance.n(chance.task, num, Object.assign({full: true}, opts)),
        getManager: peopleGen.getManager,

        getCompanyPropFromFid : companyGen.getPropFromFid,
        getProjectPropFromFid : projectGen.getPropFromFid,
        getTaskPropFromFid : taskGen.getPropFromFid,
        getPeoplePropFromFid : peopleGen.getPropFromFid,

        getCompanyFid : companyGen.getFidFromProp,
        getProjectFid : projectGen.getFidFromProp,
        getTaskFid : taskGen.getFidFromProp,
        getPeopleFid : peopleGen.getFidFromProp,

    };
    return api;
};
