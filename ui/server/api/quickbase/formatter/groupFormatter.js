//
//        GROUPING DESCRIPTION GOES HERE....
//
(function() {
    'use strict';
    var constants = require('../../constants');
    var log = require('../../../logger').getLogger();
    var lodash = require('lodash');

    function createGroupDataGrid(groupFields, fields, records) {
        let data = [];

        if (fields && records) {
            let map = new Map();
            let reportData = [];

            fields.forEach((field) => {
                map.set(field.id, field);
            });

            records.forEach((record) => {
                let columns = {};
                record.forEach((column) => {
                    let fld = map.get(column.id);
                    columns[fld.name] = column.display;
                });
                columns.record = record;
                reportData.push(columns);
            });

            data = getData(groupFields, 0, reportData);
        }

        return data;
    }

    function getData(groupFields, idx, reportData) {
        let data = [];
        let groupField = groupFields[idx];

        //
        let groupedData = lodash.groupBy(reportData, function(record) {
            return record[groupField.name];
        });

        for (let group in groupedData) {
            let children = [];
            if (idx < groupFields.length - 1) {
                children = getData(groupFields, idx + 1, groupedData[group]);
            } else {
                children = groupedData[group];
            }
            data.push({group: group, children: children});
        }
        return data;

    }

    module.exports = {

        group: function(req, fields, records) {

            let groupBy = {
                hasGrouping: false,
                columns: [],
                gridColumns: [],
                gridData: [],
                totalRows: 0
            };

            if (fields) {
                //
                // Is there a grouping parameter included on the request.  The format of the parameter
                // is 'fid1:groupType1.fid2:groupType2...fidN:groupTypeN'
                //
                let glist = req.param(constants.REQUEST_PARAMETER.GROUP_LIST);
                if (glist) {
                    //  get the list of fields to group
                    let groups = glist.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
                    if (groups) {
                        //  Loop through all the fields and find those that are to grouped
                        fields.forEach(function(field) {
                            let isGroupByField = false;

                            //  we want identify the fields that we are to group by and add those to the
                            //  groupBy.columns list.
                            if (groupBy.columns.length < groups.length) {
                                for (let i = 0; i < groups.length; i++) {
                                    let el = groups[i].split(constants.REQUEST_PARAMETER.GROUP_DELIMITER);

                                    if (field.id && el[0] === field.id.toString() && el.length > 1) {
                                        //  add the group by type to the field
                                        field.groupByType = el[1];

                                        //  add the field to the list of group fields
                                        groupBy.columns.push(field);
                                        isGroupByField = true;
                                        break;
                                    }
                                }
                            }

                            //  If the field is not grouped, add it to the gridColumns array.  This will contain
                            //  all of the fields except for the group by fields (those in groupBy.columns).
                            if (isGroupByField === false) {
                                groupBy.gridColumns.push(field);
                            }
                        });

                        // if there are grouping columns, set the grouping flag to true and organize the
                        // grid data per grouping fields requirements.
                        if (groupBy.columns.length > 0) {
                            groupBy.hasGrouping = true;
                            groupBy.gridData = createGroupDataGrid(groupBy.columns, fields, records);

                            //  TODO: with paging, this is flawed...
                            if (groupBy.gridData.length > 0) {
                                groupBy.totalRows = records.length;
                            }
                        }
                    }
                }
            }

            return groupBy;

        }
    };
}());

