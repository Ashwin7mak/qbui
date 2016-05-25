import React from 'react';
import ReactIntl from 'react-intl';

import CardViewListHolder from '../../../components/dataTable/cardView/cardViewListHolder';
import AGGrid  from '../../../components/dataTable/agGrid/agGrid';
import {reactCellRendererFactory} from 'ag-grid-react';

import Logger from '../../../utils/logger';
let logger = new Logger();

import ReportActions from '../../actions/reportActions';
import Fluxxor from 'fluxxor';

import * as DataTypes from '../../../constants/schema';
import * as GroupTypes from '../../../constants/groupTypes';
import Locales from '../../../locales/locales';

let IntlMixin = ReactIntl.IntlMixin;
let FluxMixin = Fluxxor.FluxMixin(React);

let ReportContent = React.createClass({
    mixins: [FluxMixin, IntlMixin],

    contextTypes: {
        history: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            showSelectionColumn: false
        };
    },

    // row was clicked once, navigate to record
    openRow(data) {

        const appId = this.props.appId;
        const tblId = this.props.tblId;
        var recId = data[this.props.uniqueIdentifier];
        //create the link we want to send the user to and then send them on their way
        const link = `/app/${appId}/table/${tblId}/record/${recId}`;

        this.props.history.pushState(null, link);
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
        return dataType === DataTypes.NUMERIC ||
            dataType === DataTypes.CURRENCY ||
            dataType === DataTypes.PERCENT ||
            dataType === DataTypes.RATING;
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
                                lower:this.localizeNumber(range[0]),
                                upper:this.localizeNumber(range[1])
                            };
                            groupData.group = Locales.getMessage('groupHeader.numeric.range', localizedRange);
                        } else {
                            /*eslint no-lonely-if:0*/
                            if (groupType === GroupTypes.COMMON.equals) {
                                //  Currency and percent symbols are added only when group type is equals.
                                if (groupField.datatypeAttributes.type === DataTypes.CURRENCY) {
                                    groupData.group = this.localizeNumber(range[0], {style: 'currency', currency: Locales.getCurrencyCode()});
                                } else {
                                    if (groupField.datatypeAttributes.type === DataTypes.PERCENT) {
                                        groupData.group = this.localizeNumber(range[0], {style: 'percent'});
                                    } else {
                                        groupData.group = this.localizeNumber(range[0]);
                                    }
                                }
                            } else {
                                groupData.group = this.localizeNumber(range[0]);
                            }
                        }
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === DataTypes.DATE || groupField.datatypeAttributes.type === DataTypes.DATE_TIME) {
                        //
                        //  Based on grouping option, dates may contain 2 pieces of data or just a single value.
                        let datePart = groupData.group.split(GroupTypes.GROUP_TYPE.delimiter);
                        if (datePart.length > 1) {
                            if (groupType === GroupTypes.GROUP_TYPE.date.month) {
                                let month = Locales.getMessage('month.' + datePart[0].toLowerCase());
                                groupData.group = Locales.getMessage('groupHeader.date.month', {month:month, year:datePart[1]});
                            }
                            if (groupType === GroupTypes.GROUP_TYPE.date.quarter) {
                                let abbrQuarter = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter:abbrQuarter, year:datePart[1]});
                            }
                            if (groupType === GroupTypes.GROUP_TYPE.date.fiscalQuarter) {
                                let abbrQuarter = Locales.getMessage('groupHeader.abbr.quarter') + datePart[0];
                                let abbrFiscalYr = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[1];
                                groupData.group = Locales.getMessage('groupHeader.date.quarter', {quarter:abbrQuarter, year:abbrFiscalYr});
                            }
                        } else {
                            if (groupType === GroupTypes.GROUP_TYPE.date.fiscalYear) {
                                groupData.group = Locales.getMessage('groupHeader.abbr.fiscalYear') + datePart[0];
                            }
                            if (groupType === GroupTypes.GROUP_TYPE.date.week) {
                                groupData.group = Locales.getMessage('groupHeader.date.week', {date:this.localizeDate(datePart[0])});
                            }
                            if (groupType === GroupTypes.GROUP_TYPE.date.equals || groupType === GroupTypes.GROUP_TYPE.date.day) {
                                groupData.group = this.localizeDate(datePart[0]);
                            }
                        }
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === DataTypes.DURATION) {
                        //  With duration of equals, the group value contains 2 pieces of information;
                        //  the 1st is the duration value; the 2nd is the group type.
                        if (groupType === GroupTypes.GROUP_TYPE.duration.equals) {
                            let durationPart = groupData.group.split(GroupTypes.GROUP_TYPE.delimiter);
                            if (durationPart.length > 1) {
                                groupData.group = durationPart[0];
                                groupType = durationPart[1];
                            }
                        }

                        let messageKey = '';
                        if (groupType === GroupTypes.GROUP_TYPE.duration.second) {
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.second' : 'groupHeader.duration.seconds';
                        }
                        if (groupType === GroupTypes.GROUP_TYPE.duration.minute) {
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.minute' : 'groupHeader.duration.minutes';
                        }
                        if (groupType === GroupTypes.GROUP_TYPE.duration.hour) {
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.hour' : 'groupHeader.duration.hours';
                        }
                        if (groupType === GroupTypes.GROUP_TYPE.duration.week) {
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.week' : 'groupHeader.duration.weeks';
                        }
                        if (groupType === GroupTypes.GROUP_TYPE.duration.day) {
                            messageKey = Math.abs(groupData.group) === 1 ? 'groupHeader.duration.day' : 'groupHeader.duration.days';
                        }

                        // this should not happen, but in the event messageKey is empty(meaning bad duration data),
                        // this falls through and the original content is used as the grouping header.
                        if (messageKey) {
                            groupData.group = Locales.getMessage(messageKey, {duration:groupData.group});
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
    localizeDate: function(date) {
        try {
            this.context.locales = Locales.getLocale();
            return this.formatDate(date);
        } catch (e) {
            logger.warn("Error attempting to localize a date group.  Group value: " + date);
            return date;
        }
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
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <div className="reportContent">
                        {!isTouch ?
                            <AGGrid loading={this.props.reportData.loading}
                                    records={this.props.reportData.data ? this.props.reportData.data.filteredRecords : []}
                                    columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                                    uniqueIdentifier="Record ID#"
                                    appId={this.props.reportData.appId}
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
                                        search: this.props.reportData.searchStringForFiltering}} /> :
                            <CardViewListHolder reportData={this.props.reportData}
                                uniqueIdentifier="Record ID#"
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
