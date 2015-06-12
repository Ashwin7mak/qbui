(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .factory('ReportModel', ReportManagerModel);

    ReportManagerModel.$inject = ['$q', 'ReportService', 'qbUtility'];

    function ReportManagerModel($q, ReportService, qbUtility) {

        return {
            /**
             * Return report meta data for a given appId, tableId and reportId
             *
             * @param appId
             * @param tableId
             * @param reportId
             * @returns {deferred.promise|{then, always}}
             */
            getMetaData: function (appId, tableId, reportId) {

                var d = new Date();
                d.setDate(d.getDate() - 1);

                var deferred = $q.defer();

                //  TODO: get metaData(company,snapshot date) of logged in customer -- jira: qbse-12508
                var metaData = {
                    appId: appId,
                    tableId: tableId,
                    reportId: reportId,
                    name: 'Report name ' + reportId,
                    description: 'Report description ' + reportId,
                    company: 'ABC Test Company',
                    snapshot: d.toLocaleString()
                };

                ReportService.getMetaData(appId, tableId, reportId).then(
                    function (data) {
                        //  get the report meta info
                        metaData.name = data.name;
                        metaData.description = data.description;

                        deferred.resolve(metaData);
                    },
                    function (resp) {
                        console.log('Error getting report information.  Status: ' + resp.status);
                        deferred.reject(resp);
                    }
                );

                return deferred.promise;

            },

            /**
             * Return report column data for a given appId, tableId and reportId
             *
             * @param appId
             * @param tableId
             * @param reportId
             * @returns {deferred.promise|{then, always}}
             */
            getColumnData: function (appId, tableId, reportId) {

                var deferred = $q.defer();

                ReportService.getReportFields(appId, tableId, reportId).then(
                    function (fields) {
                        //  process the fields
                        var cols = [];
                        var fieldMap = new qbUtility.map();

                        fields.forEach(function (field) {
                            fieldMap.put(field.id, field);
                        });

                        fieldMap.forEach(function (field, id) {
                            var column = {};
                            column.id = field.id || id;
                            column.name = field.name;
                            column.displayName = field.name;
                            column.fieldType = field.type;

                            column.bold = field.clientSideAttributes.bold;
                            column.width = field.clientSideAttributes.width;
                            if (column.width < 100) { column.width = 100; } // minimum 100px col width for reporting

                            cols.push(column);
                        });

                        deferred.resolve(cols);
                    },
                    function (resp) {
                        console.log('Error getting report information.  Status: ' + resp.status);
                        deferred.reject(resp);
                    }
                );

                return deferred.promise;

            },

            /**
             * Return report data for a given appId, tableId and reportId
             *
             * @param appId
             * @param tableId
             * @param reportId
             * @returns {deferred.promise|{then, always}}
             */
            getReportData: function (appId, tableId, reportId, offset, rows) {

                var deferred = $q.defer();

                ReportService.getReport(appId, tableId, reportId, offset, rows).then(
                    function (data) {
                        console.log('formatted report callback successful');

                        var fields = data.fields;
                        var records = data.records;
                        var reportData = [];
                        var fieldMap = new qbUtility.map();

                        if (fields && records) {
                            fields.forEach(function (field) {
                                fieldMap.put(field.id, field);
                            });

                            records.forEach(function (record) {
                                var columns = {};
                                record.forEach(function (column) {
                                    var fld = fieldMap.get(column.id);
                                    columns[fld.name] = column.display;
                                });
                                reportData.push(columns);

                            });
                        }
                        deferred.resolve(reportData);
                    },
                    function (resp) {
                        console.log('formatted report callback failure' + resp.status);
                        deferred.reject(resp);
                    }
                );


                return deferred.promise;
            }
        };

    }

}());
