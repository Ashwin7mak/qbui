/* eslint-disable babel/no-invalid-this */
/**
 * Generate Companies, Project, Tasks example data
 * Created by Claire on April 25, 2017.
 */
module.exports = function(e2eBase, chance) {
    'use strict';
    const _ = require('lodash');
    const promise = require('bluebird');
    const log = require('../../../server/src/logger').getLogger();
    let projGen;

    function init(projGenInput) {
        projGen = projGenInput;
    }

    function getTable(app, name) {
        return _.find(app.tables, {'name': name});
    }

    function makeRecordsInput(app, tableName, objToFidMapper, arrayOfObjs) {
        let table = getTable(app, tableName);
        if (table) {
            // Get the appropriate fields out of the table
            let nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(table);

            // Generate the record JSON objects
            let generatedRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, arrayOfObjs.length);
            e2eBase.recordService.editRecordsWithFieldsCallback(generatedRecords, (field, recordIndex) => {
                let objKey = objToFidMapper(field.id);
                return objKey ? arrayOfObjs[recordIndex][objKey] : undefined;
            });
            return generatedRecords;
        }
        return [];
    }

    function addBulkRecords(app, tableName, table, records) {
        if (app && table) {
            log.debug('adding ' + records.length + ' records to ' + tableName);
            return e2eBase.recordService.addBulkRecords(app, table, records);
        } else {
            return promise.resolve();
        }
    }


    const genAndSetupCommentRecords = function(assignment, project, createdApp, minMaxToGen, projPromises) {

        //create a set of comments for an assignment
        let  {minComment, maxComment} = minMaxToGen;
        const commentsTable = getTable(createdApp, projGen.tableCommentsName);
        if (commentsTable) {
            const comments = projGen.genComments({
                topicId: assignment.assignmentId,
                authors: [assignment.assigneeName, project.projectLeader]
            }, chance.integer({min: minComment, max: maxComment}));

            // make records input for the comments for the assignment
            let commentRecords = makeRecordsInput(createdApp, projGen.tableCommentsName, projGen.getCommentPropFromFid, comments);
            return commentRecords;
        }
    };


    const genAndSetupAssignmentRecords = function(tasks, project, everyone, company, createdApp, minMaxToGen, projPromises) {

        //create a set of assignments for each task
        let {minAssignee, maxAssignee} = minMaxToGen;

        let commentRecs = [];
        let assignmentRecs = [];
        tasks.forEach(task => {
            const assignees = projGen.genAssignees({
                taskName: task.name,
                taskId: task.taskId,
                peopleList: everyone.filter(they => they.department === project.department),
                department: project.department, projectName: project.name, companyName: company.name
            },
                chance.integer({min: minAssignee, max: maxAssignee}));

            //add some comments for the assignments progress
            assignees.forEach(assignment => {
                let moreCommentRecs = genAndSetupCommentRecords(assignment, project, createdApp, minMaxToGen, projPromises);
                commentRecs = commentRecs.concat(moreCommentRecs);
            });

            // make records input for the assignees for the task
            let moreAssigneeRecords = makeRecordsInput(createdApp, projGen.tableAssignmentsName, projGen.getAssigneePropFromFid, assignees);
            assignmentRecs = assignmentRecs.concat(moreAssigneeRecords);
        });
        if (commentRecs && commentRecs.length) {
            projPromises.push(function() {
                return addBulkRecords(createdApp, projGen.tableCommentsName,
                    getTable(createdApp, projGen.tableCommentsName), commentRecs);
            });
        }
        if (assignmentRecs && assignmentRecs.length) {
            projPromises.push(function() {
                return addBulkRecords(createdApp, projGen.tableAssignmentsName,
                    getTable(createdApp, projGen.tableAssignmentsName), assignmentRecs);
            });
        }
    };

    const genAndSetupTaskRecords = function(project, everyone, company, createdApp, minMaxToGen, projPromises) {

        let {minTask, maxTask} = minMaxToGen;
        // create a set of tasks for the project with assignee from employee list
        projGen.initTasks(everyone);

        const tasks = projGen.genTasks({
            projectName: project.name,
            dict: {num: chance.integer({min: 0, max: 2})}
        }, chance.integer({min: minTask, max: maxTask}));

        //create a set of assignments for each task
        const assignmentsTable = getTable(createdApp, projGen.tableAssignmentsName);
        if (assignmentsTable) {
            genAndSetupAssignmentRecords(tasks, project, everyone, company, createdApp, minMaxToGen, projPromises);
        }

        // make records input for the tasks for the project
        return  makeRecordsInput(createdApp, projGen.tableTasksName, projGen.getTaskPropFromFid, tasks);

    };

    const getAndSetupProjectRecords = function(company, peopleSets, createdApp, minMaxToGen, projPromises) {
        let {departmentsWithEmployees, managers, directors, everyone} = peopleSets;
        // create a set projects for the current company
        projGen.initProjects();
        const projects = projGen.genProjects({
            companyName: company.name,
            availableDepts: departmentsWithEmployees
        }, chance.integer({min: minMaxToGen.minProj, max: minMaxToGen.maxProj}));

        //create tasks for each project
        let taskRecs = [];
        const tasksTable = getTable(createdApp, projGen.tableTasksName);
        projects.forEach((project) => {
            //assign a leader to the project
            project.projectLeader = chance.pickone(managers.concat(directors)).fullName;
            if (tasksTable) {
                let moreTasks = genAndSetupTaskRecords(project, everyone, company, createdApp, minMaxToGen, projPromises);
                taskRecs = taskRecs.concat(moreTasks);
            }
        });

        if (taskRecs && taskRecs.length) {
            projPromises.push(function() {
                return addBulkRecords(createdApp, projGen.tableTasksName, getTable(createdApp, projGen.tableTasksName), taskRecs);
            });
        }

        let projectRecords = makeRecordsInput(createdApp, projGen.tableProjectsName, projGen.getProjectPropFromFid, projects);
        projPromises.push(function() {
            return addBulkRecords(createdApp, projGen.tableProjectsName, getTable(createdApp, projGen.tableProjectsName), projectRecords);
        });
    };


    const genAndSetupEmployeeRecords = function(company, createdApp, {minPeople, maxPeople}, projPromises) {
        // create a list of employees with this current company
        projGen.initPeople();
        let employees = projGen.genPeople({companyName: company.name}, chance.integer({min: minPeople, max: maxPeople}));
        let managers = projGen.genManagers({companyName: company.name, employees});
        let directors = projGen.genDirectors({companyName: company.name, employees}, chance.integer({min: 1, max: 4}));
        let everyone = employees.concat(managers, directors);

        // set a manager for everyone
        everyone.forEach(person => {
            let mgr = projGen.getManager(person);
            if (mgr !== undefined) {
                person.manager = mgr;
            }
        });

        let departmentsWithEmployees = _.map(_.unionBy(everyone, 'department'), 'department');

        // make records input for the employees for the company
        let employeeRecords = makeRecordsInput(createdApp, projGen.tablePeopleName, projGen.getPeoplePropFromFid, everyone);
        if (employeeRecords && employeeRecords.length) {
            projPromises.push(function() {
                return addBulkRecords(createdApp, projGen.tablePeopleName, getTable(createdApp, projGen.tablePeopleName), employeeRecords);
            });
        }
        return {managers, directors, everyone, departmentsWithEmployees};
    };


    const api = {
        init,
        getTable,
        makeRecordsInput,
        addBulkRecords,
        getAndSetupProjectRecords,
        genAndSetupEmployeeRecords,
        genAndSetupTaskRecords,
        genAndSetupCommentRecords,
    };
    return api;
};

