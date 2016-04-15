//
//      Formatter that takes report records and outputs a data structure that
//      meets the grouping requirements of each supplied group field element.
//
(function() {
    'use strict';
    var constants = require('../../constants');
    var groupTypes = require('../../groupTypes');
    var log = require('../../../logger').getLogger();
    var lodash = require('lodash');


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

            //  Some prep work to organize the report data where we output a
            //  list of rows, with each entry containing key/value pairs that
            //  represent the data row cells displayed on each report row.
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
        let groupField = groupFields[idx];

        /**
         * Private function to extract the first word from the given content.
         * Will return the original content if any exception is thrown.
         *
         * @param content
         * @returns first word found in the content.
         */
        function getFirstWord(content) {
            try {
                return content.split(' ')[0];
            } catch (e) {
                // do nothing..just return the original content
            }
            return content;
        }

        /**
         * Private function to extract the first letter from the given content.
         * Will return the original content if any exception is thrown.
         *
         * @param content
         * @returns first letter found in the content.
         */
        function getFirstLetter(content) {
            try {
                return content.substr(0, 1);
            } catch (e) {
                // do nothing..just return the original content
            }
            return content;
        }

        //  Group the data based on the field dataType and grouping type
        let groupedData = lodash.groupBy(reportData, function(record) {

            //  what is the groupType for this field
            let groupType = groupField.groupType;

            //  Group the data based on the data type.  Grouping is supported
            //  for DATE, DURATION, EMAIL, NUMERIC, TEXT and USER data types only.
            //
            switch (groupField.datatypeAttributes.type) {
            case constants.DATE:
                switch (groupType) {
                case groupTypes.DATE.equals:
                    return record[groupField.name];
                // TODO: implement the below DATE grouping types
                //case groupTypes.DATE.day:
                //case groupTypes.DATE.week:
                //case groupTypes.DATE.month:
                //case groupTypes.DATE.year:
                //case groupTypes.DATE.quarter:
                //case groupTypes.DATE.fiscalQuarter:
                //case groupTypes.DATE.fiscalYear:
                //case groupTypes.DATE.decade:
                default:
                    log.warn("Trying to group by date field with an unsupported group type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
                }
                break;
            case constants.DURATION:
                switch (groupType) {
                // TODO: implement the below DURATION grouping types
                //case groupTypes.DURATION.equals:
                //case groupTypes.DURATION.second:
                //case groupTypes.DURATION.minute:
                //case groupTypes.DURATION.hour:
                //case groupTypes.DURATION.am_pm:
                //case groupTypes.DURATION.week:
                //case groupTypes.DURATION.day:
                default:
                    log.warn("Trying to group by duration field with an unsupported group type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
                }
                break;
            case constants.EMAIL:
                switch (groupType) {
                // TODO: implement the below NUMERIC grouping types
                //case groupTypes.EMAIL.domain:
                //case groupTypes.EMAIL.domain_topLevel:
                //case groupTypes.EMAIL.name:
                default:
                    log.warn("Trying to group by email field with an unsupported group type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
                }
                break;
            case constants.NUMERIC:
                switch (groupType) {
                case groupTypes.NUMERIC.equals:
                    return record[groupField.name];
                // TODO: implement the below NUMERIC grouping types
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
                default:
                    log.warn("Trying to group by numeric field with an unsupported group type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
                }
                break;
            case constants.TEXT:
                switch (groupType) {
                case groupTypes.TEXT.equals:
                    return record[groupField.name];
                case groupTypes.TEXT.firstLetter:
                    return getFirstLetter(record[groupField.name]);
                case groupTypes.TEXT.firstWord:
                    return getFirstWord(record[groupField.name]);
                default:
                    log.warn("Trying to group by text field with an unsupported group type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
                }
                break;
            case constants.USER:
                switch (groupType) {
                case groupTypes.USER.equals:
                    return record[groupField.name];
                case groupTypes.USER.firstLetter:
                    return getFirstLetter(record[groupField.name]);
                case groupTypes.USER.firstWord:
                    return getFirstWord(record[groupField.name]);
                default:
                    log.warn("Trying to group by user field with an unsupported group type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
                }
                break;
            default:
                // we have an unimplemented data type or grouping option
                log.warn("Trying to group by an unsupported field type.  FieldId/name: " + groupField.id + '/' + groupField.name + '; GroupType: ' + groupType);
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
         * Group the supplied records according to the glist content(if any) definedon the request.
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
            //      gridColumns: list of field columns to display in the grid
            //      gridData: grid content in grouped order
            //      totalRows: total number of rows in the grid
            let groupBy = {
                hasGrouping: false,
                fields: [],
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
                    //
                    //  get the list of fields to group.  This is an optional parameter, so it could be undefined.
                    //
                    let groups = glist.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
                    if (groups) {
                        //
                        //  organize the groups by fid for easy lookup when looping through the fields
                        //  TODO: can a fid be in more than 1 grouping definition per report??
                        //
                        let map = new Map();
                        groups.forEach((group) => {
                            let el = group.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER);
                            //  if no group element in parameter(valid case), then skip it
                            if (el.length > 1) {
                                map.set(el[0], el[1]);
                            }
                        });

                        //  Loop through all the fields and populate the groupBy structure appropriately.
                        for (let idx = 0; idx < fields.length; idx++) {
                            let field = fields[idx];

                            //  need to ensure the id is a string for the map lookup
                            let fieldId = field.id + '';

                            //  if a groupBy field, want to separate from those that are not grouped.
                            let groupType = map.get(fieldId);
                            if (groupType) {
                                //  add the groupType to the field
                                field.groupType = groupType;
                                groupBy.fields.push(field);
                            } else {
                                groupBy.gridColumns.push(field);
                            }
                        }

                        // if there are fields in the grouping fields list, we have grouping; set
                        // the grouping flag to true and organize the grid data per grouping fields
                        // requirements.
                        if (groupBy.fields.length > 0) {
                            groupBy.hasGrouping = true;
                            groupBy.gridData = createGroupDataGrid(groupBy.fields, fields, records);

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

