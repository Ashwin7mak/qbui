/**
 * Generate a task with a random name, url, phone
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    let phraseMaker = require('./phrases');
    let statuses = ['No Started', 'In Progress',  'Verifying', 'Complete'];


    chance.mixin({
        taskName:function(options) {
            return phraseMaker.genPhrase(options)[0];
        },

        task: function(options) {
            let taskId = chance.hash({length:12});
            let name = options && options.name ? options.name : chance.taskName(options);
            let projectName = options && options.projectName ? options.projectName : '';
            let status = options && options.status ? options.status : chance.pick(statuses);
            return {
                name,
                taskId,
                projectName,
                status
            };
        }
    });

    const fidToProp = {
        6 : 'name',
        7 : 'taskId',
        8 : 'projectName',
        9 : 'status',
    };

    const propToFid = {
        'name' : 6,
        'taskId' : 7,
        'projectName' : 8,
        'status' : 9,
    };

    let api = {
        init :()=>{},
        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },
        getFidFromProp : function(prop) {
            return propToFid[prop];
        },
        addSchemaFields: function(tableToFieldToFieldTypeMap, tableTasksName, addColumn) {
            tableToFieldToFieldTypeMap[tableTasksName] = {};
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Name');
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Task Id', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Project');
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Status');
        },

    };
    return api;
};
