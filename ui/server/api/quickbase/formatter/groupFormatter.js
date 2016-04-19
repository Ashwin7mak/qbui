//
//      Formatter that takes report records and outputs a data structure that meets the
//      grouping requirements of each supplied group field element and organizes the data
//      to make i easier for the client to render the data grid.
//
(function() {
    'use strict';
    var constants = require('../../constants');
    var groupTypes = require('../../groupTypes');
    var log = require('../../../logger').getLogger();
    var lodash = require('lodash');
    var groupUtils = require('../../../components/utility/groupUtils');

    /**
     * Return the supplied record data grouped to match the grouping
     * requirements of each groupField element.
     *
     * @param groupFields
     * @param fields
     * @param records
     * @returns {Array}
     */
    function createGroupDataGrid(groupFields, fields, records) {
        let data = [];

        if (groupFields && fields && records) {
            let map = new Map();
            let reportData = [];

            fields.forEach((field) => {
                map.set(field.id, field);
            });

            //  Some prep work to organize the report data: for each row,
            //  add N key/value pairs, with each pair representing a data
            //  cell that is displayed on a report row.
            records.forEach((record) => {
                let columns = {};
                record.forEach((column) => {
                    let fld = map.get(column.id);
                    columns[fld.name] = column.display;
                });
                reportData.push(columns);
            });

            data = groupTheData(groupFields, reportData, 0);
        }

        return data;
    }

    /**
     * For each group field, group the supplied report data according to the business
     * rules defined for each field type and group type combination.
     *
     * @param groupFields - report fields which are to be grouped
     * @param reportData - the report data
     * @param idx - which groupField element are we working on.
     * @returns {Array}
     */
    function groupTheData(groupFields, reportData, idx) {

        let data = [];

        //  Group the data based on the field dataType and grouping type
        let groupedData = lodash.groupBy(reportData, function(record) {

            //  get the groupType and field from the input array
            let groupType = groupFields[idx].groupType;
            let groupField = groupFields[idx].field;

            //  Group the data based on the data type.  Grouping is supported
            //  for DATE, DURATION, EMAIL, NUMERIC, TEXT and USER data types.
            switch (groupField.datatypeAttributes.type) {
            case constants.DATE:
                switch (groupType) {
                case groupTypes.DATE.equals:
                    return record[groupField.name];
                //jira: qbse-21434
                //case groupTypes.DATE.day:
                //case groupTypes.DATE.week:
                //case groupTypes.DATE.month:
                //case groupTypes.DATE.year:
                //case groupTypes.DATE.quarter:
                //case groupTypes.DATE.fiscalQuarter:
                //case groupTypes.DATE.fiscalYear:
                //case groupTypes.DATE.decade:
                }
                break;
            case constants.DURATION:
                //jira: qbse-21438
                //switch (groupType) {
                //case groupTypes.DURATION.equals:
                //case groupTypes.DURATION.second:
                //case groupTypes.DURATION.minute:
                //case groupTypes.DURATION.hour:
                //case groupTypes.DURATION.am_pm:
                //case groupTypes.DURATION.week:
                //case groupTypes.DURATION.day:
                //}
                break;
            case constants.EMAIL_ADDRESS:
                //jira: qbse-21438
                //switch (groupType) {
                //case groupTypes.EMAIL_ADDRESS.domain:
                //case groupTypes.EMAIL_ADDRESS.domain_topLevel:
                //case groupTypes.EMAIL_ADDRESS.name:
                //}
                break;
            case constants.NUMERIC:
                switch (groupType) {
                case groupTypes.NUMERIC.equals:
                    return record[groupField.name];
                //jira: qbse-21427
                //case groupTypes.NUMERIC.range:
                //case groupTypes.NUMERIC.thousandth:
                //case groupTypes.NUMERIC.hundredth:
                //case groupTypes.NUMERIC.tenth:
                //case groupTypes.NUMERIC.one:
                //case groupTypes.NUMERIC.five:
                //case groupTypes.NUMERIC.ten:
                //case groupTypes.NUMERIC.hundred:
                //case groupTypes.NUMERIC.one_k:
                //case groupTypes.NUMERIC.ten_k:
                //case groupTypes.NUMERIC.hundred_k:
                //case groupTypes.NUMERIC.million:
                }
                break;
            case constants.TEXT:
                switch (groupType) {
                case groupTypes.TEXT.equals:
                    return record[groupField.name];
                case groupTypes.TEXT.firstLetter:
                    return groupUtils.getFirstLetter(record[groupField.name]);
                case groupTypes.TEXT.firstWord:
                    return groupUtils.getFirstWord(record[groupField.name]);
                }
                break;
            case constants.USER:
                switch (groupType) {
                case groupTypes.USER.equals:
                    return record[groupField.name];
                case groupTypes.USER.firstLetter:
                    return groupUtils.getFirstLetter(record[groupField.name]);
                case groupTypes.USER.firstWord:
                    return groupUtils.getFirstWord(record[groupField.name]);
                }
                break;
            default:
                // unsupported data type or grouping option
                log.warn("Unsupported grouping option.  FieldId: " + groupField.id + "; name: " + groupField.name + "; DataType: " + groupField.datatypeAttributes.type + "; GroupType: " + groupType);
            }

            return [];
        });

        //  We've grouped the data for this field based on it's grouping requirement.  To support
        //  multi-level grouping, we need to group each element returned in outputted list
        //  against the next grouping level(if any).  This continues until all grouping levels
        //  have been processed.
        for (let group in groupedData) {
            let children = [];

            if (idx < groupFields.length - 1) {
                //
                //  recursive call to get the children of the next group node in the groupFields list.
                //  Continue until we get to the last grouping field, and then populate the data
                //  object as we work our way back to the top of the stack.
                //
                children = groupTheData(groupFields, groupedData[group], idx + 1);
            } else {
                children = groupedData[group];
            }
            data.push({group: group, children: children});
        }
        return data;

    }

    module.exports = {

        /**
         * Group the supplied records according to the glist content(if any) defined on the request.
         *
         * @param req
         * @param fields
         * @param records
         * @returns {{hasGrouping: boolean, fields: Array, gridColumns: Array, gridData: Array, totalRows: number}}
         */
        group: function(req, fields, records) {

            //  object structure that provides the following information about report grouping:
            //      hasGrouping: does this report have a grouping requirement
            //      fields: list of report fields that are grouped
            //      gridColumns: list of field columns to display in the grid (does not contain the group fields)
            //      gridData: grid content in grouped order
            //      totalRows: total number of data rows in the grid
            let groupBy = {
                hasGrouping: false,
                fields: [],
                gridColumns: [],
                gridData: [],
                totalRows: 0
            };

            if (fields && records) {
                //
                // Is there a grouping parameter included on the request.  The format of the parameter
                // is 'fid1:groupType1.fid2:groupType2...fidN:groupTypeN'.
                //
                let groupList = req.param(constants.REQUEST_PARAMETER.GROUP_LIST);
                if (groupList) {
                    //  build a fields map for quick field access when looping through the groups list.
                    let map = new Map();
                    fields.forEach((field) => {
                        map.set(field.id + '', field);
                    });

                    let groups = groupList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);

                    // Loop through the list of groups and determine whether we have any grouping requirements.
                    // Fields that are to be grouped are added to the groupBy.fields array in the same order
                    // as the groups array.  This is to ensure proper order of precedence.
                    groups.forEach((group) => {
                        if (group) {
                            //  must have a fid and group type element
                            let el = group.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER, 2);
                            if (el.length === 2) {
                                let groupFidId = el[0];
                                let groupType = el[1];

                                //  skip if we can't find the field
                                let field = map.get(groupFidId);
                                if (field) {
                                    // found the field; now see if the data type/group type combination is valid.
                                    if (groupUtils.isValidGroupType(field.datatypeAttributes.type, groupType) === true) {
                                        // add the field and the group type to the groupBy list
                                        field.grouped = true;
                                        groupBy.fields.push(
                                            {field: field,
                                             groupType: groupType}
                                        );
                                    } else {
                                        log.warn("Unsupported group type.  FieldId: " + field.id + "; name: " + field.name + "; DataType: " + field.datatypeAttributes.type + "; GroupType: " + groupType);
                                    }
                                } else {
                                    log.warn("Invalid field for grouping.  FieldId: " + groupFidId + "; GroupType: " + groupType);
                                }
                            }
                        }
                    });

                    // we have grouping if there are fields in groupBy.fields array.  Set the grouping flag
                    // to true and populate the grid columns and data arrays.
                    if (groupBy.fields.length > 0) {
                        //  Business rule is to not include grouped fields in the grid.  So, add to the gridColumns
                        //  array the fields NOT designated to be grouped.
                        fields.forEach(function(field) {
                            if (!field.grouped) {
                                groupBy.gridColumns.push(field);
                            }
                        });

                        groupBy.hasGrouping = true;
                        groupBy.gridData = createGroupDataGrid(groupBy.fields, fields, records);

                        //  TODO: with paging, this is flawed...
                        if (groupBy.gridData.length > 0) {
                            groupBy.totalRows = records.length;
                        }
                    }
                }
            }

            return groupBy;

        }
    };
}());

