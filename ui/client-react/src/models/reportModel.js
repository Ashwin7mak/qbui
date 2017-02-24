//  Report model object used by the client to render a report
import FieldUtils from '../utils/fieldUtils';
import NumberUtils from '../utils/numberUtils';
import ReportUtils from '../utils/reportUtils';
import Constants from '../../../common/src/constants';
import Locale from '../locales/locales';
import {PAGE, DURATION} from '../../../common/src/constants';
import {DEFAULT_RECORD_KEY_ID} from "../constants/schema";
import * as query from '../constants/query';
import {hasUnitsText, isSmartUnitsField} from '../../../common/src/formatter/durationFormatter';
import _ from 'lodash';

import Logger from '../utils/logger';
let logger = new Logger();

const reportModelHelper = {
    /**
     * Given the field list format the columnDefinition as needed by data grid.
     *
     * ReportDataStore has columns array with one column object for each column in a grid. ag-Grid expects the coldef to have
     * a certain properties some of these are part of the field information and some part of the report definition.
     *
     * For ease of code reuse and ag-Grid agnostic the field definition associated with the column from the report's table field
     * structure is retained as a property on the column object as a whole in the `fieldDef` property.
     * This property mirrors the server field structure and can be used with the common validation utility on the node server
     * side as well as client side validation for report inline editing and possibly form field validation.
     *
     * Beside the fieldDef object we add the `field` member to column object which is the name of the property to use
     * to access that columns data from the data rows hash for ag-Grid. ag-Grid also needs `headerName` to title the column
     * header in the grid header row. The `order` property is the index sequence of the column
     *
     * Some other values from fieldDef are elevated for convenience to column definition
     * level also `id, fieldType, fieldName, defaultValue, choices`
     *
     * @param fields
     * @param hasGrouping
     * @returns {Array}
     */
    getReportColumns(fields, fids  = [], groupEls = []) {
        let columns = [];
        let groupDelimiter = Constants.REQUEST_PARAMETER.GROUP_DELIMITER;
        if (fields) {
            fields.forEach((fieldDef, index) => {
                let groupedField = _.find(groupEls, el => el.split(groupDelimiter)[0] === fieldDef.id);
                if (!groupedField && fids.length && (fids.indexOf(fieldDef.id) === -1)) {
                    //skip this fieldDef since its not on report's column list or on group list
                } else {
                    let column = {};
                    column.order = index;
                    column.id = fieldDef.id;
                    column.headerName = fieldDef.name;
                    column.field = fieldDef.name; //name needed for aggrid
                    column.fieldDef = fieldDef; //fieldDef props below tobe refactored to just get info from fieldObj property instead.

                    // get the column units to add to the column header, currently only duration fields gets the units from
                    // the field definition if its a scale that has units (non time type and non smart units)
                    // this value will show next to the field name in the table header, similar to numerics units e.g. Revenue (Thousands)
                    let durUnits = null;
                    if (fieldDef && _.has(fieldDef, 'datatypeAttributes.type') && fieldDef.datatypeAttributes.type === DURATION) {
                        let scale = fieldDef.datatypeAttributes.scale;
                        if (hasUnitsText(scale)) {
                            durUnits = Locale.getMessage(`durationTableHeader.${scale}`);
                            if (durUnits) {
                                // the unitsDescription display option on a field will show next to the column header in a table
                                // the app builder can optionally specify unitsDescription text for numeric fields and that
                                // text is added to the column header name for a field for example Revenues (thousands)
                                // where thousands is the unitsDescription.
                                // for durations the same presentation is desired when the duration values units
                                // is the same for all cells in the column. i.e non-smart units, non HH:MM: type units
                                // when the locale changes this value is updated and thus the table column header names updated
                                column.fieldDef.datatypeAttributes.unitsDescription = durUnits;
                            }
                        }
                    }

                    // note if this the table needs updates when locale changes
                    if (durUnits || isSmartUnitsField(fieldDef)) {
                        //  customized field created to track if the column requires localization.
                        //  TODO - Needed????  Need to figure out if needed since can't set model boolean from this method
                        //  TODO - which is what was being done prior to this work getting shifted to reportModel
                        //  TODO - Look at getColumnsHaveLocalization()..probably need to look at the columns..
                        column.columnHasLocalization = true;
                    }

                    column.fieldType = fieldDef.type;

                    column.defaultValue = null;
                    if (fieldDef.defaultValue && fieldDef.defaultValue.coercedValue) {
                        column.defaultValue = {
                            value: fieldDef.defaultValue.coercedValue.value,
                            display: fieldDef.defaultValue.displayValue
                        };
                    }

                    if (fieldDef.multipleChoice && fieldDef.multipleChoice.choices) {
                        column.multipleChoice = {};
                        column.multipleChoice.choices = fieldDef.multipleChoice.choices;
                    }
                    //  client side attributes
                    let maxLength = FieldUtils.getMaxLength(fieldDef);
                    if (maxLength) {
                        column.placeholder = Locale.getMessage('placeholder.maxLength', {maxLength: maxLength});
                    }
                    columns.push(column);
                }
            });
        }
        return columns;
    },

    /**
     * Using fields and records format the report's data.
     *
     * @param fields
     * @param records
     * @returns {*}
     */
    getReportData(fields, records) {
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
                    columns[fld.name] = column;
                });
                reportData.push(columns);
            });
        }

        return reportData;
    }
};

