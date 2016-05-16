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
    var perfLogger = require('../../../perfLogger');
    var lodash = require('lodash');
    var groupUtils = require('../../../components/utility/groupUtils');
    var dateFormatter = require('../../../api/quickbase/formatter/dateTimeFormatter');

    var RAW_SUFFIX = '_raw_';

    //  Temporary function to format numeric ranges for UI display.
    //  TODO: JIRA-21803 -- Node should only return an object structure to the client
    function formatNumericRange(range) {
        if (range.lower === null && range.upper === null) {
            return '';
        }
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
            let perfLog = perfLogger.getInstance();
            perfLog.init('Time to createGroupDataGrid');

            let map = new Map();
            let groupMap = new Map();
            let reportData = [];

            fields.forEach((field) => {
                map.set(field.id, field);
            });

            groupFields.forEach((groupField) => {
                groupMap.set(groupField.field.id, groupField.field);
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

                        //  If grouping on a numeric data type, add a temporary element to
                        //  hold the raw data value that is used to calculate the range.
                        if (groupMap.get(column.id) !== undefined && isNumericDataType(fld.datatypeAttributes.type)) {
                            columns[fld.name + RAW_SUFFIX] = column.value;
                        }
                    }
                });
                reportData.push(columns);
            });

            data = groupTheData(groupFields, reportData, 0);
            perfLog.log();
        }

        return data;
    }

    function extractGroupedField(groupType, groupField, dataValue, rawDataValue) {
        //
        //  Extract the grouping header based on the request group type, field type and data value
        //
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
            switch (groupType) {
            case groupTypes.DURATION.equals:
                return groupUtils.getDurationEquals(dataValue);
            case groupTypes.DURATION.second:
                return groupUtils.getDurationInSeconds(dataValue);
            case groupTypes.DURATION.minute:
                return groupUtils.getDurationInMinutes(dataValue);
            case groupTypes.DURATION.hour:
                return groupUtils.getDurationInHours(dataValue);
            case groupTypes.DURATION.day:
                return groupUtils.getDurationInDays(dataValue);
            case groupTypes.DURATION.week:
                return groupUtils.getDurationInWeeks(dataValue);
            }
            break;
        case constants.EMAIL_ADDRESS:
            switch (groupType) {
            case groupTypes.EMAIL_ADDRESS.equals:
                return dataValue;
            case groupTypes.EMAIL_ADDRESS.domain:
                return groupUtils.getEmailDomain(dataValue);
            case groupTypes.EMAIL_ADDRESS.domain_topLevel:
                return groupUtils.getEmailDomainTopLevel(dataValue);
            case groupTypes.EMAIL_ADDRESS.name:
                return groupUtils.getEmailName(dataValue);
            }
            break;
        case constants.NUMERIC:
        case constants.CURRENCY:    // CURRENCY is a sub-type of NUMERIC
        case constants.PERCENT:     // PERCENT is a sub-type of NUMERIC
        case constants.RATING:      // RATING is a sub-type of NUMERIC
            switch (groupType) {
            case groupTypes.NUMERIC.equals:
                return dataValue;
            case groupTypes.NUMERIC.thousandth:
                return formatNumericRange(groupUtils.getRangeFraction(rawDataValue, 4));
            case groupTypes.NUMERIC.hundredth:
                return formatNumericRange(groupUtils.getRangeFraction(rawDataValue, 3));
            case groupTypes.NUMERIC.tenth:
                return formatNumericRange(groupUtils.getRangeFraction(rawDataValue, 2));
            case groupTypes.NUMERIC.one:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 1));
            case groupTypes.NUMERIC.five:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 5));
            case groupTypes.NUMERIC.ten:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 10));
            case groupTypes.NUMERIC.hundred:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 100));
            case groupTypes.NUMERIC.one_k:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 1000));
            case groupTypes.NUMERIC.ten_k:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 10000));
            case groupTypes.NUMERIC.hundred_k:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 100000));
            case groupTypes.NUMERIC.million:
                return formatNumericRange(groupUtils.getRangeWhole(rawDataValue, 1000000));
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
        return '';
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

            //  If a raw value is defined(currently only numeric data types have this need),
            //  set a local variable and remove from the array once we have that reference.
            let rawDataValue = null;
            if (record.hasOwnProperty(groupField.name + RAW_SUFFIX)) {
                rawDataValue = record[groupField.name + RAW_SUFFIX];
                delete record[groupField.name + RAW_SUFFIX];
            }

            let groupedValue = extractGroupedField(groupType, groupField, dataValue, rawDataValue);

            //  TODO: JIRA-21803 -- Node should only return an object structure to the client
            if (groupedValue === '') {
                groupedValue = '(Empty)';
            }

            //  The lodash groupBy function uses the groupedValue as the key to an
            //  associative array.  If the groupedValue is numeric, javascript adds
            //  the entry as an index(this is expected behavior), which means it
            //  inserts that entry at the index and not as the next entry in the array.
            //  This causes problems when requesting a descending order sort.  To
            //  workaround this problem, we'll create a simple object with a key element,
            //  stringify it into JSON, and use that as the named key value.  This ensures
            //  we'll have no numeric key values added to the array.
            return JSON.stringify({key:groupedValue});

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

            //  the groups are JSON, which is known only to this function.  Parse into an object and
            //  extract out the key, which is the grouping data that we want to expose to the client.
            let obj = JSON.parse(group);
            data.push({group: obj.key, children: children});
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
                groupFields: [],
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
                    let perfLog = perfLogger.getInstance();
                    perfLog.init("Time to build groupList: " + groupList + "; Number of fields: " + fields.length + "; Number of records: " + records.length);

                    //  build a fields map for quick field access when looping through the groups list.
                    let map = new Map();
                    fields.forEach((field) => {
                        map.set(field.id, field);
                    });

                    let sortFidWithNoGroupingFound = false;
                    let groups = groupList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);

                    // Loop through the list of groups and determine whether we have any grouping requirements.
                    // Fields that are to be grouped are added to the groupBy.fields array in the same order
                    // as the groups array.  This is to ensure proper order of precedence.
                    groups.forEach((group) => {
                        if (group) {
                            let el = group.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER, 2);

                            //  must have a fid with a group type AND no prior entry in list that is sort only
                            if (el.length === 2 && sortFidWithNoGroupingFound === false) {
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
                            } else {
                                //  Once we find a sortList entry defined without grouping, any subsequent grouping fid
                                //  found in the groupList parameter is ignored.  For example:
                                //      7.8:V.9:V      ==>  no grouping as 1st element is a sort only fid
                                //      7:V.8:V        ==>  group by fid 7, then fid 8
                                //      7:V.8.9.10:V   ==>  group by fid 7 only as 2nd element is a sort only fid
                                //      7:V.8:V.9.10:V ==>  group by fid 7, fid 8 only as 3rd element is a sort only fid
                                //
                                //  NOTE: The builder on the new stack UI should restrict the possibility of this
                                //  behavior, but we could run into this scenario when migrating old stack data.
                                sortFidWithNoGroupingFound = true;
                            }
                        }
                    });

                    // we have grouping if there are fields in groupBy.fields array.  Set the grouping flag
                    // to true and populate the grid columns and data arrays.
                    if (groupBy.fields.length > 0) {
                        //  Business rule is to not include grouped fields in the grid.  Will create to 2 arrays; one
                        //  to hold the grouped fields and other for the grid columns(without grouped fields).
                        fields.forEach(function(field) {
                            if (field.grouped) {
                                groupBy.groupFields.push(field);
                            } else {
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
                    perfLog.log();
                }
            }

            return groupBy;

        }
    };
}());

