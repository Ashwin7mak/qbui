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
    var dateFormatter = require('../../../api/quickbase/formatter/dateTimeFormatter');
    var numericFormatter = require('../../../api/quickbase/formatter/numericFormatter');

    var RAW_SUFFIX = '_raw_';

    //  TODO: refactor into a shared module
    var startDate;
    function perfStart() {
        startDate = new Date();
    }
    function perfEnd(trackingMsg) {
        if (startDate) {
            let endDate = new Date();
            let ms = endDate.getTime() - startDate.getTime();
            log.debug((trackingMsg ? trackingMsg : 'Elapsed: ') + ms + 'ms');
            startDate = null;
        }
    }

    //  Temporary function to format numeric ranges for UI display.
    //  TODO: Node should only return an object structure to the client
    //  TODO: and have it determine how to format and render the content
    //  TODO: based on localization expectation.
    function formatNumericRange(range) {
        return range.lower + ' to ' + range.upper;
    }

    function isNumericDataType(dataType) {
        return dataType === constants.NUMERIC ||
               dataType === constants.CURRENCY ||
               dataType === constants.PERCENT ||
               dataType === constants.RATING;
    }

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
            let groupMap = new Map();
            let reportData = [];

            fields.forEach((field) => {
                map.set(field.id, field);
            });

            groupFields.forEach((field) => {
                groupMap.set(field.field.id, field.field);
            });

            //  Some prep work to organize the report data: for each row,
            //  add N key/value pairs, with each pair representing a data
            //  cell that is displayed on a report row.
            records.forEach((record) => {
                let columns = {};
                record.forEach((column) => {
                    let fld = map.get(column.id);
                    if (fld !== undefined) {
                        columns[fld.name] = column.display;

                        //  If grouping on a numeric data type, add a temporary element to hold the raw data
                        //  value.  This will be used in the groupByData function to determine the data range.
                        if (groupMap.get(column.id) !== undefined && isNumericDataType(fld.datatypeAttributes.type)) {
                            columns[fld.name + RAW_SUFFIX] = column.value;
                        }
                    }
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

            //  the data value to group by
            let dataValue = record[groupField.name];

            //  Group the data based on the data type.  Grouping is supported
            //  for DATE, DURATION, EMAIL, NUMERIC, TEXT and USER data types.
            switch (groupField.datatypeAttributes.type) {
            case constants.DATE_TIME:   // DATE_TIME and DATE are treated the same for grouping
            case constants.DATE:
                let dateFormat = dateFormatter.generateFormat({dateFormat: groupField.datatypeAttributes.dateFormat});
                switch (groupType) {
                case groupTypes.DATE.equals:
                    return dataValue;
                case groupTypes.DATE.day:
                    return dataValue;
                case groupTypes.DATE.week:
                    return groupUtils.getFirstDayOfWeek(dataValue, dateFormat);
                case groupTypes.DATE.month:
                    return groupUtils.getMonth(dataValue, dateFormat);
                case groupTypes.DATE.year:
                    return groupUtils.getYear(dataValue, dateFormat);
                case groupTypes.DATE.quarter:
                    return groupUtils.getQuarter(dataValue, dateFormat);
                case groupTypes.DATE.fiscalQuarter:
                    return groupUtils.getFiscalQuarter(dataValue, dateFormat);
                case groupTypes.DATE.fiscalYear:
                    return groupUtils.getFiscalYear(dataValue, dateFormat);
                case groupTypes.DATE.decade:
                    return groupUtils.getDecade(dataValue, dateFormat);
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
            case constants.CURRENCY:    // CURRENCY is a sub-type of NUMERIC
            case constants.PERCENT:     // PERCENT is a sub-type of NUMERIC
            case constants.RATING:      // RATING is a sub-type of NUMERIC
                //  get the raw data value and use it to determine the range.  Remove
                //  the element from the array as it's not needed beyond this function.
                let raw = record[groupField.name + RAW_SUFFIX];
                delete record[groupField.name + RAW_SUFFIX];

                switch (groupType) {
                case groupTypes.NUMERIC.equals:
                    return dataValue;
                case groupTypes.NUMERIC.thousandth:
                    return formatNumericRange(groupUtils.getRangeFraction(raw, 4));
                case groupTypes.NUMERIC.hundredth:
                    return formatNumericRange(groupUtils.getRangeFraction(raw, 3));
                case groupTypes.NUMERIC.tenth:
                    return formatNumericRange(groupUtils.getRangeFraction(raw, 2));
                case groupTypes.NUMERIC.one:
                    return formatNumericRange(groupUtils.getRangeFraction(raw, 1));
                case groupTypes.NUMERIC.five:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 5));
                case groupTypes.NUMERIC.ten:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 10));
                case groupTypes.NUMERIC.hundred:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 100));
                case groupTypes.NUMERIC.one_k:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 1000));
                case groupTypes.NUMERIC.ten_k:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 10000));
                case groupTypes.NUMERIC.hundred_k:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 100000));
                case groupTypes.NUMERIC.million:
                    return formatNumericRange(groupUtils.getRangeWhole(raw, 1000000));
                }
                break;
            case constants.TEXT:
                switch (groupType) {
                case groupTypes.TEXT.equals:
                    return dataValue;
                case groupTypes.TEXT.firstLetter:
                    return groupUtils.getFirstLetter(dataValue);
                case groupTypes.TEXT.firstWord:
                    return groupUtils.getFirstWord(dataValue);
                }
                break;
            case constants.USER:
                switch (groupType) {
                case groupTypes.USER.equals:
                    return dataValue;
                case groupTypes.USER.firstLetter:
                    return groupUtils.getFirstLetter(dataValue);
                case groupTypes.USER.firstWord:
                    return groupUtils.getFirstWord(dataValue);
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
                    log.debug("Build grouping for groupList: " + groupList + "; Number of fields: " + fields.length + "; Number of records: " + records.length);

                    perfStart();
                    //  build a fields map for quick field access when looping through the groups list.
                    let map = new Map();
                    fields.forEach((field) => {
                        map.set(field.id, field);
                    });
                    let endDate = new Date();
                    perfEnd("Build map for field grouping: ");

                    let groups = groupList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);

                    // Loop through the list of groups and determine whether we have any grouping requirements.
                    // Fields that are to be grouped are added to the groupBy.fields array in the same order
                    // as the groups array.  This is to ensure proper order of precedence.
                    perfStart();
                    groups.forEach((group) => {
                        if (group) {
                            //  must have a fid and group type element
                            let el = group.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER, 2);
                            if (el.length === 2) {
                                let groupFidId = el[0];
                                let groupType = el[1];

                                //  Take the absolute value as the fid may be a negative value (descending sort)
                                //
                                //  Note: Math.abs(''), Math.abs(null) returns 0.  Given a fid must be > 0, this
                                //  results in the field not being found in the map, which is the correct expectation.
                                let field = map.get(Math.abs(groupFidId));
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
                    perfEnd("Build groupBy.fields array: ");

                    // we have grouping if there are fields in groupBy.fields array.  Set the grouping flag
                    // to true and populate the grid columns and data arrays.
                    if (groupBy.fields.length > 0) {
                        perfStart();
                        //  Business rule is to not include grouped fields in the grid.  So, add to the gridColumns
                        //  array the fields NOT designated to be grouped.
                        fields.forEach(function(field) {
                            if (!field.grouped) {
                                groupBy.gridColumns.push(field);
                            }
                        });
                        perfEnd("Build groupBy.gridColumns array: ");

                        groupBy.hasGrouping = true;

                        perfStart();
                        groupBy.gridData = createGroupDataGrid(groupBy.fields, fields, records);
                        perfEnd("Build groupBy.gridData array: ");

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

