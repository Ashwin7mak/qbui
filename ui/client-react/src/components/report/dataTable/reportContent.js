import React from 'react';
import ReactDOM from 'react-dom';
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
var IntlMixin = ReactIntl.IntlMixin;

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

                    groupData.localized = true;

                    //  If no grouping header, use the empty label
                    if (groupData.group === null || groupData.group === '') {
                        groupData.group = Locales.getMessage('groupHeader.empty');
                        continue;
                    }

                    //  Apply locale specific formatting against certain data types.  Note all data types may
                    //  drop through the conditional blocks.  That's okay as some grouping options will not
                    //  have any localization requirements.
                    if (this.isNumericDataType(groupField.datatypeAttributes.type)) {
                        let range = groupData.group.split(GroupTypes.GROUP_TYPE.delimiter);
                        if (range.length > 1) {
                            groupData.group = Locales.getMessage('groupHeader.numeric.range', {lower:range[0], upper:range[1]});
                        } else {
                            /*eslint no-lonely-if:0*/
                            if (groupType === GroupTypes.COMMON.equals) {
                                //  On old stack, only group type=equals includes the associated symbol..
                                //  For now, will mirror that behavior
                                if (groupField.datatypeAttributes.type === DataTypes.CURRENCY) {
                                    groupData.group = this.localizeCurrency(range[0]);
                                } else {
                                    if (groupField.datatypeAttributes.type === DataTypes.PERCENT) {
                                        groupData.group = this.localizePercent(range[0]);
                                    } else {
                                        groupData.group = this.localizeNumber(range[0]);
                                    }
                                }
                            }
                        }
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === DataTypes.DATE || groupField.datatypeAttributes.type === DataTypes.DATE_TIME) {
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
                                let localizedDate = this.localizeDate(datePart[0]);
                                groupData.group = Locales.getMessage('groupHeader.date.week', {date:localizedDate});
                            }
                            if (groupType === GroupTypes.GROUP_TYPE.date.equals || groupType === GroupTypes.GROUP_TYPE.date.day) {
                                groupData.group = this.localizeDate(datePart[0]);
                            }
                        }
                        continue;
                    }

                    if (groupField.datatypeAttributes.type === DataTypes.DURATION) {
                        //  With duration of equals, the groupType is unknown as that is determined based
                        //  on the most reasonable grouping bucket for the given duration.  For example,
                        //  20 seconds --> seconds bucket; 200 seconds --> minute bucket; etc.  The returned
                        //  include 2 pieces of information;  1st is the duration value; 2nd is the group type
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
                        // the original content will be used as the grouping header.
                        if (messageKey) {
                            groupData.group = Locales.getMessage(messageKey, {duration:groupData.group});
                        }
                    }
                }
            }
        }
    },

    localizeCurrency: function(currency) {
        return this.localizeNumber(currency, {style: "currency", currency: Locales.getCurrencyCode()});
    },

    localizePercent: function(percentage) {
        return this.localizeNumber(percentage, {style: "percent"});
    },

    localizeNumber: function(value, opts) {
        try {
            this.context.locales = Locales.getLocale();
            return this.formatNumber(value, opts);
        } catch (e) {
            logger.warn("Error attempting to localize a numbered group.  Group value: " + value);
            return value;
        }
    },

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
