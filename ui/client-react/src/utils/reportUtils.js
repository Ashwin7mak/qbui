/**
 * Static class of utility functions related to reports meta data
 */
const listDelimiter = ".";
const groupDelimiter = ":";
import constants from '../../../common/src/constants';
import * as SchemaConsts from '../constants/schema';

class ReportUtils {

    /**
     * Given an array or sortList values, return a string with each entry in the list separated by a delimiter ('.');
     *
     * @param sortFids
     * @returns {string}
     */
    static getSortListString(sortFids) {
        return ReportUtils.getListString(sortFids);
    }

    /**
     * Given arrays of sort fids and group elements combines them into a sortList type string.
     * The grouping fids always go before sort fids
     * @param sortFids array of sort fids ex: [3]
     * @param groupEls array of group elements ex: [-6:V]
     * @returns sortList string ex: [-6:V.3]
     */
    static getGListString(sortFids, groupEls) {
        let groupString = ReportUtils.getListString(groupEls);
        let sortString = ReportUtils.getListString(sortFids);
        if (groupString.length) {
            return sortString.length ? groupString + listDelimiter + sortString : groupString;
        }
        return sortString;
    }

    /**
     * Given an array of fids, return a string with each entry in the list separated by a delimiter ('.');
     * @param fids
     */
    static getFidListString(fids) {
        return ReportUtils.getListString(fids);
    }

    /**
     * Take as input a list and return a string with each element separated by a delimiter('.')
     *
     * @param inList
     * @returns {*}
     */
    static getListString(inList) {
        if (inList && inList.length) {
            return inList.join(listDelimiter);
        }
        return "";
    }

    /**
     * Given a sortEl does it have grouping info included.  No
     * validation is performed; just whether grouping is included.
     *
     * @param sort element
     * @returns boolean
     */
    static hasGroupingFids(sortEl) {
        if (sortEl && typeof sortEl === "string") {
            let el = sortEl.split(groupDelimiter, 2);
            if (el.length === 2) {
                return true;
            }
        } else if (sortEl && sortEl.groupType) {
            return true;
        }
        return false;
    }

    static getSortListPartsHelper(sortList) {
        if (sortList) {
            if (Array.isArray(sortList)) {
                return sortList;
            }
            if (typeof sortList === 'string') {
                return sortList.split(listDelimiter);
            }
        }
        return false;
    }
    /**
     * Given a sortList string or array, pull out sort fids
     * @param sortList
     * @returns array of fids
     */
    static getSortFids(sortList) {
        let sortListParts = ReportUtils.getSortListPartsHelper(sortList);
        let sortFids = [];
        if (sortListParts) {
            sortListParts.forEach((sort) => {
                if (typeof sort === "string") {
                    //  each element is formatted as fid:groupType
                    var sortEl = sort.split(groupDelimiter);
                    sortFids.push(sortEl[0]);
                } else {
                    sortFids.push(sort.sortOrder === constants.SORT_ORDER.DESC ? '-' + sort.fieldId : sort.fieldId);
                }
            });
        }
        return sortFids;
    }
    /**
     * Given a sortList string or array pull out sort fids
     * @param sortList -- sortList could be a string like 6.7:V.-10 or an array ["6", "7:V", "-10"]
     * @returns array of sort fids ( ignores all grouped fids)
     */
    static getSortFidsOnly(sortList) {
        let sortListParts = ReportUtils.getSortListPartsHelper(sortList);
        let sortFids = [];
        if (sortListParts) {
            sortListParts.forEach((sort) => {
                if (typeof sort === "string") {
                    //  format is fid:groupType..split by delimiter(':') to allow us
                    // to pass in the fid for server side sorting.
                    var sortEl = sort.split(groupDelimiter);
                    if (sortEl.length === 1) {
                        sortFids.push(sortEl[0]);
                    }
                } else if (sort && sort.groupType === null) {
                    sortFids.push(sort.sortOrder === constants.SORT_ORDER.DESC ? '-' + sort.fieldId : sort.fieldId);
                }
            });
        }
        return sortFids;
    }
    /**
     * Given a sortList string or array pull out group fids
     * @param sortList -- sortList could be a string like 6.7:V.-10 or an array ["6", "7:V", "-10"] or an array of sort objects like [{fieldId: 7, sortOrder: "asc", groupType:"V"}]
     * @returns array of group elements ( ignores all sort fids)
     */
    static getGroupElements(sortList) {
        let sortListParts = ReportUtils.getSortListPartsHelper(sortList);
        let groupFids = [];
        if (sortListParts) {
            sortListParts.forEach((sort) => {
                if (typeof sort === "string") {
                    //  format is fid:groupType..split by delimiter(':') to allow us
                    // to pass in the fid for server side sorting.
                    var sortEl = sort.split(groupDelimiter);
                    if (sortEl.length > 1) {
                        groupFids.push(sort);
                    }
                } else if (sort && sort.groupType) { // sort is of type object
                    let prefix = sort.sortOrder === constants.SORT_ORDER.DESC ? '-' : '';
                    groupFids.push(prefix + sort.fieldId + groupDelimiter + sort.groupType);
                }
            });
        }
        return groupFids;
    }

