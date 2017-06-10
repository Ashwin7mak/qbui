import React, {Component, PropTypes} from "react";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Locale from "APP/locales/locales";
import * as FieldConsts from "APP/constants/schema";
import Icon from "REUSE/components/icon/icon";

/**
 * Describes a single Sort menu item. Supports handling of either the Ascending or
 * Descending behavior.
 */
class SortMenuItem extends Component {
    /**
     * Gets the appropriate sort ascending message based on field type
     * @returns {*}
     */
    getSortAscText = () => {
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
        return Locale.getMessage(`report.menu.sort.${message}`);
    };

    /**
     * Gets the appropriate sort descending message based on field type
     * @returns {*}
     */
    getSortDescText = () => {
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

        return Locale.getMessage(`report.menu.sort.${message}`);
    };

    /**
     * Gets the appropriate sort message
     * @returns {*}
     */
    getSortText = () => {
        if (this.props.asc) {
            return this.getSortAscText();
        } else {
            return this.getSortDescText();
        }
    };

    /**
     * Checks if a particular field has been sorted in ascending order
     * @returns {boolean}
     */
    isSortedAsc = () => {
        if (!this.props.sortFids) {return false;}

        return _.some(this.props.sortFids, fid => {
            // Math.abs is needed because when a field is sorted in descending order, the field id is a negative value
            return Math.abs(fid) === this.props.fieldDef.id && fid > 0;
        });
    };

    /**
     * Checks if a particular field has been sorted
     * @returns {boolean}
     */
    isColumnSorted = () => {
        if (!this.props.sortFids) {return false;}

        return _.some(this.props.sortFids, fid => {
            // Math.abs is needed because when a field is sorted in descending order, the field id is a negative value
            return Math.abs(fid) === this.props.fieldDef.id;
        });
    };

    /**
     * Checks if column is sorted ascending
     * @returns {boolean}
     */
    isColumnSortedAscending = () => {
        return this.isColumnSorted() && this.isSortedAsc();
    };

    /**
     * Checks if column is sorted descending
     * @returns {boolean}
     */
    isColumnSortedDescending = () => {
        return this.isColumnSorted() && !this.isSortedAsc();
    };

    /**
     * Checks if column is already sorted as desired
     * @returns {boolean}
     */
    isColumnAlreadySorted = () => {
        if (this.props.asc) {
            return this.isColumnSortedAscending();
        } else {
            return this.isColumnSortedDescending();
        }
    };

    /**
     * Updates the sort based on this menu item
     */
    setSort = () => {
        if (this.props.setSort) {
            this.props.setSort(this.props.fieldDef.id, this.props.asc, this.isColumnAlreadySorted());
        }
    };

    render() {
        return (
            <MenuItem onSelect={this.setSort.bind(this)}>
                {this.isColumnAlreadySorted() && <Icon icon="check"/>}
                <span className={this.props.asc ? "sortAscendMenuText" : "sortDescendMenuText"}>{this.getSortText()}</span>
            </MenuItem>
        );
    }
}

SortMenuItem.propTypes = {
    asc: PropTypes.bool.isRequired,
    fieldDef: PropTypes.object.isRequired,
    sortFids: PropTypes.array,
    setSort: PropTypes.func.isRequired
};

export default SortMenuItem;
