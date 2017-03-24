import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import * as FieldConsts from '../../../constants/schema';
import Locale from '../../../locales/locales';
import {I18nMessage} from '../../../utils/i18nMessage';
import QbIcon from '../../qbIcon/qbIcon';
import ReportColumnHeaderMenuContainer from './reportColumnHeaderMenuContainer';

const SORTING_MESSAGE = 'sort';
const GROUPING_MESSAGE = 'group';

/**
 * A presentational component that displays the column header menu for grouping and sorting on a report
 * @type {__React.ClassicComponentClass<P>}
 */
export const ReportColumnHeaderMenu = React.createClass({
    propTypes: {
        fieldDef: PropTypes.object,
        sortFids: PropTypes.array,
        sortReport: PropTypes.func,
        groupReport: PropTypes.func,
        onColumnAdd : PropTypes.func,
    },

    /**
     * Build the menu items for sort/group (ascending)
     * @param column
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
    },

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
    },

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
    },

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
    },

    isFieldSortedAscending() {
        return this.isFieldSorted() && this.isSortedAsc();
    },

    isFieldSortedDescending() {
        return this.isFieldSorted() && !this.isSortedAsc();
    },

    sortReport(asc, alreadySorted) {
        if (this.props.sortReport) {
            this.props.sortReport(this.props.fieldDef, asc, alreadySorted);
        }
    },

    sortReportAscending() {
        this.sortReport(true, this.isFieldSortedAscending());
    },

    sortReportDescending() {
        this.sortReport(false, this.isFieldSortedDescending());
    },

    groupReport(asc) {
        if (this.props.groupReport) {
            this.props.groupReport(this.props.fieldDef, asc);
        }
    },

    groupReportAscending() {
        this.groupReport(true);
    },

    groupReportDescending() {
        this.groupReport(false);
    },

    addColumnBefore() {
        this.props.onColumnAdd(this.props.fieldDef.id - 1, this.props.sortFids.length);
    },

    addColumnAfter() {
        this.props.onColumnAdd(this.props.fieldDef.id + 1, this.props.sortFids.length);
    },

    render() {
        return (
            <Dropdown bsStyle="default" noCaret id="dropdown-no-caret">
                <Button tabIndex="0" bsRole="toggle" className={"dropdownToggle iconActionButton"}>
                    <QbIcon icon="caret-filled-down"/>
                </Button>

                <Dropdown.Menu>
                    <MenuItem onSelect={this.sortReportAscending}>
                        {this.isFieldSortedAscending() && <QbIcon icon="check"/>}
                        <span className="sortAscendMenuText">{this.getSortAscText(SORTING_MESSAGE)}</span>
                    </MenuItem>

                    <MenuItem onSelect={this.sortReportDescending}>
                        {this.isFieldSortedDescending() && <QbIcon icon="check"/>}
                        <span className="sortDescendMenuText">{this.getSortDescText(SORTING_MESSAGE)}</span>
                    </MenuItem>

                    <MenuItem divider/>

                    <MenuItem onSelect={this.groupReportAscending}>
                        <span className="groupAscendMenuText">{this.getSortAscText(GROUPING_MESSAGE)}</span>
                    </MenuItem>
                    <MenuItem onSelect={this.groupReportDescending}>
                        <span className="groupDescendMenuText">{this.getSortDescText(GROUPING_MESSAGE)}</span>
                    </MenuItem>

                    <MenuItem divider/>

                    <MenuItem onSelect={this.addColumnBefore}>
                        <I18nMessage message="report.menu.addColumnBefore"/>
                    </MenuItem>

                    <MenuItem disabled><I18nMessage message="report.menu.addColumnAfter"/></MenuItem>
                    <MenuItem disabled><I18nMessage message="report.menu.hideColumn"/></MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
});

// --- PRIVATE FUNCTIONS

function convertSortingMessageToI18nMessage(prependText, message) {
    return Locale.getMessage(`report.menu.${prependText}.${message}`);
}

export default ReportColumnHeaderMenuContainer(ReportColumnHeaderMenu);
