//  Report model object used by the client to render a report
import FacetSelections from '../components/facet/facetSelections';
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

        //  will initialize model to empty state if minimum of appId is not supplied
        if (!appId) {
            this.init(null);
        } else {
            this.init(appId, metaData, reportData, params);
        }
    }

    get() {
        return this.model;
    }

    init(appId, metaData, reportData, params) {
        this.model.appId = appId;

        // initialize report model data
        this.model.data = {};
        this.setMetaData(metaData);
        this.setReportData(reportData);
        this.setFacetData(reportData);

        //  initialize model data
        this.setRunTimeParams(params);
        this.model.tblId = this.model.data.tblId;
        this.model.rptId = this.model.data.rptId;
    }

    /**
     * Set model object with meta data content
     *
     * @param metaData
     */
    setMetaData(metaData) {
        //  meta data elements
        let data = {};
        data.metaData = {};
        data.originalMetaData = null;
        data.appId = null;
        data.tblId = null;
        data.rptId = null;
        data.name = null;
        data.description = null;
        data.fids = [];
        data.sortList = [];
        data.sortFids = [];
        data.groupEls = [];
        data.groupLevel = 0;

        if (metaData) {
            data.metaData = metaData;

            // create deep clone to allow for adhoc updates on the client but still have
            // ability to reset the meta data back to its original state.
            data.originalMetaData = _.cloneDeep(metaData);

            data.appId = this.model.appId;
            data.tblId = metaData.tableId;
            if (metaData.id) {
                data.rptId = metaData.id.toString();
            } else {
                //  if there's no id, we're generating the synthetic default table report
                data.rptId = Constants.SYNTHETIC_TABLE_REPORT.ID;
            }
            data.name = metaData.name;
            data.description = metaData.description;

            data.fids = metaData.fids ? metaData.fids : [];
            if (data.fids.length === 0) {
                // if no fid list, then check the report defaults
                if (metaData.reportDefaults && metaData.reportDefaults.fids) {
                    data.fids = metaData.reportDefaults.fids;
                }
            }

            let sortList = metaData.sortList || [];
            if (sortList.length === 0) {
                // if no sort list, check the report defaults
                if (metaData.reportDefaults && metaData.reportDefaults.sortList) {
                    sortList = metaData.reportDefaults.sortList;
                }
            }
            data.sortList = ReportUtils.getSortListFromObject(sortList);
            data.sortFids = ReportUtils.getSortFidsOnly(sortList);
            data.groupEls = ReportUtils.getGroupElements(sortList);
            data.groupLevel = data.groupEls.length;
        }

        // attach the meta data to the model.data obj
        Object.assign(this.model.data, data);
    }

    /**
     * Set model object with report content
     *
     * @param reportData
     */
    setReportData(reportData) {
        let data = {};
        data.hasGrouping = false;
        data.columns = null;
        data.records = null;
        data.filteredRecords = null;
        data.filteredRecordsCount = 0;
        data.groupFields = null;
        data.gridColumns = null;
        data.fields = null;
        data.fieldsMap = null;
        data.keyField = null;
        data.recordsCount = 0;

        if (reportData) {
            if (reportData.groups) {
                data.hasGrouping = reportData.groups.hasGrouping;
            }

            if (data.hasGrouping === true) {
                // Note the reference to this.model.fids, this.model.groupEls...you'll want to ensure setMetaData() has
                // already been called as that method sets those properties.
                data.columns = reportModelHelper.getReportColumns(reportData.groups.gridColumns, this.model.data.fids, this.model.data.groupEls);
                data.records = reportData.groups.gridData;
                data.filteredRecords = data.records;
                data.filteredRecordsCount = reportData.groups.totalRows;
                data.groupFields = reportData.groups.fields;
                data.gridColumns = reportData.groups.gridColumns;
            } else {
                data.columns = reportModelHelper.getReportColumns(reportData.fields, this.model.data.fids, this.model.data.groupEls);
                data.records = reportModelHelper.getReportData(reportData.fields, reportData.records);
                data.filteredRecords = data.records;
                data.filteredRecordsCount = reportData.records ? reportData.records.length : null;
                data.gridColumns = null;
                data.groupFields = null;
            }

            data.fields = reportData.fields || [];
            // map of fields by field id for fast lookup, any type for key,
            // see http://stackoverflow.com/questions/18541940/map-vs-object-in-javascript
            let map = new Map();
            if (reportData.fields) {
                reportData.fields.forEach((field) => {
                    map.set(field.id, field);
                });
            }
            data.fieldsMap = map;
            data.keyField = _.find(data.fields, field => field.id === DEFAULT_RECORD_KEY_ID);

            if (reportData.filteredCount && !isNaN(reportData.filteredCount)) {
                data.recordsCount = parseInt(reportData.filteredCount);
            }
        }

        // attach the report data to the model.data obj
        Object.assign(this.model.data, data);
    }

    /**
     * Set facets data(if any)
     *
     * @param reportData
     */
    setFacetData(reportData) {
        let data = {};
        data.facets = [];

        if (reportData && reportData.facets) {
            //check for an error message ==> [{id:x, name:y, type:z, errorCode: errorCode}]
            if (reportData.facets.length > 0) {
                if (reportData.facets[0].errorCode) {
                    //  TODO: implement translating the error code into a descriptive message
                    let errorCode = reportData.facets[0].errorCode;
                    let id = reportData.facets[0].id;
                    let name = reportData.facets[0].name;
                    logger.error(`Error response from server. Facet:${id}, name:${name}, error: ${errorCode}; app:${this.model.data.appId}.`);
                } else {
                    data.facets = reportData.facets;
                }
            }
        }

        // attach the facet data to the model.data obj
        Object.assign(this.model.data, data);
    }

    /**
     * What, if any, run-time data parameters like offset, numRow, filters, etc.
     *
     * @param params
     */
    setRunTimeParams(params) {
        // miscellaneous param elements defined on the model
        let data = {};
        data.pageOffset = PAGE.DEFAULT_OFFSET;
        data.numRows = PAGE.DEFAULT_NUM_ROWS;
        //  facet/filtering info
        data.facetExpression = {};
        data.searchStringForFiltering = '';
        data.selections = new FacetSelections();
        //  UI row selections
        data.selectedRows = [];

        if (params) {
            const offset = params[query.OFFSET_PARAM];
            const rows = params[query.NUMROWS_PARAM];
            if (NumberUtils.isInt(offset) && offset >= 0) {
                data.pageOffset = offset;
            }
            if (NumberUtils.isInt(rows) && rows >= 0 && rows <= PAGE.MAX_NUM_ROWS) {
                data.numRows = rows;
            }
            //  any run time facet, filter or search
            if (params.filter) {
                if (params.filter.facet) {
                    data.facetExpression = params.filter.facet;
                }
                if (params.filter.search) {
                    data.searchStringForFiltering = params.filter.search;
                }
                if (params.filter.selections) {
                    data.selections = params.filter.selections;
                }
            }
        }

        // attach the misc data to the model
        Object.assign(this.model, data);
    }
}

export default ReportModel;
