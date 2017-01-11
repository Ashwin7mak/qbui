import React, {PropTypes} from 'react';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import * as FieldConsts from '../../../constants/schema';
import Locale from '../../../locales/locales';
import {I18nMessage} from '../../../utils/i18nMessage';
import QBicon from '../../qbIcon/qbIcon';

const SORTING_MESSAGE = 'sort';
const GROUPING_MESSAGE = 'group';

const ReportColumnHeaderMenu = React.createClass({
    propTypes: {
        colDef: PropTypes.object,
        sortFids: PropTypes.array,
        sortReport: PropTypes.func,
        groupReport: PropTypes.func,
    },

    /**
     * Build the menu items for sort/group
     * @param column
     * @param prependText
     * @returns {*}
     */
    getSortAscText(prependText) {
        let message = ' ';
        if (this.props.colDef.fieldDef) {
            switch (this.props.colDef.fieldDef.datatypeAttributes.type) {
                case FieldConsts.CHECKBOX:
                    message = 'uncheckedToChecked';
                    break;
                case FieldConsts.TEXT:
                case FieldConsts.URL:
                case FieldConsts.USER:
                case FieldConsts.EMAIL_ADDRESS:
                    message = 'aToZ';
                    break;
                case FieldConsts.DATE:
                case FieldConsts.DATE_TIME:
                case FieldConsts.TIME_OF_DAY:
                    message = 'oldToNew';
                    break;
                case FieldConsts.NUMERIC:
                case FieldConsts.RATING:
                default:
                    message = 'lowToHigh';
                    break;
            }
        }
        return convertSortingMessageToI18nMessage(prependText, message);
    },

    getSortDescText(prependText) {
        let message = ' ';
        if (this.props.colDef.fieldDef) {
            switch (this.props.colDef.fieldDef.datatypeAttributes.type) {
                case FieldConsts.CHECKBOX:
                    message = "checkedToUnchecked";
                    break;
                case FieldConsts.TEXT:
                case FieldConsts.URL:
                case FieldConsts.USER:
                case FieldConsts.EMAIL_ADDRESS:
                    message = "zToA";
                    break;
                case FieldConsts.DATE:
                case FieldConsts.DATE_TIME:
                case FieldConsts.TIME_OF_DAY:
                    message = "newToOld";
                    break;
                case FieldConsts.NUMERIC:
                case FieldConsts.RATING:
                default:
                    message = "highToLow";
                    break;
            }
        }

        return convertSortingMessageToI18nMessage(prependText, message);
    },

    isSortedAsc() {
        let isSortedAsc = true;

        // TODO:: Clean up this duplicated function
        _.find(this.props.sortFids, fid => {
            if (Math.abs(fid) === this.props.colDef.id) {
                isSortedAsc = fid > 0;
            }
        });

        return isSortedAsc;
    },

    isFieldSorted() {
        return _.find(this.props.sortFids, fid => {
            if (Math.abs(fid) === this.props.colDef.id) {
                return true;
            }
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
            this.props.sortReport(this.props.colDef, asc, alreadySorted);
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
            this.props.groupReport(this.props.colDef, asc);
        }
    },

    groupReportAscending() {
        this.groupReport(true);
    },

    groupReportDescending() {
        this.groupReport(false);
    },

    render() {
        return (
            <Dropdown bsStyle="default" noCaret id="dropdown-no-caret">
                <Button tabIndex="0" bsRole="toggle" className={"dropdownToggle iconActionButton"}>
                    <QBicon icon="caret-filled-down"/>
                </Button>

                <Dropdown.Menu>
                    <MenuItem onSelect={this.sortReportAscending}>
                        {this.isFieldSortedAscending() && <QBicon icon="check"/>} {this.getSortAscText(SORTING_MESSAGE)}
                    </MenuItem>

                    <MenuItem onSelect={this.sortReportDescending}>
                        {this.isFieldSortedDescending() && <QBicon icon="check"/>} {this.getSortDescText(SORTING_MESSAGE)}
                    </MenuItem>

                    <MenuItem divider/>

                    <MenuItem onSelect={this.groupReportAscending}> {this.getSortAscText(GROUPING_MESSAGE)}</MenuItem>
                    <MenuItem onSelect={this.groupReportDescending}> {this.getSortDescText(GROUPING_MESSAGE)}</MenuItem>

                    <MenuItem divider/>

                    <MenuItem disabled><I18nMessage message="report.menu.addColumnBefore"/></MenuItem>
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

export default ReportColumnHeaderMenu;
