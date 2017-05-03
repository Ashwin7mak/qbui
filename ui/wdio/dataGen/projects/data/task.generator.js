/**
 * Generate a task with a random name, url, phone
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    let DEFAULT_NUM_TASKS = 10;
    let phraseMaker = require('./phrases');
    let statuses = ['No Started', 'In Progress', 'Blocked', 'Verifying', 'Complete'];
    function init() {
    }
    chance.mixin({
        taskName:function(options) {
            return phraseMaker.genPhrase(options)[0];
        },
        task: function(options) {

            let name = options && options.name ? options.name : chance.taskName(options);
            let projectName = options && options.projectName ? options.projectName : '';
            let assignee = options && options.assignee ? options.assignee : '';
            let status = options && options.status ? options.status : chance.pick(statuses);
            return {
                name,
                projectName,
                assignee,
                status
            };
        }
    });

    const fidToProp = {
        6 : 'name',
        7 : 'projectName',
        8 : 'assignee',
        9 : 'status',
    };

    const propToFid = {
        'name' : 6,
        'projectName' : 7,
        'assignee' : 8,
        'status' : 9,
    };

    let api = {
        init,
        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },
        getFidFromProp : function(prop) {
            return propToFid[prop];
        },
        addSchemaFields: function(tableToFieldToFieldTypeMap, tableTasksName, addColumn) {
            tableToFieldToFieldTypeMap[tableTasksName] = {};
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Name', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Project');
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Assignee');
            addColumn(tableToFieldToFieldTypeMap[tableTasksName], e2eConsts.dataType.TEXT, 'Status');
        },
            /**
         * Generate a task with random properties
         * @param options
         * @returns {*}
         */
        taskToJson: function(task) {
            return JSON.stringify(task);
        },

        /**
         * Generate a task with random properties
         * @param options
         * @returns {*}
         */
        generateTask: function() {
            return chance.task();
        },

        /**
         * Generate a task with certain fields populated with concrete values to generate contrived situations
         * </p>
         * Available options are:
         * {
         *  name: <name>
         *  startDate: <startDate>
         *  budget: <budget>
         *  project <projectName>
         * }
         * </p>
         * These options may be sparsely populated and we will generate values for those keys not present.
         * @param options
         * @returns {*}
         */
        generatePopulatedTask: function(options) {
            return chance.task(options);
        },


        /**
         * Generate X number of tasks
         * </p>
         * @returns {*}
         */
        generateDefaultAdminUsers: function(numberOfTasks) {
            let taskResultList = [];

            if (numberOfTasks === undefined) {
                numberOfTasks = DEFAULT_NUM_TASKS;
            }
            Array(numberOfTasks).fill().map((_, i) => {
                taskResultList.push(this.generateTask());
            });
            return taskResultList;
        }
    };
    return api;
};
