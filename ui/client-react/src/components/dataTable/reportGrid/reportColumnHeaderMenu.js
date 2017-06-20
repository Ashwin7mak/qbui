import React, {Component, PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import * as FieldConsts from '../../../constants/schema';
import Locale from '../../../locales/locales';
import {I18nMessage} from '../../../utils/i18nMessage';
import QbIcon from '../../qbIcon/qbIcon';
import {connect} from 'react-redux';
import {loadDynamicReport} from '../../../actions/reportActions';
import {hideColumn, insertPlaceholderColumn} from '../../../actions/reportBuilderActions';
import _ from 'lodash';

import ReportUtils from '../../../utils/reportUtils';
import serverTypeConsts from '../../../../../common/src/constants';
import * as query from '../../../constants/query';
import {GROUP_TYPE} from '../../../../../common/src/groupTypes';
import {CONTEXT} from '../../../actions/context';

const SORTING_MESSAGE = 'sort';
const GROUPING_MESSAGE = 'group';

/**
 * A component that displays the column header menu for grouping/sorting records and adding/hiding columns on a report
 */
export class ReportColumnHeaderMenu extends Component {
    constructor(props) {
        super(props);

    }

    /**
     * Checks to make sure appId, tblId, and reportId have been passed in and are not null.
     * We can't use required here, because the component may load before the ids are available and passed down.
     */
    hasRequiredIds() {
        let {appId, rptId, tblId} = this.props;
        return (appId && rptId && tblId);
    }

    /**
     * Build the menu items for sort/group (ascending)
     * @param prependText
     * @returns {*}
     */
    getSortAscText(prependText) {
        if (!_.has(this.props.fieldDef, 'datatypeAttributes.type')) {
            return '';
        }

        let message = ' ';

        switch (this.props.fieldDef.datatypeAttributes.type) {
        case FieldConsts.CHECKBOX:
            message =  'uncheckedToChecked';
            break;
        case FieldConsts.TEXT:
        case FieldConsts.URL:
        case FieldConsts.USER:
        case FieldConsts.EMAIL_ADDRESS:
            message =  'aToZ';
            break;
        case FieldConsts.DATE:
        case FieldConsts.DATE_TIME:
        case FieldConsts.TIME_OF_DAY:
            message =  'oldToNew';
            break;
        case FieldConsts.NUMERIC:
        case FieldConsts.RATING:
        default:
            message = 'lowToHigh';
            break;
        }
        return convertSortingMessageToI18nMessage(prependText, message);
    }

    /**
     * Build the menu items for sort group (descending)
     * @param prependText
     * @returns {*}
     */
    getSortDescText(prependText) {
        if (!_.has(this.props.fieldDef, 'datatypeAttributes.type')) {
            return '';
        }

        let message = ' ';

        switch (this.props.fieldDef.datatypeAttributes.type) {
        case FieldConsts.CHECKBOX:
            message =  "checkedToUnchecked";
            break;
        case FieldConsts.TEXT:
        case FieldConsts.URL:
        case FieldConsts.USER:
        case FieldConsts.EMAIL_ADDRESS:
            message =  "zToA";
            break;
        case FieldConsts.DATE:
        case FieldConsts.DATE_TIME:
        case FieldConsts.TIME_OF_DAY:
            message =  "newToOld";
            break;
        case FieldConsts.NUMERIC:
        case FieldConsts.RATING:
        default:
            message =  "highToLow";
            break;
        }

        return convertSortingMessageToI18nMessage(prependText, message);
    }

    /**
     * Checks if a particular field has been sorted in ascending order
     * @returns {boolean}
     */
    isSortedAsc() {
        if (!this.props.sortFids) {return false;}

        return this.props.sortFids.some(fid => {
            // When a field is sorted in descending order, the field is returned as a negative value
            return ((Math.abs(fid) === this.props.fieldDef.id) && fid > 0);
        });
    }

    /**
     * Checks if a particular field has been sorted
     * @returns {boolean}
     */
    isFieldSorted() {
        if (!this.props.sortFids) {return false;}

        return _.find(this.props.sortFids, fid => {
            // Math.abs is needed because when a field is sorted in descending order, the field id is a negative value
            return Math.abs(fid) === this.props.fieldDef.id;
        });
    }

    isFieldSortedAscending() {
        return this.isFieldSorted() && this.isSortedAsc();
    }

    isFieldSortedDescending() {
        return this.isFieldSorted() && !this.isSortedAsc();
    }

    /**
     * On selection of sort option from menu fire off the action to sort the data
     * @param asc
     */
    sortReport(asc) {
        if (!this.hasRequiredIds()) {return;}

        if (asc && this.isFieldSortedAscending()) {return;}
        if (!asc && this.isFieldSortedDescending()) {return;}

        let column = this.props.fieldDef;
        let queryParams = {};
        // for on-the-fly sort selection, this selection will result in removal of old sort order
        // BUT since out grouped fields are also sorted we still need to keep those in the sort list.
        let sortFid = asc ? column.id.toString() : "-" + column.id.toString();

        let sortList = ReportUtils.getSortListString(this.props.groupEls);
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.appendSortFidToList(sortList, sortFid);
        queryParams[query.OFFSET_PARAM] = this.props.reportData && this.props.reportData.pageOffset ? this.props.reportData.pageOffset : serverTypeConsts.PAGE.DEFAULT_OFFSET;
        queryParams[query.NUMROWS_PARAM] = this.props.reportData && this.props.reportData.numRows ? this.props.reportData.numRows : serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

        this.props.loadDynamicReport(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, this.props.rptId, true, this.props.filter, queryParams);
    }

    sortReportAscending = () => {
        this.sortReport(true);
    };

    sortReportDescending = () => {
        this.sortReport(false);
    };

    /**
     * On selection of group option from menu fire off the action to sort the data
     * @param asc
     */
    groupReport(asc) {
        if (!this.hasRequiredIds()) {return;}

        let column = this.props.fieldDef;

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

        this.props.loadDynamicReport(CONTEXT.REPORT.NAV, this.props.appId, this.props.tblId, this.props.rptId, true, this.props.filter, queryParams);
    }

    groupReportAscending = () => {
        this.groupReport(true);
    };

    groupReportDescending = () => {
        this.groupReport(false);
    };

    /**
     * On selection of hide option from menu fire off the action to hide the column
     */
    hideThisColumn = () => {
        if (!this.hasRequiredIds()) {return;}
        if (this.props.isOnlyOneColumnVisible) {return;}

        this.props.hideColumn(CONTEXT.REPORT.NAV, this.props.fieldDef.id);
    };

    showAColumn(before) {
        if (!this.hasRequiredIds()) {return;}

        this.props.insertPlaceholderColumn(CONTEXT.REPORT.NAV, this.props.fieldDef.name, before);
    }

    showAColumnBefore = () => {
        this.showAColumn(true);
    };

    showAColumnAfter = () => {
        this.showAColumn(false);
    };

    render() {
        let inBuilderMode = this.props.reportBuilder.isInBuilderMode;
        let isHideOptionDisabled = this.props.isOnlyOneColumnVisible;

        let builderMenus = [];
        if (inBuilderMode) {
            builderMenus = [
                <MenuItem key="1" divider/>,

                <MenuItem key="2" onSelect={this.showAColumnBefore}>
                    <span className="addColumnBeforeText">{Locale.getMessage('report.menu.addColumnBefore')}</span>
                </MenuItem>,

                <MenuItem key="3" onSelect={this.showAColumnAfter}>
                    <span className="addColumnAfterText">{Locale.getMessage('report.menu.addColumnAfter')}</span>
                </MenuItem>,

                <MenuItem key="4" disabled={isHideOptionDisabled} onSelect={this.hideThisColumn}>
                    <span className="hideColumnText">{Locale.getMessage('report.menu.hideColumn')}</span>
                </MenuItem>
            ];
        }

        const headerMenus = [
            <MenuItem key="5" onSelect={this.sortReportAscending}>
                {this.isFieldSortedAscending() && <QbIcon icon="checkmarkincircle-outline"/>}
                <span className="sortAscendMenuText">{this.getSortAscText(SORTING_MESSAGE)}</span>
            </MenuItem>,

            <MenuItem key="6" onSelect={this.sortReportDescending}>
                {this.isFieldSortedDescending() && <QbIcon icon="checkmarkincircle-outline"/>}
                <span className="sortDescendMenuText">{this.getSortDescText(SORTING_MESSAGE)}</span>
            </MenuItem>,

            <MenuItem key="7" divider/>,

            <MenuItem key="8" onSelect={this.groupReportAscending}>
                <span className="groupAscendMenuText">{this.getSortAscText(GROUPING_MESSAGE)}</span>
            </MenuItem>,

            <MenuItem key="9" onSelect={this.groupReportDescending}>
                <span className="groupDescendMenuText">{this.getSortDescText(GROUPING_MESSAGE)}</span>
            </MenuItem>,
            ...builderMenus
        ];

        return (
            <Dropdown bsStyle="default" noCaret id="dropdown-no-caret">
                <Button tabIndex="0" bsRole="toggle" className="dropdownToggle iconActionButton">
                    <QbIcon icon="caret-filled-down"/>
                </Button>

                <Dropdown.Menu>
                    {headerMenus}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

ReportColumnHeaderMenu.propTypes = {
    fieldDef: PropTypes.object,
    sortFids: PropTypes.array,
    isOnlyOneColumnVisible: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        reportBuilder: state.reportBuilder
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams));
        },
        hideColumn: (context, clickedId) => {
            dispatch(hideColumn(context, clickedId));
        },
        insertPlaceholderColumn: (context, clickedColumn, addBeforeColumn) => {
            dispatch(insertPlaceholderColumn(context, clickedColumn, addBeforeColumn));
        }
    };
};

// --- PRIVATE FUNCTIONS

function convertSortingMessageToI18nMessage(prependText, message) {
    return Locale.getMessage(`report.menu.${prependText}.${message}`);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportColumnHeaderMenu);