class ReportModel {

    constructor(appId, metaData, reportData, params) {
        this.model = {};

        //  will initialize model to empty state if mimimum of appId is not supplied
        if (!appId) {
            this.init();
        } else {
            this.set(appId, metaData, reportData, params);
        }
    }

    init() {
        this.set(null);
    }

    get() {
        return this.model;
    }

    set(appId, metaData, reportData, params) {
        this.model.appId = appId;

        this.setMetaData(metaData);
        this.setReportData(reportData);
        this.setFacetData(reportData);
        this.setRunTimeParams(params);
    }

    /**
     * Set model object with meta data content
     *
     * @param metaData
     */
    setMetaData(metaData) {
        //  meta data elements defined on the client model.
        this.model.metaData = {};
        this.model.originalMetaData = null;
        this.model.tblId = null;
        this.model.rptId = null;
        this.model.name = null;
        this.model.description = null;
        this.model.fids = [];
        this.model.sortList = [];
        this.model.sortFids = [];
        this.model.groupEls = [];
        this.model.groupLevel = 0;

        if (metaData) {
            this.model.metaData = metaData;
            // create deep clone to allow for adhoc updates on the client but still have
            // ability to reset the meta data back to its original state.
            this.model.originalMetaData = _.cloneDeep(metaData);

            this.model.tblId = metaData.tableId;
            if (metaData.id) {
                this.model.rptId = metaData.id.toString();
            } else {
                //  if there's no id, we're generating the synthetic default table report
                this.model.rptId = Constants.SYNTHETIC_TABLE_REPORT.ID;
            }
            this.model.name = metaData.name;
            this.model.description = metaData.description;

            this.model.fids = metaData.fids ? metaData.fids : [];
            if (this.model.fids.length === 0) {
                // if no fid list, then check the report defaults
                if (metaData.reportDefaults && metaData.reportDefaults.fids) {
                    this.model.fids = metaData.reportDefaults.fids;
                }
            }

            let sortList = metaData.sortList || [];
            if (sortList.length === 0) {
                // if no sort list, check the report defaults
                if (metaData.reportDefaults && metaData.reportDefaults.sortList) {
                    sortList = metaData.reportDefaults.sortList;
                }
            }
            this.model.sortList = ReportUtils.getSortListFromObject(sortList);
            this.model.sortFids = ReportUtils.getSortFidsOnly(sortList);
            this.model.groupEls = ReportUtils.getGroupElements(sortList);
            this.model.groupLevel = this.model.groupEls.length;
        }
    }

