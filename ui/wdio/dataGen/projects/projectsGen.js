/**
 * Generate Companies, Project, Tasks example data
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
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

    const tableCompaniesName = 'Companies';
    const tableProjectsName = 'Projects';
    const tableTasksName = 'Tasks';
    const tableCommentsName = 'Comments';
    const tablePeopleName = 'Employees';
    const tableAssignmentsName = 'Assignments';

    const defaultMinNumOfCompanies = 21;
    const defaultMaxNumOfCompanies = 21;
    const defaultMinNumOfPeople = 25;
    const defaultMaxNumOfPeople = 50;
    const defaultMinNumOfProjects = 2;
    const defaultMaxNumOfProjects = 4;
    const defaultMinNumOfTasks = 1;
    const defaultMaxNumOfTasks = 4;
    const defaultMinNumOfAssignees = 2;
    const defaultMaxNumOfAssignees = 2;
    const defaultMinNumOfComments = 1;
    const defaultMaxNumOfComments = 2;

    const minMaxToGen = {
        minCompany: defaultMinNumOfCompanies,
        maxCompany: defaultMaxNumOfCompanies,
        minProj: defaultMinNumOfProjects,
        maxProj: defaultMaxNumOfProjects,
        minPeople: defaultMinNumOfPeople,
        maxPeople: defaultMaxNumOfPeople,
        minTask: defaultMinNumOfTasks,
        maxTask: defaultMaxNumOfTasks,
        minAssignee: defaultMinNumOfAssignees,
        maxAssignee: defaultMaxNumOfAssignees,
        minComment: defaultMinNumOfComments,
        maxComment: defaultMaxNumOfComments,
    };

    const api = {

        genSchema: (tableToFieldToFieldTypeMap, addColumn) => {
            const baseTextClientRequiredProps = {
                width: 50,
                bold: false,
                word_wrap: false
            };
            const multiLineProps = {
                dataAttr: {
                    clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 6})
                }
            };

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

        minMaxToGen

    };
    return api;
};
