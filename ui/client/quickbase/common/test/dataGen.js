(function() {
    'use strict';

    /**
     * This service provides test grid data
     **/
    angular.module('test.dataGeneratorService', ['ngLodash', 'qbse.api', 'qbse.grid'])
        .factory('TestDataService', ['$q', 'lodash', 'apiConstants', 'gridConstants', TestDataService]);

    //service to supply data and column given fixed values
    function TestDataService($q, _, apiConstants, gridConstants) {

        /** INTERNAL vars and helper methods **/
        // set up some example data for the grid
        var columnDefs = [{'name': 'name', 'displayName': 'Team', 'fieldType':apiConstants.CURRENCY},
                          {'name': 'count', 'displayName': 'Size', 'fieldType':apiConstants.TEXT},
                          {'name': 'focus', 'displayName': 'Focus'}];
        var dataArray = [{'name': 'Indigo', 'count': 7, 'focus': 'UI'},
                         {'name': 'Cyan', 'count': 5, 'focus':'Migration'},
                         {'name': 'Agave', 'count': 8, 'focus':'AWS'}];

        /**
         *  Creates some random column data and add to the resultArray(argument) array
         */
        function createColumns(chance, numColumns, colsTypes, resultArray) {
            for (var i = 0; i <numColumns; i++) {
                // get a field type from possible specified field types
                var findex = chance.integer({min: 0, max: colsTypes.length - 1});
                var type = colsTypes[findex];
                // give field a random name
                var name = chance.word();
                // populate the field column definition
                var field = {
                    fieldType  : type,
                    name       : name,
                    displayName: chance.capitalize(name)
                };
                resultArray.push(field);
            }
        }

        /**
         * Creates some random rows data and add to the resultData(argument) array
         */
        function createRows(chance, numRows, colDesc, resultData) {
            var numCols = colDesc.length;
            for (var i = 0; i < numRows; i++) {
                var row ={};
                for (var j = 0; j < numCols; j++) {
                    var value;
                    switch (colDesc[j].fieldType) {
                        case(apiConstants.TEXT) :
                            value = chance.string();
                            break;
                        case(apiConstants.NUMERIC) :
                            value = chance.integer({min: -200, max: 20000});
                            break;
                        case(apiConstants.PHONE_NUMBER) :
                            value = chance.phone();
                            break;
                        case(apiConstants.DATE) :
                            value = chance.date();
                            break;
                        case(apiConstants.DATE_TIME) :
                            value = chance.hammertime();
                            break;
                        case(apiConstants.EMAIL_ADDRESS) :
                            value = chance.email();
                            break;
                        case(apiConstants.CHECKBOX) :
                            value = chance.bool();
                            break;
                        case(apiConstants.CURRENCY) :
                            value = chance.dollar();
                            break;
                    }
                    row[colDesc[j].name] = value;
                }
                resultData.push(row);
            }
        }


        /** Construct the Public api of this factory **/

        var factory = {};

        factory.dataGridReportService = function(requestType) {
            if (requestType === gridConstants.SERVICE_REQ.DATA) {
                return $q.when(dataArray);
            }
            else
            if (requestType === gridConstants.SERVICE_REQ.COLS) {
                return $q.when(columnDefs);
            }
            else {
                return $q.when(dataArray);
            }

        };

        factory.setDataArray = function(data) {
            dataArray = data;
        };

        factory.setColumnsDefs = function(columns) {
            columnDefs = columns;
        };

        factory.getDataArray = function() {
            return dataArray;
        };

        factory.getColumnsDefs = function() {
            return columnDefs;
        };


        /**
         * Returns a data service that conforms to the configuration specified
         * config options are
         *      numRows - default 1000, how many records to return (prob needs limit)
         *      numColumns - default 5, this are the cols that would be rendered in grid
         *      numUnRenderedColumns default 0, how may columns extra you want in the data that wont be rendered
         *      columnsTypesToInclude - default text/numeric - array of field types you want
         *      columnTypesToExclude - default text/numeric - array of field types you want to exclude*
         */
        factory.setConfiguredGridData = function(config) {
            //config #records, #columns, columnsTypesToInclude[] columnTypesToExclude[]
            if (config.numRows === undefined) {
                config.numRows = 1000;
            }
            if (config.numColumns === undefined) {
                config.numColumns = 5;
            }
            if (config.numUnRenderedColumns === undefined) {
                config.numUnRenderedColumns = 0;
            }
            if (config.columnsTypesToInclude === undefined || !config.columnsTypesToInclude.length) {
                config.columnsTypesToInclude = [apiConstants.TEXT, apiConstants.NUMERIC, apiConstants.PHONE_NUMBER,apiConstants.DATE,
                    apiConstants.DATE_TIME, apiConstants.EMAIL_ADDRESS, apiConstants.CHECKBOX, apiConstants.CURRENCY];
            }

            // make up some column defs
            var okFieldTypes = config.columnsTypesToInclude;
            if (config.columnTypesToExclude !== undefined) {
                okFieldTypes = _.difference(config.columnsTypesToInclude, config.columnTypesToExclude);
            }

            // columns to be displayed
            var confCols = [];
            createColumns(config.numColumns, okFieldTypes, confCols);

            // columns in the data
            var unRendCols = [];
            createColumns(config.numUnRenderedColumns, config.columnsTypesToInclude, unRendCols);

            // add some data
            var confData = [];
            createRows(config.numRows, _.union(confCols, unRendCols), confData);

            //  replace the default data array with the new column and data configuration
            this.setDataArray(confData);
            this.setColumnsDefs(confCols);

        };


        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         */
        factory.getRandomInt = function(chance, min, max) {
            return chance.integer({min: min, max: max});
        };

        return factory;
    }
})();
