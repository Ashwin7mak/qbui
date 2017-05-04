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
    const commentGen = require('./data/comment.generator.js')(chance);
    const peopleGen = require('./data/person.generator.js')(chance);
    const assignmentGen = require('./data/assignments.generator.js')(chance);

    const baseTextClientRequiredProps = {
        width: 50,
        bold: false,
        word_wrap: false
    };

    const tableCompaniesName = 'Companies';
    const tableProjectsName = 'Projects';
    const tableTasksName = 'Tasks';
    const tableCommentsName = 'Comments';
    const tablePeopleName = 'Employees';
    const tableAssignmentsName = 'Assignments';

    // const defaultMinNumOfPeople = 22;
    // const defaultMaxNumOfPeople = 200;
    // const defaultMinNumOfCompanies = 5;
    // const defaultMaxNumOfCompanies = 21;
    // const defaultMinNumOfProjects = 10;
    // const defaultMaxNumOfProjects = 20;
    // const defaultMinNumOfTasks = 4;
    // const defaultMaxNumOfTasks = 10;
    // const defaultMinNumOfComments = 4;
    // const defaultMaxNumOfComments = 10;
    // const defaultMinNumOfAssignees = 4;
    // const defaultMaxNumOfAssignees = 10;
    //
    const defaultMinNumOfPeople = 10;
    const defaultMaxNumOfPeople = 40;
    const defaultMinNumOfCompanies = 1;
    const defaultMaxNumOfCompanies = 3;
    const defaultMinNumOfProjects = 4;
    const defaultMaxNumOfProjects = 6;
    const defaultMinNumOfTasks = 4;
    const defaultMaxNumOfTasks = 10;
    const defaultMinNumOfAssignees = 1;
    const defaultMaxNumOfAssignees = 7;
    const defaultMinNumOfComments = 3;
    const defaultMaxNumOfComments = 10;

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
            //Assignments
            assignmentGen.addSchemaFields(tableToFieldToFieldTypeMap, tableAssignmentsName, addColumn);
            //Comments
            commentGen.addSchemaFields(tableToFieldToFieldTypeMap, tableCommentsName, addColumn);

            return (tableToFieldToFieldTypeMap);
        },

        tableCompaniesName,
        tableProjectsName,
        tableTasksName,
        tablePeopleName,
        tableAssignmentsName,
        tableCommentsName,

        defaultMinNumOfProjects,
        defaultMaxNumOfProjects,
        defaultMinNumOfTasks,
        defaultMaxNumOfTasks,
        defaultMinNumOfPeople,
        defaultMaxNumOfPeople,
        defaultMinNumOfCompanies,
        defaultMaxNumOfCompanies,
        defaultMinNumOfAssignees,
        defaultMaxNumOfAssignees,
        defaultMinNumOfComments,
        defaultMaxNumOfComments,


        companyGen,
        initCompanies: companyGen.init,
        genCompanies : (opts, num = defaultMinNumOfCompanies) => chance.n(chance.company, num, opts),
        getCompanyPropFromFid : companyGen.getPropFromFid,
        getCompanyFid : companyGen.getFidFromProp,

        peopleGen,
        initPeople: peopleGen.init,
        genPeople: (opts, num = defaultMinNumOfPeople) => chance.n(chance.person, num, opts),
        getPeoplePropFromFid : peopleGen.getPropFromFid,
        getPeopleFid : peopleGen.getFidFromProp,
        genManagers: peopleGen.genManagers,
        genDirectors: peopleGen.genDirectors,
        getManager: peopleGen.getManager,

        projectGen,
        initProjects: projectGen.init,
        genProjects : (opts, num = defaultMinNumOfProjects) => chance.n(chance.project, num, opts),
        getProjectPropFromFid : projectGen.getPropFromFid,
        getProjectFid : projectGen.getFidFromProp,

        taskGen,
        initTasks: taskGen.init,
        genTasks : (opts, num = defaultMinNumOfTasks) => chance.n(chance.task, num, opts),
        getTaskPropFromFid : taskGen.getPropFromFid,
        getTaskFid : taskGen.getFidFromProp,

        assignmentGen,
        initAssignees: taskGen.init,
        genAssignees : (opts, num = defaultMinNumOfAssignees) => chance.n(chance.assignment, num, opts),
        getAssigneePropFromFid : assignmentGen.getPropFromFid,
        getAssigneeFid : assignmentGen.getFidFromProp,

        commentGen,
        initComments: commentGen.init,
        genComments : (opts, num = defaultMinNumOfComments) => chance.n(chance.comment, num, opts),
        getCommentPropFromFid : commentGen.getPropFromFid,
        getCommentFid : commentGen.getFidFromProp,

    };
    return api;
};
