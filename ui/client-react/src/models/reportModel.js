//  Report model object used by the client to render a report
import FacetSelections from '../components/facet/facetSelections';
import NumberUtils from '../utils/numberUtils';
import ReportUtils from '../utils/reportUtils';
import ReportModelHelper from './reportModelHelper';
import {PAGE, SYNTHETIC_TABLE_REPORT} from '../../../common/src/constants';
import {DEFAULT_RECORD_KEY_ID} from "../constants/schema";
import * as query from '../constants/query';
import _ from 'lodash';

import Logger from '../utils/logger';
let logger = new Logger();

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
                data.rptId = SYNTHETIC_TABLE_REPORT.ID;
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
                data.columns = ReportModelHelper.getReportColumns(reportData.groups.gridColumns, this.model.data.fids, this.model.data.groupEls);
                data.records = reportData.groups.gridData;
                data.filteredRecords = data.records;
                data.filteredRecordsCount = reportData.groups.totalRows;
                data.groupFields = reportData.groups.fields;
                data.gridColumns = reportData.groups.gridColumns;
            } else {
                data.columns = ReportModelHelper.getReportColumns(reportData.fields, this.model.data.fids, this.model.data.groupEls);
                data.records = ReportModelHelper.getReportData(reportData.fields, reportData.records);
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
