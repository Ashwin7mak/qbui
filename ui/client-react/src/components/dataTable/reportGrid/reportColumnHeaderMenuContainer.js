import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import ReportUtils from '../../../utils/reportUtils';
import serverTypeConsts from '../../../../../common/src/constants';
import * as query from '../../../constants/query';
import {GROUP_TYPE} from '../../../../../common/src/groupTypes';

import {loadDynamicReport} from '../../../actions/reportActions';
import {CONTEXT} from '../../../actions/context';

/**
 * A wrapper for ReportColumnMenuContainer that has a link to the flux stores. Separates presentational from business
 * logic for the ReportColumnHeaderMenu and makes that menu component more reusable in other contexts.
 * @param ReportColumnHeaderMenu
 * @returns {*}
 * @constructor
 */
const ReportColumnHeaderMenuContainer = (ReportColumnHeaderMenu) => {
    return React.createClass({

        propTypes: {
            appId: PropTypes.string,
            tblId: PropTypes.string,
            rptId: PropTypes.string,
            fieldDef: PropTypes.object,
            sortFids: PropTypes.array
        },

        /**
         * Checks to make sure appId, tblId, and reportId have been passed in and are not null.
         * We can't use required here, because the component may load before the ids are available and passed down.
         */
        hasRequiredIds() {
            let {appId, rptId, tblId} = this.props;
            return (appId && rptId && tblId);
        },

        /**
         * On selection of group option from menu fire off the action to sort the data
         * @param column
         * @param asc
         */
        groupReport(column, asc) {
            if (!this.hasRequiredIds()) {return;}

            //for on-the-fly grouping, forget the previous group and go with the selection but add the previous sort fids.
            let sortFid = column.id.toString();
            let groupString = ReportUtils.getGroupString(sortFid, asc, GROUP_TYPE.TEXT.equals);

            let sortList = ReportUtils.getSortListString(this.props.sortFids);
            let sortListParam = ReportUtils.prependSortFidToList(sortList, groupString);

            let offset = this.props.reportData && this.props.reportData.pageOffset ? this.props.reportData.pageOffset : serverTypeConsts.PAGE.DEFAULT_OFFSET;
            let numRows = this.props.reportData && this.props.reportData.numRows ? this.props.reportData.numRows : serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

            let queryParams = {};
            queryParams[query.OFFSET_PARAM] = offset;
            queryParams[query.NUMROWS_PARAM] = numRows;
            queryParams[query.SORT_LIST_PARAM] = sortListParam;

            this.props.dispatch(loadDynamicReport(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, this.props.rptId, true, this.props.filter, queryParams));
        },

        /**
         * On selection of sort option from menu fire off the action to sort the data
         * @param column
         * @param asc
         */
        sortReport(column, asc, alreadySorted) {
            if (!this.hasRequiredIds()) {return;}

            if (alreadySorted) {
                return;
            }

            let queryParams = {};
            // for on-the-fly sort selection, this selection will result in removal of old sort order
            // BUT since out grouped fields are also sorted we still need to keep those in the sort list.
            let sortFid = asc ? column.id.toString() : "-" + column.id.toString();

            let sortList = ReportUtils.getSortListString(this.props.groupEls);
            queryParams[query.SORT_LIST_PARAM] = ReportUtils.appendSortFidToList(sortList, sortFid);
            queryParams[query.OFFSET_PARAM] = this.props.reportData && this.props.reportData.pageOffset ? this.props.reportData.pageOffset : serverTypeConsts.PAGE.DEFAULT_OFFSET;
            queryParams[query.NUMROWS_PARAM] = this.props.reportData && this.props.reportData.numRows ? this.props.reportData.numRows : serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

            this.props.dispatch(loadDynamicReport(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, this.props.rptId, true, this.props.filter, queryParams));
        },

        render() {
            return (<ReportColumnHeaderMenu
                sortReport={this.sortReport}
                groupReport={this.groupReport}
                {...this.props}
            />);
        }
    });
};

export default ReportColumnHeaderMenuContainer;
