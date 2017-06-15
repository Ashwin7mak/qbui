/**
 * Generate a assignment for a task and a set of names
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    const _ = require('lodash');
    chance.mixin({
        assignee: function(options) {
            if (options.peopleList) {
                return chance.pickone(options.peopleList).fullName;
            }
        },
        assignment: function(options) {
            let taskName = options && options.taskName ? options.taskName : '';
            let taskId = options && options.taskId ? options.taskId : '';
            let assignmentId = chance.hash({length:13});
            let assigneeName = options ? chance.assignee(options) : '';
            let department = options && options.department ? options.department : '';
            let projectName  = options && options.projectName ? options.projectName : '';
            let companyName = options && options.companyName ? options.companyName : '';


            let newAsssignment = {
                taskName,
                taskId,
                assignmentId,
                assigneeName,
                department,
                projectName,
                companyName,
            };
            return newAsssignment;
        }
    });


    const fidToProp = {
        6 : 'taskName',
        7 : 'taskId',
        8 : 'assignmentId',
        9 : 'assigneeName',
        10 : 'department',
        11 : 'projectName',
        12 : 'companyName',
    };
    const propToFid = {
        'taskName' : 6,
        'taskId' : 7,
        'assignmentId': 8,
        'assigneeName' : 9,
        'department' : 10,
        'projectName' : 11,
        'companyName' : 12,
    };

    let api = {
        init :() => {},

        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },
        getFidFromProp : function(prop) {
            return propToFid[prop];
        },
        addSchemaFields: function(tableToFieldToFieldTypeMap, tableAssignmentsName, addColumn) {
            //Assignments
            tableToFieldToFieldTypeMap[tableAssignmentsName] = {};
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Task Name');
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Task Id');
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Assignee Id', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Assignee');
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Department');
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Project');
            addColumn(tableToFieldToFieldTypeMap[tableAssignmentsName], e2eConsts.dataType.TEXT, 'Company');
        },


    };
    return api;
};
