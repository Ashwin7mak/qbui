import React from "react";
import ReactIntl from "react-intl";
import CardViewListHolder from "../../../components/dataTable/cardView/cardViewListHolder";
import AGGrid from "../../../components/dataTable/agGrid/agGrid";
import QBGrid from "../../../components/dataTable/qbGrid/qbGrid";
import Logger from "../../../utils/logger";
import Breakpoints from "../../../utils/breakpoints";
import ReportActions from "../../actions/reportActions";
import ReportUtils from '../../../utils/reportUtils';
import Fluxxor from "fluxxor";
import * as SchemaConsts from "../../../constants/schema";
import {GROUP_TYPE} from "../../../../../common/src/groupTypes";
import Locales from "../../../locales/locales";
import ReportFooter from '../reportFooter';
import ValidationUtils from "../../../../../common/src/validationUtils";
import ValidationMessage from "../../../utils/validationMessage";
import _ from 'lodash';
import {withRouter} from 'react-router';

let logger = new Logger();

let IntlMixin = ReactIntl.IntlMixin;
let FluxMixin = Fluxxor.FluxMixin(React);

export let ReportContent = React.createClass({
    mixins: [FluxMixin, IntlMixin],

    // row was clicked once, navigate to record
    openRow(data) {
        const {appId, tblId, rptId} = this.props;

        var recId = data[this.props.uniqueIdentifier].value;

        // let flux know we've drilled-down into a record so we can navigate back and forth
        let flux = this.getFlux();
        flux.actions.openingReportRow(recId);

        //create the link we want to send the user to and then send them on their way
        const link = `/app/${appId}/table/${tblId}/report/${rptId}/record/${recId}`;
        if (this.props.router) {
            this.props.router.push(link);
        }
    },

    /**
     * Given a record id get the original values from the report.
     * @param recid
     * @returns {*}
     */
    getOrigRec(recid) {
        let orig = {names:{}, fids:{}};
        let recs = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];
        let uniqueIdentifier =  this.props.uniqueIdentifier;
        _.find(recs, rec => {
            var keys = Object.keys(rec);
            keys.find((col) => {
                if (col === uniqueIdentifier && rec[col].value === recid) {
                    orig.names = rec;
                    let fids = {};
                    let recKeys = Object.keys(rec);
                    // have fid lookup hash
                    recKeys.forEach(function(item) {
                        fids[rec[item].id] = rec[item];
                    });
                    orig.fids = fids;
                    return true;
                }
            });
        });
        return _.cloneDeep(orig);

    },

    /**
     * Given a record id get the original values from the grouped report.
     * @param recid
     * @returns {*}
     */
    getOrigGroupedRec(recId) {
        let orig = {names:{}, fids:{}};
        let recs = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];

        let rec = ReportUtils.findGroupedRecord(recs, recId, this.props.uniqueIdentifier);

        orig.names = rec;
        let fids = {};

        let recKeys = Object.keys(rec);
        // have fid lookup hash
        recKeys.forEach((item) => {
            fids[rec[item].id] = rec[item];
        });
        orig.fids = fids;
        return _.cloneDeep(orig);
    },

    /**
     * Client side validation of array of changes to a record
     * placeholder method implementation TBD
     * @param changes
     * @returns {ok: boolean, errors: Array} result object {{ok: boolean, errors: Array}}
     */
    validateRecord(changes) {
        let statuses = [];
        let ok = true;
        // FOR M7 we will validate the record on server side
        //validate each change
        // Object.keys(changes).forEach((fieldId) => {
        //     let def = this.props.reportData.data.fieldsMap.get(+fieldId);
        //     let status = ValidationUtils.checkFieldValue(def, changes[fieldId].value, true);
        //     if (status.isInvalid) {
        //         ok = false;
        //         statuses.push(status);
        //     }
        // });
        //we will let the server validate these unchanged items not the client
        // //validate constrained fields that haven't changed, there constraints might have
        // let constrainedFieldValues = [];
        // this.getConstrainedUnchangedValues(changes, constrainedFieldValues);
        // constrainedFieldValues.forEach((data) => {
        //     let def = this.props.reportData.data.fieldsMap.get(data.id);
        //     let status = ValidationUtils.checkFieldValue(def, data.value, true);
        //     if (status.isInvalid) {
        //         ok = false;
        //         statuses.push(status);
        //     }
        // });

        // return validation errors changed or constrained values in record
        return {
            ok : ok,
            errors: statuses
        };
    },

    /**
     * When entering inline edit on a record, if it's an existing (already stored) record keep note
     * its originalRecord values (for later undo/audit?)
     * if it's a new (unsaved) record note all it's values as changes to the new record
     * to be saved.
     * Then initiate the recordPendingEditsStart action with the app/table/recId and originalRec if there
     * was one or changes if it's a new record
     * @param recId
     */
    handleEditRecordStart(recId) {
        const flux = this.getFlux();
        let origRec = null;
        let changes = {};

        if (recId !== SchemaConsts.UNSAVED_RECORD_ID) {
            origRec = this.props.reportData.data.hasGrouping ? this.getOrigGroupedRec(recId) : this.getOrigRec(recId);
        } else {
            //add each non null value as to the new record as a change
            let newRec = _.find(this.props.reportData.data.filteredRecords, (rec) => {
                return rec[this.props.uniqueIdentifier].value === recId;
            });
            if (newRec) {
                changes = {};
                // loop thru the values in the new rec add any non nulls to change set
                // so it will be treated as dirty/not saved
                Object.keys(newRec).forEach((key) => {
                    let field = newRec[key];
                    let fieldDef = _.has(this.props, 'reportData.data.fieldsMap') ? this.props.reportData.data.fieldsMap.get(+field.id) : null;
                    if (fieldDef && !fieldDef.builtIn) {
                        let change = {
                            //the + before field.id is needed turn the field id from string into a number
                            oldVal: {value: undefined, id: +field.id},
                            newVal: {value: field.value},
                            fieldName: key,
                            fieldDef : fieldDef
                        };
                        changes[field.id] = change;
                    }
                });
            }
        }
        flux.actions.recordPendingEditsStart(this.props.appId, this.props.tblId, recId, origRec, changes);
    },

    /**
     * When an inline edit is canceled
     * Initiate a recordPendingEditsCancel action the the app/table/recid
     * @param recId
     */
    handleEditRecordCancel(recId) {
        const flux = this.getFlux();
        flux.actions.recordPendingEditsCancel(this.props.appId, this.props.tblId, recId);
    },

    /**
     * Initiate recordPendingEditsChangeField action to hold the unsaved field value change
     * @param change - {fid:fieldid, values : {oldVal :{}, newVal:{}, fieldName:name}
     */
    handleFieldChange(change) {

        // call action to hold the field value change

        const flux = this.getFlux();
        flux.actions.recordPendingEditsChangeField(this.props.appId, this.props.tblId, change.recId, change);
    },

    /**
     *  When inline edit mode and user wants to add a new record
     *  if there are pending edits or this record is not yet saved
     *  try save instead of adding new one
     *  otherwise if there are no unsaved changes add a blank new unsaved record after the
     *  record specified
     * @param afterRecId
     */
    handleRecordNewBlank(afterRecId) {
        const flux = this.getFlux();
        // if there are pending edits or this record is not saved
        // try save instead of adding new one
        if (this.props.pendEdits.isPendingEdit || afterRecId.value === SchemaConsts.UNSAVED_RECORD_ID) {
            this.handleRecordSaveClicked(afterRecId);
        } else {
            flux.actions.newBlankReportRecord(this.props.appId, this.props.tblId, afterRecId);
        }
        return null;
    },


    /**
     * User wants to save changes to a record.
     * @param id
     */
    handleRecordSaveClicked(id) {
        //signal record save action, server will validate and if ok update an existing records with changed values
        // or add a new record
        if (id.value === SchemaConsts.UNSAVED_RECORD_ID) {
            let recordChanges = {};
            if (this.props.pendEdits.recordChanges) {
                recordChanges = _.cloneDeep(this.props.pendEdits.recordChanges);
            }
            this.handleRecordAdd(recordChanges);
        } else {
            this.handleRecordChange(id);
        }
    },

    /**
     * User wants to delete a record
     *
     * @param record
     */
    handleRecordDelete(record) {
        const flux = this.getFlux();
        var recId = record[SchemaConsts.DEFAULT_RECORD_KEY].value;
        //this.props.nameForRecords
        flux.actions.deleteRecord(this.props.appId, this.props.tblId, recId, this.props.nameForRecords);
    },

    /**
     * Save a new record
     * @param recordChanges
     * @returns {Array} of field values for the new record
     */
    handleRecordAdd(recordChanges) {
        const flux = this.getFlux();

        let fields = {};
        if (_.has(this.props, 'fields.fields.data')) {
            fields = this.props.fields.fields.data;
        }
        flux.actions.saveNewRecord(this.props.appId, this.props.tblId, recordChanges, fields);
    },

    /**
     * Save changes to an existing record
     * @param recId
     */
    handleRecordChange(recId) {
        const flux = this.getFlux();
        if (_.has(this.props, 'fields.fields.data')) {
            flux.actions.recordPendingEditsCommit(this.props.appId, this.props.tblId, recId.value);
            flux.actions.saveRecord(this.props.appId, this.props.tblId, recId.value, this.props.pendEdits, this.props.fields.fields.data);
        }
    },


    handleValidateFieldValue(fieldDef, fieldName, value, checkRequired) {
        let results;

        // check the value against the fieldDef
        if (fieldDef) {
            results = ValidationUtils.checkFieldValue({fieldDef}, fieldName, value, checkRequired);
            if (results.isInvalid) {
                // format the message for the client
                results.invalidMessage = ValidationMessage.getMessage(results);
            }
        }
        return results;
    },

    /**
     * when we scroll the grid wrapper, hide the add record
     * icon for a bit
     */
    onScrollRecords() {
        const flux = this.getFlux();

        const createTimeout = () => {
            this.scrollTimer = setTimeout(() => {
                this.scrollTimer = null;
                flux.actions.scrollingReport(false);
            }, 1000);
        };

        if (this.scrollTimer) {
            //reset timeout
            clearTimeout(this.scrollTimer);
            createTimeout();
        } else {
            flux.actions.scrollingReport(true);
            createTimeout();
        }

    },

    isNumericDataType(dataType) {
        return dataType === SchemaConsts.NUMERIC ||
            dataType === SchemaConsts.CURRENCY ||
            dataType === SchemaConsts.PERCENT ||
            dataType === SchemaConsts.RATING;
    },

    isDateDataType(dataType) {
        return dataType === SchemaConsts.DATE_TIME ||
               dataType === SchemaConsts.DATE;
    },

    parseTimeOfDay(timeOfDay) {

        if (timeOfDay && typeof timeOfDay === 'string') {
            //  format is expected to be either hh:mm or hh:mm:ss
            let el = timeOfDay.split(":");
            if (el.length === 2 || el.length === 3) {
                let hr = el[0];
                let min = el[1];
                let sec = 0;
                if (el.length === 3) {
                    sec = el[2];
                }

                //  the date component means nothing to the app..its only purpose is for verifying unit tests
                let parsedDate = new Date(1970, 1, 1, hr, min, sec);
                if (parsedDate instanceof Date) {
                    if (!isNaN(parsedDate.getTime())) {
                        return parsedDate;
                    }
                }
            }
        }

        logger.warn('Invalid grouping header.  Unable to parse time of day group header: ' + timeOfDay);
        return null;
    },

    /**
     * Scan through the grouped data object and where appropriate, localize the grouping headers.
     * Dates, durations and numerics may require localization.  All others fall though and no operation
     * is performed on those types.
     *
     * @param groupFields
     * @param groupDataRecords
     * @param lvl
     */
    localizeGroupingHeaders(groupFields, groupDataRecords, lvl) {

        if (!groupFields || !groupDataRecords) {
            return;
        }

        if (groupFields.length > lvl) {
            //  get the current group by field and grouping type
            let groupField = groupFields[lvl].field;
            let groupType = groupFields[lvl].groupType;

            for (let group in groupDataRecords) {

                //  Recursive call get to the last grouping field, and then update the grouping
                //  labels as we work our way back to the top of the stack.
                if (lvl < groupFields.length - 1) {
                    this.localizeGroupingHeaders(groupFields, groupDataRecords[group].children, lvl + 1);
                }

                let groupData = groupDataRecords[group];

                // unlikely, but possible that groupData is empty
                if (groupData && !groupData.localized) {

                    //  mark that the group label has been localized so that if this component is called
                    //  with already localized data (ie: browser resize), we avoid localizing values
                    //  that have already been localized.
                    groupData.localized = true;

                    //  If no grouping header, use the empty label
                    if (groupData.group === null || groupData.group === '') {
                        groupData.group = Locales.getMessage('groupHeader.empty');
                        continue;
                    }

                    // ensure group label is a string as String.split method is called
                    groupData.group = groupData.group.toString();

                    //  Apply locale specific formatting against DATES, DURATIONS and NUMERICS.  Note that
                    //  some data types and grouping options drop through the conditional blocks.  That's okay
                    //  as these will not have any localization requirements.
                    if (this.isNumericDataType(groupField.datatypeAttributes.type)) {
                        //
                        //  Check if the numeric is a range, with a lower and upper value.
                        let range = groupData.group.split(GROUP_TYPE.delimiter);
                        if (range.length > 1) {
                            //  For ranges,no symbol is used in the header..just localized the number
                            let localizedRange = {
                                lower: this.localizeNumber(range[0]),
                                upper: this.localizeNumber(range[1])
                            };
                            groupData.group = Locales.getMessage('groupHeader.numeric.range', localizedRange);
                        } else {
                            /*eslint no-lonely-if:0*/
                            if (groupType === GROUP_TYPE.COMMON.equals) {
                                //  Currency and percent symbols are added only when group type is equals.
                                if (groupField.datatypeAttributes.type === SchemaConsts.CURRENCY) {
                                    groupData.group = this.localizeNumber(range[0], {style: 'currency', currency: Locales.getCurrencyCode()});
                                } else {
                                    if (groupField.datatypeAttributes.type === SchemaConsts.PERCENT) {
                                        groupData.group = this.localizeNumber(range[0], {style: 'percent'});
                                    } else {
                                        groupData.group = this.localizeNumber(range[0]);
                                    }
                                }
                            } else {
                                groupData.group = this.localizeNumber(range[0]);
                            }
                        }

                        // continue to next element in the for loop
                        continue;
                    }

                    if (this.isDateDataType(groupField.datatypeAttributes.type)) {
                        //
                        //  Based on grouping option, dates may contain 2 pieces of data or just a single value.
                        let datePart = groupData.group.split(GROUP_TYPE.delimiter);
                        if (datePart.length > 1) {
                            switch (groupType) {
                            case GROUP_TYPE.DATE.month:
                                let month = Locales.getMessage('month.' + datePart[0].toLowerCase());
                                groupData.group = Locales.getMessage('groupHeader.date.month', {month: month, year: datePart[1]});
                                break;
                            case GROUP_TYPE.DATE.quarter:
                                let abbrQuarter = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter: abbrQuarter, year: datePart[1]});
                                break;
                            case GROUP_TYPE.DATE.fiscalQuarter:
                                let abbrFiscalQtr = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                let abbrFiscalYr = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[1];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter: abbrFiscalQtr, year: abbrFiscalYr});
                                break;
                            }
                        } else {
                            switch (groupType) {
                            case GROUP_TYPE.DATE.fiscalYear:
                                groupData.group = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[0];
                                break;
                            case GROUP_TYPE.DATE.week:
                                groupData.group = Locales.getMessage('groupHeader.date.week', {date: this.localizeDate(datePart[0])});
                                break;
                            case GROUP_TYPE.DATE.day:
                                groupData.group = this.localizeDate(datePart[0]);
                                break;
                            case GROUP_TYPE.DATE.equals:
                                let opts = null;
                                if (groupField.datatypeAttributes.type === SchemaConsts.DATE_TIME) {
                                    opts = {
                                        year: 'numeric', month: 'numeric', day: 'numeric',
                                        hour: 'numeric', minute: 'numeric'
                                    };
                                }
                                groupData.group = this.localizeDate(datePart[0], opts);

                                //  i18n-react appends a comma after the date for en-us --> 07/22/2015, 09:44 AM -- Replace with space
                                if (groupField.datatypeAttributes.type === SchemaConsts.DATE_TIME && Locales.getLocale() === 'en-us') {
                                    groupData.group = groupData.group.replace(',', ' ');
                                }

                                break;
                            }
                        }

                        // continue to next element in the for loop
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === SchemaConsts.TIME_OF_DAY) {

                        let timeOfDay = null;

                        switch (groupType) {
                        case GROUP_TYPE.TIME_OF_DAY.equals:
                        case GROUP_TYPE.TIME_OF_DAY.second:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric', second: 'numeric'});
                            }
                            break;
                        case GROUP_TYPE.TIME_OF_DAY.minute:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric'});
                            }
                            break;
                        case GROUP_TYPE.TIME_OF_DAY.hour:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric'});
                            }
                            break;
                        case GROUP_TYPE.TIME_OF_DAY.am_pm:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = (timeOfDay.getHours() < 12 ? Locales.getMessage('groupHeader.am') : Locales.getMessage('groupHeader.pm'));
                            }
                            break;
                        }

                        // continue to next element in the for loop
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === SchemaConsts.DURATION) {
                        //  With duration of equals, the group value contains 2 pieces of information;
                        //  the 1st is the duration value; the 2nd is the group type.
                        if (groupType === GROUP_TYPE.DURATION.equals) {
                            let durationPart = groupData.group.split(GROUP_TYPE.delimiter);
                            if (durationPart.length > 1) {
                                groupData.group = durationPart[0];
                                //  reset the groupType to the duration dimension
                                groupType = durationPart[1];
                            }
                        }

                        let messageKey = '';
                        switch (groupType) {
                        case GROUP_TYPE.DURATION.second:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.second' : 'groupHeader.duration.seconds';
                            break;
                        case GROUP_TYPE.DURATION.minute:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.minute' : 'groupHeader.duration.minutes';
                            break;
                        case GROUP_TYPE.DURATION.hour:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.hour' : 'groupHeader.duration.hours';
                            break;
                        case GROUP_TYPE.DURATION.week:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.week' : 'groupHeader.duration.weeks';
                            break;
                        case GROUP_TYPE.DURATION.day:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.day' : 'groupHeader.duration.days';
                            break;
                        }

                        // this should not happen, but in the event messageKey is empty(meaning bad duration data),
                        // this falls through and the original content in groupData.group is used as the grouping header.
                        if (messageKey) {
                            groupData.group = Locales.getMessage(messageKey, {duration: groupData.group});
                        }
                    }
                }
            }

        }
    },

    /**
     * Directly call the I18n mixin method to localize the number.  Any error
     * trying to localize will return the original value.
     *
     * @param value
     * @param opts
     * @returns {*}
     */
    localizeNumber: function(value, opts) {
        try {
            this.context.locales = Locales.getLocale();
            return this.formatNumber(value, opts);
        } catch (e) {
            logger.warn("Error attempting to localize a numbered group.  Group value: " + value);
            return value;
        }
    },

    /**
     * Directly call the I18n mixin method to localize the date.  Any error
     * trying to localize will return the original date.
     *
     * @param date
     * @returns {*}
     */
    localizeDate: function(date, opts) {
        try {
            this.context.locales = Locales.getLocale();
            return this.formatDate(date, opts);
        } catch (e) {
            logger.warn("Error attempting to localize a date group.  Group value: " + date);
            return date;
        }
    },

    /**
     * when report changed from not loading to loading start measure of components performance
     *  @param nextProps
     */
    startPerfTiming(nextProps) {
        if (_.has(this.props, 'reportData.loading') &&
                !this.props.reportData.loading &&
                nextProps.reportData.loading) {
            let flux = this.getFlux();
            flux.actions.mark('component-ReportContent start');
        }
    },

    /**
     * when report changed from loading to loaded finish measure of components performance
     * @param prevProps
     */
    capturePerfTiming(prevProps) {
        let timingContextData = {numReportCols:0, numReportRows:0};
        let flux = this.getFlux();
        if (_.has(this.props, 'reportData.loading') &&
                !this.props.reportData.loading &&
                prevProps.reportData.loading) {
            flux.actions.measure('component-ReportContent', 'component-ReportContent start');

            // note the size of the report with the measure
            if (_.has(this.props, 'reportData.data.columns.length')) {
                let reportData = this.props.reportData.data;
                timingContextData.numReportCols = reportData.columns.length;
                timingContextData.numReportRows = reportData.filteredRecordsCount ?
                    reportData.filteredRecordsCount : reportData.recordsCount;
            }
            flux.actions.logMeasurements(timingContextData);
        }
    },

    componentWillUpdate(nextProps) {
        this.startPerfTiming(nextProps);
    },

    componentDidUpdate(prevProps) {
        this.capturePerfTiming(prevProps);
    },


    render() {

        let isSmall = Breakpoints.isSmallBreakpoint();
        let recordsCount = 0;
        let keyField = SchemaConsts.DEFAULT_RECORD_KEY;
        if (this.props.keyField) {
            keyField = this.props.keyField;
        } else if (this.props.fields && this.props.fields.keyField && this.props.fields.keyField.name) {
            keyField = this.props.fields.keyField.name;
        }

        if (this.props.reportData && this.props.reportData.data) {
            let reportData = this.props.reportData.data;
            recordsCount = reportData.filteredRecordsCount ? reportData.filteredRecordsCount : reportData.recordsCount;
            this.localizeGroupingHeaders(reportData.groupFields, reportData.filteredRecords, 0);
        }

        // Hide the footer if any rows are selected and for small breakpoint.
        const selectedRows = this.props.selectedRows;
        let areRowsSelected = !!(selectedRows && selectedRows.length > 0);
        let showFooter = !this.props.reactabular  && !areRowsSelected && !isSmall;

        const isInlineEditOpen = this.props.pendEdits && this.props.pendEdits.isInlineEditOpen;
        const editErrors = (this.props.pendEdits && this.props.pendEdits.editErrors) ? this.props.pendEdits.editErrors : null;
        return (
                <div className="loadedContent">
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <div className={isInlineEditOpen ? "reportContent inlineEditing" : "reportContent"}>

                        {!isSmall && this.props.reactabular &&
                        <QBGrid records={this.props.reportData.data ? this.props.reportData.data.filteredRecords : []}
                                columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                                uniqueIdentifier={this.props.uniqueIdentifier ||  SchemaConsts.DEFAULT_RECORD_KEY}
                                keyField={this.props.keyField}
                                selectedRows={this.props.selectedRows}
                                onRowClick={this.openRow}
                                onEditRecordStart={this.handleEditRecordStart}
                                onEditRecordCancel={this.handleEditRecordCancel}
                                onFieldChange={this.handleFieldChange}
                                onRecordChange={this.handleRecordChange}
                                appUsers={this.props.appUsers}
                                appId={this.props.reportData.appId}
                                tblId={this.props.reportData.tblId}
                                rptId={this.props.reportData.rptId}
                                isInlineEditOpen={isInlineEditOpen}
                                pendEdits={this.props.pendEdits}
                                editErrors={editErrors}
                                showGrouping={this.props.reportData.data ? this.props.reportData.data.hasGrouping : false}
                                recordsCount={recordsCount}
                                groupLevel={this.props.reportData.data ? this.props.reportData.data.groupLevel : 0}
                                groupEls={this.props.reportData.data ? this.props.reportData.data.groupEls : []}
                                sortFids={this.props.reportData.data ? this.props.reportData.data.sortFids : []}
                                filter={{selections: this.props.reportData.selections,
                                        facet: this.props.reportData.facetExpression,
                                        search: this.props.reportData.searchStringForFiltering}}
                        />}
                        {!isSmall && !this.props.reactabular &&
                        <AGGrid loading={this.props.reportData.loading}
                                editingIndex={this.props.reportData.editingIndex}
                                editingId={this.props.reportData.editingId}
                                records={this.props.reportData.data ? _.cloneDeep(this.props.reportData.data.filteredRecords) : []}
                                columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                                uniqueIdentifier={this.props.uniqueIdentifier || SchemaConsts.DEFAULT_RECORD_KEY}
                                keyField={keyField}
                                appId={this.props.reportData.appId}
                                appUsers={this.props.appUsers}
                                isInlineEditOpen={isInlineEditOpen}
                                pendEdits={this.props.pendEdits}
                                editErrors={editErrors}
                                onRecordDelete={this.handleRecordDelete}
                                onEditRecordStart={this.handleEditRecordStart}
                                onEditRecordCancel={this.handleEditRecordCancel}
                                onFieldChange={this.handleFieldChange}
                                onRecordChange={this.handleRecordChange}
                                onRecordAdd={this.handleRecordAdd}
                                onRecordNewBlank={this.handleRecordNewBlank}
                                onRecordSaveClicked={this.handleRecordSaveClicked}
                                validateRecord={this.validateRecord}
                                validateFieldValue={this.handleValidateFieldValue}
                                getOrigRec={this.getOrigRec}
                                getPendingChanges={this.getPendingChanges}
                                tblId={this.props.reportData.tblId}
                                rptId={this.props.reportData.rptId}
                                reportHeader={this.props.reportHeader}
                                reportFooter={this.props.reportFooter}
                                pageActions={this.props.pageActions}
                                selectionActions={<ReportActions appId={this.props.reportData.appId} tblId={this.props.reportData.tblId} rptId={this.props.reportData.rptId} nameForRecords={this.props.nameForRecords} />}
                                onScroll={this.onScrollRecords}
                                onRowClick={this.openRow}
                                showGrouping={this.props.reportData.data ? this.props.reportData.data.hasGrouping : false}
                                recordsCount={recordsCount}
                                groupLevel={this.props.reportData.data ? this.props.reportData.data.groupLevel : 0}
                                groupEls={this.props.reportData.data ? this.props.reportData.data.groupEls : []}
                                sortFids={this.props.reportData.data ? this.props.reportData.data.sortFids : []}
                                filter={{selections: this.props.reportData.selections,
                                        facet: this.props.reportData.facetExpression,
                                        search: this.props.reportData.searchStringForFiltering}}/>
                        }
                        {showFooter &&
                        <ReportFooter
                            reportData={this.props.reportData}
                            getNextReportPage={this.props.reportFooter.props.getNextReportPage}
                            getPreviousReportPage={this.props.reportFooter.props.getPreviousReportPage}
                            pageStart={this.props.reportFooter.props.pageStart}
                            pageEnd={this.props.reportFooter.props.pageEnd}
                            recordsCount={this.props.reportFooter.props.recordsCount}/>
                        }
                        {isSmall &&
                        <CardViewListHolder reportData={this.props.reportData}
                                            appUsers={this.props.appUsers}
                                            uniqueIdentifier={SchemaConsts.DEFAULT_RECORD_KEY}
                                            keyField={keyField}
                                            reportHeader={this.props.reportHeader}
                                            selectionActions={<ReportActions selection={this.props.selectedRows}/>}
                                            onScroll={this.onScrollRecords}
                                            onRowClicked={this.openRow}
                                            selectedRows={this.props.selectedRows}
                                            pageStart={this.props.cardViewPagination.props.pageStart}
                                            pageEnd={this.props.cardViewPagination.props.pageEnd}
                                            getNextReportPage={this.props.cardViewPagination.props.getNextReportPage}
                                            getPreviousReportPage={this.props.cardViewPagination.props.getPreviousReportPage}/>
                        }
                    </div>
                }
            </div>
        );
    }

});

ReportContent.contextTypes = {
    touch: React.PropTypes.bool
};

ReportContent.propTypes = {
    pendEdits: React.PropTypes.object.isRequired
};

export let ReportContentWithRouter = withRouter(ReportContent);
export default ReportContentWithRouter;