    /**
     * Set model object with report content
     *
     * @param reportData
     */
    setReportData(reportData) {
        //  report data elements defined on the client model.
        this.model.recordData = reportData;// TODO remove..

        this.model.hasGrouping = false;
        this.model.columns = null;
        this.model.records = null;
        this.model.filteredRecords = null;
        this.model.filteredRecordsCount = 0;
        this.model.groupFields = null;
        this.model.gridColumns = null;
        this.model.fields = null;
        this.model.fieldsMap = null;
        this.model.keyField = null;
        this.model.recordsCount = 0;

        if (reportData) {
            if (reportData.groups) {
                this.model.hasGrouping = reportData.groups.hasGrouping;
            }

            if (this.model.hasGrouping === true) {
                // Note the reference to this.model.fids, this.model.groupEls...you'll want to ensure setMetaData() has
                // already been called as that method sets those properties.
                this.model.columns = reportModelHelper.getReportColumns(reportData.groups.gridColumns, this.model.fids, this.model.groupEls);
                this.model.records = reportData.groups.gridData;
                this.model.filteredRecords = this.model.records;
                this.model.filteredRecordsCount = reportData.groups.totalRows;
                this.model.groupFields = reportData.groups.fields;
                this.model.gridColumns = reportData.groups.gridColumns;
            } else {
                this.model.columns = reportModelHelper.getReportColumns(reportData.fields, this.model.fids, this.model.groupEls);
                this.model.records = reportModelHelper.getReportData(reportData.fields, reportData.records);
                this.model.filteredRecords = this.model.records;
                this.model.filteredRecordsCount = reportData.records ? reportData.records.length : null;
                this.model.gridColumns = null;
                this.model.groupFields = null;
            }

            this.model.fields = reportData.fields || [];
            // map of fields by field id for fast lookup, any type for key,
            // see http://stackoverflow.com/questions/18541940/map-vs-object-in-javascript
            let map = new Map();
            if (reportData.fields) {
                reportData.fields.forEach((field) => {
                    map.set(field.id, field);
                });
            }
            this.model.fieldsMap = map;
            this.model.keyField = _.find(this.model.fields, field => field.id === DEFAULT_RECORD_KEY_ID);

            if (reportData.filteredCount && !isNaN(reportData.filteredCount)) {
                this.model.recordsCount = parseInt(reportData.filteredCount);
            }
        }
    }

    /**
     * Set facets data(if any)
     *
     * @param reportData
     */
    setFacetData(reportData) {
        this.model.facets = [];

        if (reportData && reportData.facets) {
            //check for an error message ==> [{id:x, name:y, type:z, errorCode: errorCode}]
            if (reportData.facets.length > 0) {
                if (reportData.facets[0].errorCode) {
                    //  TODO: implement translating the error code into a descriptive message
                    let errorCode = reportData.facets[0].errorCode;
                    let id = reportData.facets[0].id;
                    let name = reportData.facets[0].name;
                    logger.error(`Error response from server. Facet:${id}, name:${name}, error: ${errorCode}; app:${this.model.appId}; table:${this.model.tblId}; report:${this.model.rptId}.`);
                } else {
                    this.model.facets = reportData.facets;
                }
            }
        }
    }

    /**
     * What, if any, run-time parameter information like offset, numRow, and filters were used.
     *
     * @param params
     */
    setRunTimeParams(params) {
        // miscellaneous param elements defined on the model
        this.model.pageOffset = PAGE.DEFAULT_OFFSET;
        this.model.numRows = PAGE.DEFAULT_NUM_ROWS;
        //  facet/filtering info
        this.model.facetExpression = '';
        this.model.searchStringForFiltering = '';
        this.model.selections = null;

        if (params) {
            const offset = params[query.OFFSET_PARAM];
            const rows = params[query.NUMROWS_PARAM];
            if (NumberUtils.isInt(offset) && offset >= 0) {
                this.model.pageOffset = offset;
            }
            if (NumberUtils.isInt(rows) && rows >= 0 && rows <= PAGE.MAX_NUM_ROWS) {
                this.model.numRows = rows;
            }
            //  any run time facet, filter or search
            if (params.filter) {
                this.model.facetExpression = params.filter.facet;
                this.model.searchStringForFiltering = params.filter.search;
                this.model.selections = params.filter.selections;
            }
        }

    }
}

export default ReportModel;
