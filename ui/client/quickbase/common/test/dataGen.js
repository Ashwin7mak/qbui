(function() {
    'use strict';

    // Instantiate chancejs so it can be used here
    //see http://chancejs.com lightweight generator
    var chance = new Chance(12345); //seed value makes random tests repeatable

    /**
     * This service provides test grid data
     **/
    angular.module('test.dataGeneratorService', ['ngLodash', 'qbse.api'])
        .factory('TestDataService', ['$q', 'lodash', 'apiConstants', TestDataService]);

    //todo expend this service to generate data for grid
    //service to supply data and column given fixed values
    function TestDataService($q, _, apiConstants) {

        /** INTERNAL vars and helper methods **/
        // set up some example data for the grid
        var columnDefs = [{'name': 'name', 'displayName': 'Team'},
                          {'name': 'count', 'displayName': 'Size'}];
        var dataArray = [{'name': 'Indigo', 'count': 7}, {'name': 'Cyan', 'count': 5},
                         {'name': 'Agave', 'count': 8}];

        /**
         *  Creates create some columns appends to resultArray
         */
        function createColumns(numColumns, colsTypes, resultArray) {
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
         * Creates some rows appends to resultData
         */
        function createRows(numRows, colDesc, resultData) {
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

        // given some fix data and its column definitions
        // wrap in a service usable by qbse grid
        // allows for generic static data and dynamic data support in grid
        factory.makeService = function(data, cols) {
            return {
                getDataPromise: function() {
                    return $q.when(data);
                },
                getColumns    : function() {
                    return cols;
                },
                forDebug : {
                    _Data : data,
                    _Cols : cols
                }
            };
        };
        //return some known data in service
        factory.defaultData = function() {
            return this.makeService(dataArray, columnDefs);
        };
        //return the known default rows
        factory.defaultRows = function() {
            return dataArray;
        };

        //return the known default column defs
        factory.defaultColumns = function() {
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
        factory.configuredGridData = function(config) {
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

            return this.makeService(confData, confCols);


        };


        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         */
        factory.getRandomInt = function(min, max) {
            return chance.integer({min: min, max: max});
        };
        factory.chance = chance;
        return factory;
    }
})();