    /**
     * Given a sortList, append a sortFid to this list
     *
     * @param sortList -- string of format <+/-|fid|:groupType>.<+/-|fid|:groupType>..
     * @param sortEl -- can be a fid or a group element
     * @returns concatenated sortlist string of format <+/-|fid|:groupType>.<+/-|fid|:groupType>..
     */
    static appendSortFidToList(sortList, sortEl) {
        if (typeof sortEl === 'number') {
            sortEl = sortEl.toString();
        }
        if (sortList && sortList.length) {
            sortList += sortEl && sortEl.length ? listDelimiter + sortEl : "";
        } else {
            sortList = sortEl;
        }
        return sortList;
    }

    /**
     * Given a sortList, prepend a sortFid to this list
     *
     * @param sortList -- string of format <+/-|fid|:groupType>.<+/-|fid|:groupType>..
     * @param sortFid -- can be a fid or a group element
     * @returns concatenated sortlist string of format <+/-|fid|:groupType>.<+/-|fid|:groupType>..
     */
    static prependSortFidToList(sortList, sortEl) {
        if (typeof sortEl === 'number') {
            sortEl = sortEl.toString();
        }
        if (sortEl && sortEl.length) {
            let result = sortEl;
            if (sortList && sortList.length) {
                result += listDelimiter + sortList;
            }
            return result;
        } else {
            return sortList;
        }

    }

    /**
     * Combines a fid + order + groupType into a groupEl of format <+/-|fid|:groupType>
     * @param fid
     * @param order
     * @param groupType
     * @returns {string}
     */
    static getGroupString(fid, order, groupType) {
        let result = '';
        if (fid) {
            if (typeof order === 'boolean') {
                result += order ? '' : '-';
            }
            result += fid;
            if (groupType) {
                result += groupDelimiter + groupType;
            }
        }
        return result;
    }

    /**
    * Determines what type of data has been provied and finds the unique record id field name
    * This is a helper method that can determine which type of data is available and get the record id field from it
    * @param {object} data
    * @returns {string}
    *
    */
    static getUniqueIdentifierFieldName(data) {
        if (data && _.has(data, 'fields')) {
            return ReportUtils.getUniqueIdentifierFieldNameFromFields(data);
        } else {
            return ReportUtils.getUniqueIdentifierFieldNameFromData(data);
        }
    }

    /**
    * Gets the name of the field that is the unique identifier field (e.g., Record ID #)
    * even if it is no longer named Record ID #
    * @param fields
    * @returns {string}
    */
    static getUniqueIdentifierFieldNameFromFields(fields) {
        if (requiredFieldsArePresent(fields)) {
            let uniqueIdentifierField = _.find(fields.fields.data, {id: SchemaConsts.DEFAULT_RECORD_KEY_ID});
            if (uniqueIdentifierField) {
                return uniqueIdentifierField.name;
            } else {
                return SchemaConsts.DEFAULT_RECORD_KEY;
            }
        } else {
            return SchemaConsts.DEFAULT_RECORD_KEY;
        }
    }

    /**
    * Gets the name for the unique identifier row from grid data
    * even if the Record ID # field has been renamed
    * @param rowData
    *    {
    *        fieldName: {
    *            id: 3 // this is the field id
    *            value: 2
    *            display: "2"
    *        }
    *    }
    * @returns {string}
    */
    static getUniqueIdentifierFieldNameFromData(rowData) {
        let recordIdField = _.findKey(rowData, {id: SchemaConsts.DEFAULT_RECORD_KEY_ID});
        if (recordIdField) {
            return recordIdField;
        } else {
            return SchemaConsts.DEFAULT_RECORD_KEY;
        }
    }
}

// PRIVATE METHODS
function requiredFieldsArePresent(fields) {
    return fields && fields.fields && fields.fields.data && fields.fields.data.length;
}

ReportUtils.listDelimiter = listDelimiter;
ReportUtils.groupDelimiter = groupDelimiter;
export default ReportUtils;
