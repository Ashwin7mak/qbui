//
//        GROUPING DESCRIPTION GOES HERE....
//
(function() {
    'use strict';
    var constants = require('../../constants');
    var groupTypes = require('../../groupTypes');
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
                //columns.record = record;
                reportData.push(columns);
            });

            data = groupTheData(groupFields, 0, reportData);
        }

        return data;
    }

    function groupTheData(groupFields, idx, reportData) {

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

            //  Group the data based on the data type
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

        for (let group in groupedData) {
            let children = [];
            if (idx < groupFields.length - 1) {
                //  recursive call to get the children of each group node.  Will continue
                //  until we get to the last grouping field in the list and then work our way back out
                //  with a fully populated grouping data object.
                children = groupTheData(groupFields, idx + 1, groupedData[group]);
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

                        //  organize the groups by fid for easy lookup when looping through the fields
                        //  TODO: can a fid be in more than 1 grouping definition per report??
                        let map = new Map();
                        groups.forEach((group) => {
                            let el = group.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER);
                            //  if no group element in parameter(valid case), then skip it
                            if (el.length > 1) {
                                map.set(el[0], el[1]);
                            }
                        });

                        //  Loop through all the fields and find those that are to be grouped
                        for (let idx = 0; idx < fields.length; idx++) {
                            let field = fields[idx];

                            //  need to ensure the id is a string for the map lookup
                            let fieldId = field.id + '';

                            //  if a groupBy field, want to separate from those that are not grouped.
                            let groupType = map.get(fieldId);
                            if (groupType) {
                                //  add the groupType to the field
                                field.groupType = groupType;
                                groupBy.columns.push(field);
                            } else {
                                groupBy.gridColumns.push(field);
                            }
                        }

                        // if there are fields in the grouping columns list, we have grouping; set
                        // the grouping flag to true and organize the grid data per grouping fields
                        // requirements.
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

