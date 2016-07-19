import React from "react";
import ReactIntl from "react-intl";
import CardViewListHolder from "../../../components/dataTable/cardView/cardViewListHolder";
import AGGrid from "../../../components/dataTable/agGrid/agGrid";
import QBGrid from "../../../components/dataTable/agGrid/qbGrid";
import Logger from "../../../utils/logger";
import ReportActions from "../../actions/reportActions";
import Fluxxor from "fluxxor";
import * as SchemaConsts from "../../../constants/schema";
import * as GroupTypes from "../../../constants/groupTypes";
import Locales from "../../../locales/locales";
import _ from 'lodash';

let logger = new Logger();

let IntlMixin = ReactIntl.IntlMixin;
let FluxMixin = Fluxxor.FluxMixin(React);

let ReportContent = React.createClass({
    mixins: [FluxMixin, IntlMixin],

    contextTypes: {
        history: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            showSelectionColumn: false,
            reactabular: false
        };
    },

    // row was clicked once, navigate to record
    openRow(data) {

        const appId = this.props.appId;
        const tblId = this.props.tblId;
        var recId = data[this.props.uniqueIdentifier].value;
        //create the link we want to send the user to and then send them on their way
        const link = `/app/${appId}/table/${tblId}/record/${recId}`;

        this.props.history.pushState(null, link);
    },


    getOrigRec(recid) {
        let orig = {names:{}, fids:{}};
        let recs = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];
        let keyField =  this.props.keyField;
        recs.find(function(rec) {
            var keys = Object.keys(rec);
            keys.find((col) => {
                if (col === keyField && rec[col].value === recid) {
                    orig.names = rec;
                    var fids = {};
                    var recKeys = Object.keys(rec);
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

    handleEditRecordStart(recId) {
        const flux = this.getFlux();
        let origRec = this.getOrigRec(recId);
        flux.actions.recordPendingEditsStart(this.props.appId, this.props.tblId, recId, origRec);
    },

    handleEditRecordCancel(recId) {
        const flux = this.getFlux();
        flux.actions.recordPendingEditsCancel(this.props.appId, this.props.tblId, recId);
    },

    handleFieldChange(change) {

        // call action to hold the field value change
        const flux = this.getFlux();
        flux.actions.recordPendingEditsChangeField(this.props.appId, this.props.tblId, change.recId, change);
        let changes = {};
        if (_.has(this.props, 'pendEdits.recordChanges')) {
            changes = _.cloneDeep(this.props.pendEdits.recordChanges);
        }
        if (typeof (changes[change.fid]) === 'undefined') {
            changes[change.fid] = {};
        }
        changes[change.fid].oldVal = _.has(change, 'values.oldVal') ? change.values.oldVal : null;
        changes[change.fid].newVal = _.has(change, 'values.newVal') ? change.values.newVal : null;
        changes[change.fid].fieldName = _.has(change, 'fieldName') ? change.fieldName : null;

    },

    handleRecordChange(recId) {
        const flux = this.getFlux();

        // get the current data
        let changes = {};
        if (_.has(this.props, 'pendEdits.recordChanges')) {
            changes = _.cloneDeep(this.props.pendEdits.recordChanges);
        }
        //calls action to save the record changes
        // validate happen here or in action

        let payload = [];
        // columns id and new values array
        //[{"id":6, "value":"Claire"}]

        Object.keys(changes).forEach((key) => {
            let newValue = changes[key].newVal.value;
            let newDisplay = changes[key].newVal.display;
            if (_.has(this.props, 'pendEdits.originalRecord.fids')) {
                if (newValue !== this.props.pendEdits.originalRecord.fids[key].value) {
                    let colChange = {};
                    colChange.fieldName = changes[key].fieldName;
                    colChange.id = +key;
                    colChange.value = _.cloneDeep(newValue);
                    colChange.display = _.cloneDeep(newDisplay);
                    payload.push(colChange);
                }
            }
        });
        //for (changes)
        flux.actions.recordPendingEditsCommit(this.props.appId, this.props.tblId, recId.value);
        flux.actions.saveReportRecord(this.props.appId, this.props.tblId, recId.value, payload);

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
                        let range = groupData.group.split(GroupTypes.GROUP_TYPE.delimiter);
                        if (range.length > 1) {
                            //  For ranges,no symbol is used in the header..just localized the number
                            let localizedRange = {
                                lower: this.localizeNumber(range[0]),
                                upper: this.localizeNumber(range[1])
                            };
                            groupData.group = Locales.getMessage('groupHeader.numeric.range', localizedRange);
                        } else {
                            /*eslint no-lonely-if:0*/
                            if (groupType === GroupTypes.COMMON.equals) {
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
                        let datePart = groupData.group.split(GroupTypes.GROUP_TYPE.delimiter);
                        if (datePart.length > 1) {
                            switch (groupType) {
                            case GroupTypes.GROUP_TYPE.date.month:
                                let month = Locales.getMessage('month.' + datePart[0].toLowerCase());
                                groupData.group = Locales.getMessage('groupHeader.date.month', {month: month, year: datePart[1]});
                                break;
                            case GroupTypes.GROUP_TYPE.date.quarter:
                                let abbrQuarter = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter: abbrQuarter, year: datePart[1]});
                                break;
                            case GroupTypes.GROUP_TYPE.date.fiscalQuarter:
                                let abbrFiscalQtr = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                let abbrFiscalYr = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[1];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter: abbrFiscalQtr, year: abbrFiscalYr});
                                break;
                            }
                        } else {
                            switch (groupType) {
                            case GroupTypes.GROUP_TYPE.date.fiscalYear:
                                groupData.group = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[0];
                                break;
                            case GroupTypes.GROUP_TYPE.date.week:
                                groupData.group = Locales.getMessage('groupHeader.date.week', {date: this.localizeDate(datePart[0])});
                                break;
                            case GroupTypes.GROUP_TYPE.date.day:
                                groupData.group = this.localizeDate(datePart[0]);
                                break;
                            case GroupTypes.GROUP_TYPE.date.equals:
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
                        case GroupTypes.GROUP_TYPE.timeOfDay.equals:
                        case GroupTypes.GROUP_TYPE.timeOfDay.second:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric', second: 'numeric'});
                            }
                            break;
                        case GroupTypes.GROUP_TYPE.timeOfDay.minute:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric'});
                            }
                            break;
                        case GroupTypes.GROUP_TYPE.timeOfDay.hour:
                            timeOfDay = this.parseTimeOfDay(groupData.group);
                            if (timeOfDay) {
                                groupData.group = this.localizeDate(timeOfDay, {hour: 'numeric', minute: 'numeric'});
                            }
                            break;
                        case GroupTypes.GROUP_TYPE.timeOfDay.am_pm:
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
                        if (groupType === GroupTypes.GROUP_TYPE.duration.equals) {
                            let durationPart = groupData.group.split(GroupTypes.GROUP_TYPE.delimiter);
                            if (durationPart.length > 1) {
                                groupData.group = durationPart[0];
                                //  reset the groupType to the duration dimension
                                groupType = durationPart[1];
                            }
                        }

                        let messageKey = '';
                        switch (groupType) {
                        case GroupTypes.GROUP_TYPE.duration.second:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.second' : 'groupHeader.duration.seconds';
                            break;
                        case GroupTypes.GROUP_TYPE.duration.minute:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.minute' : 'groupHeader.duration.minutes';
                            break;
                        case GroupTypes.GROUP_TYPE.duration.hour:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.hour' : 'groupHeader.duration.hours';
                            break;
                        case GroupTypes.GROUP_TYPE.duration.week:
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.week' : 'groupHeader.duration.weeks';
                            break;
                        case GroupTypes.GROUP_TYPE.duration.day:
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

    //when report changed from not loading to loading start measure of components performance
    startPerfTiming(nextProps) {
        if (_.has(this.props, 'reportData.loading') &&
                !this.props.reportData.loading &&
                nextProps.reportData.loading) {
            let flux = this.getFlux();
            flux.actions.mark('component-ReportContent start');
        }
    },

    //when report changed from loading to loaded finish measure of components performance
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

    /* TODO: paging component that has "next and previous tied to callbacks from the store to get new data set*/
    render: function() {
        let isTouch = this.context.touch;
        let recordCount = 0;
        if (this.props.reportData) {
            let reportData = this.props.reportData.data;
            if (reportData) {
                recordCount = reportData.filteredRecordsCount ? reportData.filteredRecordsCount : reportData.recordsCount;
                this.localizeGroupingHeaders(reportData.groupFields, reportData.filteredRecords, 0);
            }
        }
        return (<div className="loadedContent">
                <label>&nbsp;
                    <input type="checkbox"
                           defaultChecked={this.state.reactabular}
                           onClick={(e) => {this.setState({reactabular: e.target.checked});}}/>&nbsp;Reactabular
                </label>
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <div className="reportContent">

                        {!isTouch && this.state.reactabular &&
                        <QBGrid records={this.props.reportData.data ? this.props.reportData.data.filteredRecords : []}
                                columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                                uniqueIdentifier="Record ID#"
                                keyField={this.props.keyField}
                                selectedRows={this.props.selectedRows}
                                onRowClick={this.openRow}
                                onEditRecordStart={this.handleEditRecordStart}
                                onEditRecordCancel={this.handleEditRecordCancel}
                                onFieldChange={this.handleFieldChange}
                                onRecordChange={this.handleRecordChange}
                        />}

                        {!isTouch && !this.state.reactabular &&
                        <AGGrid loading={this.props.reportData.loading}
                                records={this.props.reportData.data ? _.cloneDeep(this.props.reportData.data.filteredRecords) : []}
                                columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                                uniqueIdentifier={SchemaConsts.DEFAULT_RECORD_KEY}
                                keyField={this.props.keyField}
                                appId={this.props.reportData.appId}
                                onEditRecordStart={this.handleEditRecordStart}
                                onEditRecordCancel={this.handleEditRecordCancel}
                                onFieldChange={this.handleFieldChange}
                                onRecordChange={this.handleRecordChange}
                                getOrigRec={this.getOrigRec}
                                getPendingChanges={this.getPendingChanges}
                                tblId={this.props.reportData.tblId}
                                rptId={this.props.reportData.rptId}
                                reportHeader={this.props.reportHeader}
                                pageActions={this.props.pageActions}
                                selectionActions={<ReportActions />}
                                onScroll={this.onScrollRecords}
                                onRowClick={this.openRow}
                                showGrouping={this.props.reportData.data ? this.props.reportData.data.hasGrouping : false}
                                recordCount={recordCount}
                                groupLevel={this.props.reportData.data ? this.props.reportData.data.groupLevel : 0}
                                groupEls={this.props.reportData.data ? this.props.reportData.data.groupEls : []}
                                sortFids={this.props.reportData.data ? this.props.reportData.data.sortFids : []}
                                filter={{selections: this.props.reportData.selections,
                                        facet: this.props.reportData.facetExpression,
                                        search: this.props.reportData.searchStringForFiltering}}/>
                        }
                        {isTouch &&
                            <CardViewListHolder reportData={this.props.reportData}
                                uniqueIdentifier={SchemaConsts.DEFAULT_RECORD_KEY}
                                keyField={this.props.fields && this.props.fields.keyField ?
                                    this.props.fields.keyField.name : SchemaConsts.DEFAULT_RECORD_KEY }
                                reportHeader={this.props.reportHeader}
                                selectionActions={<ReportActions />}
                                onScroll={this.onScrollRecords}
                                selectedRows={this.props.selectedRows}/>
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

export default ReportContent;
