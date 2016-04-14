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

        let reportData = [];
        let map = new Map();

        if (fields && records) {
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
        }

        data = getData(groupFields, 0, reportData);

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

    function getGroupFields(req, fields, records) {
        let groupData = {
            hasGrouping: false,
            groupByFields: [],
            gridColumns: [],
            gridData: []
        };

        if (fields) {
            //
            // Is there a grouping parameter included on the request.  The format of the parameter
            // is 'fid1:groupType1.fid2:groupType2...fidN:groupTypeN'
            //
            let glist = req.param(constants.REQUEST_PARAMETER.GROUP_LIST);
            if (glist) {
                let groups = glist.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
                if (groups) {
                    fields.forEach(function(field) {
                        let isGroupByField = false;
                        if (groupData.groupByFields.length < groups.length) {
                            for (let i = 0; i < groups.length; i++) {
                                let el = groups[i].split(constants.REQUEST_PARAMETER.GROUP_DELIMITER);

                                if (field.id && el[0] === field.id.toString() && el.length > 1) {
                                    //  add the group by type to the field
                                    field.groupByType = el[1];

                                    //  add the field to the list of group fields
                                    groupData.groupByFields.push(field);
                                    isGroupByField = true;
                                    break;
                                }
                            }
                        }

                        //  If the field is not grouped, add it to the gridColumns array.  This will contain
                        //  all of the columns except for the group by columns.
                        if (isGroupByField === false) {
                            groupData.gridColumns.push(field);
                        }
                    });

                    if (groupData.groupByFields.length > 0) {
                        groupData.hasGrouping = true;
                        groupData.gridData = createGroupDataGrid(groupData.groupByFields, fields, records);
                    }
                }
            }
        }

        return groupData;
    }

    module.exports = {

        format: function(req, fields, records) {

            let groupFields = getGroupFields(req, fields, records);

            return groupFields;
        }
    };
}());

