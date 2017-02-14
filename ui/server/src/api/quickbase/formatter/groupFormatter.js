//
//      Formatter that takes report records and outputs a data structure that meets the
//      grouping requirements of each supplied group field element and organizes the data
//      to make i easier for the client to render the data grid.
//
(function() {
    'use strict';
    var constants = require('../../../../../common/src/constants');
    var log = require('../../../logger').getLogger();
    var perfLogger = require('../../../perfLogger');
    var _ = require('lodash');
    var requestHelper = require('../requestHelper')();

    var recordFormatter = require('./recordFormatter')();

    var dateFormatter = require('../../../../../common/src/formatter/dateTimeFormatter');
    dateFormatter.setLogger(log);

    var groupUtils = require('../../../utility/groupUtils');
    var groupTypes = require('../../../../../common/src/groupTypes').GROUP_TYPE;

    /**
     * Return the supplied record data grouped to match the grouping
     * requirements of each groupField element.
     *
     * @param groupFields
     * @param sortFields
     * @param fields
     * @param records
     * @returns {Array}
     */
    function createGroupDataGrid(groupFields, sortFields, fields, records) {
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
                    if (fld !== undefined) {
                        columns[fld.name] = column;
                    }
                });
                reportData.push(columns);
            });

            // A sort on the node layer is necessary if there is a group type != equals('V') AND there is a
            // secondary group/sort request after the non-equals group type.
            //
            // For example, the following grouping request will require a secondary sort:
            //      - group by email address domain; sort by date created
            //
            // Given an API request for the above grouping, the following fictitious result set will be returned by
            // the core server, ordered by email address/date created:
            //
            //      bill@domain1.com, 2016-07-20
            //      mary@domain1.com, 2016-07-21
            //      mary@domain1.com, 2016-08-28
            //      norm@domain2.com, 2016-07-14
            //      sally@domain1.com, 2016-07-20
            //      tom@domain1.com, 2016-06-20
            //      vince@domain2.com, 2016-05-20
            //      zoe@domain1.com, 2016-08-10
            //
            // Since the core server doesn't support grouping(it's a UI concept), we use lodash to group the result set,
            // So, if grouping by domain, the output from the lodash.groupBy function is as follows (NOTE: record order
            // is preserved):
            //
            //      domain1:
            //          test@domain1.com, 2016-07-20
            //          mary@domain1.com, 2016-07-21
            //          mary@domain1.com, 2016-08-28
            //          sally@domain1.com, 2016-07-20
            //          tom@domain1.com, 2016-06-20
            //          zoe@domain1.com, 2016-08-10
            //      domain2:
            //          norm@domain2.com, 2016-07-14
            //          vince@domain2.com, 2016-05-20
            //
            // If no additional sort was run, the sort order on date created would not be correct.  So, we'll build an
            // array that holds the list of fields and their sort order after any non-equal group request(in this
            // example, any group fid/sort fid after the groupBy domain fid) and run a lodash.orderBy using this list.
            // The output of the secondary sort is now in the correct order and satisfies the request:
            //
            //      domain1:
            //          tom@domain1.com, 2016-06-20
            //          sally@domain1.com, 2016-07-20
            //          test@domain1.com, 2016-07-20
            //          mary@domain1.com, 2016-07-21
            //          zoe@domain1.com, 2016-08-10
            //          mary@domain1.com, 2016-08-28
            //      domain2:
            //          vince@domain2.com, 2016-05-20
            //          norm@domain2.com, 2016-07-14
            //
            let secondarySort = {
                required: false,
                //  group fields
                groupFieldIndex: 0,
                groupFieldNames: [],
                groupFieldOrder: [],
                //  sort fields
                sortFieldNames: [],
                sortFieldOrder: []
            };

            for (let index = 0; index < groupFields.length; index++) {
                if (secondarySort.required === true) {
                    //  any group AFTER a field identified as one where the sort order of the result set is not
                    //  a guarantee, is added to the secondarySort list for node side sorting.
                    secondarySort.groupFieldNames.push(groupFields[index].field.name);
                    secondarySort.groupFieldOrder.push(groupFields[index].field.ascending ? 'asc' : 'desc');
                } else {
                    //  if the group type is not equals ('V'), then a secondary sort is necessary.
                    /*eslint no-lonely-if:0 */
                    if (groupFields[index].groupType !== groupTypes.COMMON.equals) {
                        secondarySort.required = true;
                        //  Additional sorting is necessary for all remaining groups..Save the index
                        //  to mark the starting index offset to know when to enforce group re-ordering.
                        secondarySort.groupFieldIndex = index;
                    }
                }
            }

            //  If we have any sort only fields, add those to the sortFieldObj if there is to be node sorting.
            if (secondarySort.required === true) {
                for (let index = 0; index < sortFields.length; index++) {
                    secondarySort.sortFieldNames.push(sortFields[index].name);
                    secondarySort.sortFieldOrder.push(sortFields[index].ascending ? 'asc' : 'desc');
                }

                // it's possible both fieldName lists are empty..which means we have nothing to do
                if (secondarySort.groupFieldNames.length === 0 && secondarySort.sortFieldNames.length === 0) {
                    secondarySort.required = false;
                }
            }

            data = groupTheData(groupFields, secondarySort, reportData, 0);

        }

        return data;
    }

    function extractGroupedField(groupType, groupField, dataValue, rawDataValue) {
        //
        //  Extract the grouping header based on the request group type, field type and data value
        //
        switch (groupField.datatypeAttributes.type) {
        case constants.DATE_TIME:
        case constants.DATE:
            // DATE_TIME and DATE are treated the same for grouping.  Also, since using the formatted
            // value, the time zone conversion has already been performed.

            //  get the format of the date
            let dateFormat = dateFormatter.generateFormat({dateFormat: groupField.datatypeAttributes.dateFormat});

            switch (groupType) {
            case groupTypes.DATE.equals:
                return dataValue;
            case groupTypes.DATE.day:
                return groupUtils.getDay(dataValue, dateFormat);
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
                return groupUtils.getDurationEquals(rawDataValue);
            case groupTypes.DURATION.second:
                return groupUtils.getDurationInSeconds(rawDataValue);
            case groupTypes.DURATION.minute:
                return groupUtils.getDurationInMinutes(rawDataValue);
            case groupTypes.DURATION.hour:
                return groupUtils.getDurationInHours(rawDataValue);
            case groupTypes.DURATION.day:
                return groupUtils.getDurationInDays(rawDataValue);
            case groupTypes.DURATION.week:
                return groupUtils.getDurationInWeeks(rawDataValue);
            }
            break;
        case constants.TIME_OF_DAY:
            var timeZone = groupField.datatypeAttributes.timeZone;
            if (!timeZone) {
                timeZone = constants.UTC_TIMEZONE;
            }
            switch (groupType) {
            case groupTypes.TIME_OF_DAY.equals:
                return groupUtils.getBySecond(rawDataValue, timeZone);
            case groupTypes.TIME_OF_DAY.second:
                return groupUtils.getBySecond(rawDataValue, timeZone);
            case groupTypes.TIME_OF_DAY.minute:
                return groupUtils.getByMinute(rawDataValue, timeZone);
            case groupTypes.TIME_OF_DAY.hour:
                return groupUtils.getByHour(rawDataValue, timeZone);
            case groupTypes.TIME_OF_DAY.am_pm:
                return groupUtils.getByAmPm(rawDataValue, timeZone);
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
                return rawDataValue;
            case groupTypes.NUMERIC.value:
                return rawDataValue;
            case groupTypes.NUMERIC.thousandth:
                return groupUtils.getRangeFraction(rawDataValue, 4);
            case groupTypes.NUMERIC.hundredth:
                return groupUtils.getRangeFraction(rawDataValue, 3);
            case groupTypes.NUMERIC.tenth:
                return groupUtils.getRangeFraction(rawDataValue, 2);
            case groupTypes.NUMERIC.one:
                return groupUtils.getRangeWhole(rawDataValue, 1);
            case groupTypes.NUMERIC.five:
                return groupUtils.getRangeWhole(rawDataValue, 5);
            case groupTypes.NUMERIC.ten:
                return groupUtils.getRangeWhole(rawDataValue, 10);
            case groupTypes.NUMERIC.hundred:
                return groupUtils.getRangeWhole(rawDataValue, 100);
            case groupTypes.NUMERIC.one_k:
                return groupUtils.getRangeWhole(rawDataValue, 1000);
            case groupTypes.NUMERIC.ten_k:
                return groupUtils.getRangeWhole(rawDataValue, 10000);
            case groupTypes.NUMERIC.hundred_k:
                return groupUtils.getRangeWhole(rawDataValue, 100000);
            case groupTypes.NUMERIC.million:
                return groupUtils.getRangeWhole(rawDataValue, 1000000);
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
        case constants.CHECKBOX:
        case constants.PHONE_NUMBER:
        case constants.URL:
            switch (groupType) {
            case groupTypes.COMMON.equals:
                return dataValue;
            }
            break;
        default:
            // unsupported data type or grouping option
            log.warn("Unsupported grouping option.  FieldId: " + groupField.id + "; name: " + groupField.name + "; DataType: " + groupField.datatypeAttributes.type + "; GroupType: " + groupType);
        }
        return '';
    }

    /**
     * Function to reorder the group data based on the fields in the fieldArray.
     *
     * @param group
     * @param fieldArray - list of fields to reorder
     * @param fieldOrderArray - for each field, ascending or descending order
     * @returns {Array}
     */
    function reOrderGroupData(group, fieldArray, fieldOrderArray) {

        let callBackArray = [];

        //  loop through the list of fieldArray elements and create a callback function for each..
        fieldArray.forEach(function(sortField) {
            callBackArray.push(
                function callback(a) {
                    //  want case insensitive ordering, so ensure text is always lowercase for comparison.
                    //  Note: this does not affect the display data; strings are rendered with proper case..
                    if (a[sortField]) {
                        if (typeof a[sortField].value === 'string') {
                            return a[sortField].value.toLowerCase();
                        }
                        return a[sortField].value;
                    }
                }
            );
        });

        //  orderBy function to reorder the group data using supplied function callback array
        //  and field ordering requirement.
        return _.orderBy(group, callBackArray, fieldOrderArray);
    }

    /**
     * For each group field, group the supplied report data according to the business
     * rules defined for each field type and group type combination.
     *
     * @param groupFields - report fields which are to be grouped
     * @param secondarySort - any secondary sorting needed against the report data
     * @param reportData - the report data
     * @param idx - which groupField element are we working on.
     * @returns {Array}
     */
    function groupTheData(groupFields, secondarySort, reportData, idx) {

        let data = [];
        let numericGroupTypeIdx = null;

        if (groupFields.length > idx) {
            //  get the group field element
            let groupField = groupFields[idx].field;
            //  get the groupType
            let groupType = groupFields[idx].groupType;

            //  Group the data based on the field dataType and grouping type
            let groupedData = _.groupBy(reportData, function(record) {

                //  the data value to group by
                let rawDataValue = record[groupField.name].value;
                //  if no display value in obj, then use the raw
                let dataValue = record[groupField.name].display === undefined ? rawDataValue : record[groupField.name].display;
                // If the dataValue is a complex display object (e.g., like phone numbers), make sure to use the display
                // property on the object instead of stringifying the object itself
                if (_.has(dataValue, 'display')) {
                    dataValue = dataValue.display;
                }

                let groupedValue = extractGroupedField(groupType, groupField, dataValue, rawDataValue);
                //  Convert empty strings into null as both are treated the same by the client.
                if (groupedValue === '') {
                    groupedValue = null;
                }

                //  for non-null headers, convert into a string
                if (groupedValue !== null) {
                    groupedValue = groupedValue.toString();
                }

                //  The lodash groupBy function uses the groupedValue as the key to an
                //  associative array.  If the groupedValue is numeric, javascript adds
                //  the entry as an index(this is expected behavior), which means it
                //  inserts that entry at the index and not as the next entry in the array.
                //  This causes problems when requesting a descending order sort.  To
                //  workaround this problem, we'll create a simple object with a key element,
                //  stringify it into JSON, and use that as the named key value.  This ensures
                //  we'll have no numeric key values added to the array.
                return JSON.stringify({key: groupedValue});

            });

            //  We've grouped the data for this field based on it's grouping requirement.  To support
            //  multi-level grouping, we need to group each element returned in outputted list
            //  against the next grouping level(if any).  This continues until all grouping levels
            //  have been processed.
            for (let group in groupedData) {
                let children = [];

                //  Check to determine if we have additional grouping levels to process.
                if (idx < groupFields.length - 1) {

                    //  Do we have any sorting requirements to perform on the next group
                    if (secondarySort.required === true) {
                        if (secondarySort.groupFieldIndex <= idx) {
                            let offset = idx - secondarySort.groupFieldIndex;
                            if (secondarySort.groupFieldNames.length > offset) {
                                groupedData[group] = reOrderGroupData(groupedData[group], [secondarySort.groupFieldNames[offset]], [secondarySort.groupFieldOrder[offset]]);
                            }
                        }
                    }

                    //  Recursive call to get the next group node in the groupFields list.  Continue until we get to
                    //  the last to the last grouping field where we populate the final group node with the child data.
                    //
                    children = groupTheData(groupFields, secondarySort, groupedData[group], idx + 1);
                } else {
                    //  No more grouping levels to process.  Do we have any final sorting requirements to perform on the child data.
                    if (secondarySort.required === true) {
                        if (secondarySort.sortFieldNames.length > 0) {
                            groupedData[group] = reOrderGroupData(groupedData[group], secondarySort.sortFieldNames, secondarySort.sortFieldOrder);
                        }
                    }

                    children = groupedData[group];
                }

                //  the groups are JSON, which is known only to this function.  Parse into an object and
                //  extract out the key, which is the grouping data that we want to expose to the client.
                let obj = JSON.parse(group);
                data.push({group: obj.key, children: children});
            }
        }

        return data;

    }

    module.exports = {

        /**
         * Processes the response object generated by the report result endpoint to reorganize to the json structure expected by
         * the react client when grouping a report.
         *
         * @param fields
         * @param report
         * @param sortList
         * @param isDisplayFormat
         * @returns {*|{hasGrouping: boolean, fields: Array, gridColumns: Array, gridData: Array, totalRows: number}}
         */
        groupData: function(fields, report, sortList, isDisplayFormat) {

            let perfLog = perfLogger.getInstance();
            perfLog.init("Build GroupList using core group result");

            let groupBy = {};
            let records = [];

            if (report && report.type === constants.RECORD_TYPE.GROUP) {
                let fieldsMap = new Map();
                let reportData = [];

                if (fields) {
                    fields.forEach((field) => {
                        fieldsMap.set(field.id, field);
                    });
                }

                //  loop though each group and push each record into a single array.
                //
                //  NOTE: no re-ordering of the data is necessary as the server should be
                //  returning the records in the proper order, which is based on the
                //  grouping and sorting requirements of the request.
                if (report.groups) {
                    report.groups.forEach((group) => {
                        let groupRecords = group.records;
                        if (isDisplayFormat === true) {
                            groupRecords = recordFormatter.formatRecords(group.records, fields);
                        }
                        groupRecords.forEach((record) => {
                            records.push(record);
                        });
                    });
                }

                //  now group the records for rendering in the client
                groupBy = this.group(fields, records, sortList);
            } else {
                log.warn("Attempting to group a result set that is not of type GROUP.  No grouping information returned.");
                groupBy = this.group();   // returns empty groupBy object
            }

            // if for some reason there is no grouping, return the records
            if (!groupBy.hasGrouping) {
                groupBy.records = records;
            }

            //  log performance data
            perfLog.log();

            return groupBy;

        },

        /**
         * Group the supplied records according to the glist content(if any) defined on the request.  The returned object
         * is organized to allow for optimal processing and rendering of the data in the browser client.
         *
         * @param fields
         * @param records
         * @param sortList
         * @returns {{hasGrouping: boolean, fields: Array, gridColumns: Array, gridData: Array, totalRows: number}}
         */
        group: function(fields, records, sortList) {

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

            let sortBy = {
                fields: []
            };

            if (fields && records) {
                //
                // Is there a grouping requirements within the sortList.  Format is
                // 'fid1:groupType1.fid2:groupType2...fidN:groupTypeN' where groupType is optional.
                //
                if (sortList) {
                    //  build a fields map for quick field access when looping through the groups list.
                    let map = new Map();
                    fields.forEach((field) => {
                        map.set(field.id, field);
                    });

                    let sortFidWithNoGroupingFound = false;
                    let groups = sortList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);

                    // Loop through the list of groups and determine whether we have any grouping requirements.
                    // Fields that are to be grouped are added to the groupBy.fields array in the same order
                    // as the groups array.  This is to ensure proper order of precedence.
                    groups.forEach((group) => {
                        if (group) {
                            let el = group.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER, 2);
                            let groupFidId = el[0];

                            //  Take the absolute value as the fid may be a negative value (descending sort)
                            //
                            //  Note: Math.abs(''), Math.abs(null) returns 0.  Given a fid must be > 0, this
                            //  results in the field not being found in the map, which is the correct expectation.
                            let field = map.get(Math.abs(groupFidId));
                            if (field) {

                                //  identify the ordering of the field
                                field.ascending = groupFidId > 0;

                                //  do we have a group type AND we have yet to encounter an entry in list that is sort only
                                if (el.length === 2 && sortFidWithNoGroupingFound === false) {
                                    //  get the group type
                                    let groupType = el[1];

                                    // found the field; now see if the data type/group type combination is valid.
                                    if (groupUtils.isValidGroupType(field.datatypeAttributes.type, groupType) === true) {
                                        // Mark the field as one that is grouped.  This is referenced when building the
                                        // groupBy.gridColumns as grouped fields are not displayed in the grid.
                                        field.grouped = true;
                                        field.groupType = groupType;
                                        groupBy.fields.push({field: field, groupType: groupType});
                                    } else {
                                        log.warn("Unsupported group type.  FieldId: " + field.id + "; FieldName: " + field.name + "; DataType: " + field.datatypeAttributes.type + "; GroupType: " + groupType);
                                    }
                                } else {
                                    //  Once we find a sortList entry defined without grouping, any subsequent grouping fid
                                    //  found in the parameter is ignored as far as grouping is concerned.  For example:
                                    //      7.8:EQUALS.9:EQUALS             ==>  no grouping as 1st element is a sort only fid
                                    //      7:EQUALS.8:EQUALS               ==>  group by fid 7, then fid 8
                                    //      7:EQUALS.8.9.10:EQUALS          ==>  group by fid 7 only as 2nd element is a sort only fid
                                    //      7:EQUALS.8:EQUALS.9.10:EQUALS   ==>  group by fid 7, fid 8 only as 3rd element is a sort only fid
                                    //
                                    //  NOTE: The builder on the new stack UI should restrict the possibility of this
                                    //  behavior, but we could run into this scenario when migrating old stack data.
                                    //
                                    sortFidWithNoGroupingFound = true;

                                    //  Group the sort-only fids into an array.  These will be used if additional
                                    //  sorting is necessary.
                                    if (field) {
                                        sortBy.fields.push(field);
                                    }
                                }
                            } else {
                                log.warn("Invalid field for grouping. Field not found on report.  FieldId: " + groupFidId);
                            }
                        }
                    });

                    if (groupBy.fields.length > 0) {
                        fields.forEach(function(field) {
                            //  Exclude grouped fields with a groupType of equals in the grid
                            if (!field.grouped || (field.grouped && field.groupType !== groupTypes.COMMON.equals)) {
                                groupBy.gridColumns.push(field);
                            }
                        });

                        groupBy.hasGrouping = true;
                        groupBy.gridData = createGroupDataGrid(groupBy.fields, sortBy.fields, fields, records);

                        //  TODO: with paging, this is flawed...
                        if (groupBy.gridData.length > 0) {
                            groupBy.totalRows = records.length;
                        }
                    }
                } else {
                    log.warn("Attempting to group records when no grouping requirements.  No grouping outputted.  SortList=" + sortList);
                }
            }

            return groupBy;

        }
    };
}());

