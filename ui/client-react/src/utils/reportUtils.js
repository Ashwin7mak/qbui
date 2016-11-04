/**
 * Static class of utility functions related to reports meta data
 */

import constants from '../../../common/src/constants';
import _ from 'lodash';

const listDelimiter = constants.REQUEST_PARAMETER.LIST_DELIMITER;
const groupDelimiter = constants.REQUEST_PARAMETER.GROUP_DELIMITER;

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
     * @param groupEls array of group elements ex: [-6:EQUALS]
     * @returns sortList string ex: [-6:EQUALS.3]
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
     * @param sortList -- sortList could be a string like 6.7:EQUALS.-10 or an array ["6", "7:EQUALS", "-10"]
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
                } else if (sort && !sort.groupType) {
                    sortFids.push(sort.sortOrder === constants.SORT_ORDER.DESC ? '-' + sort.fieldId : sort.fieldId);
                }
            });
        }
        return sortFids;
    }
    /**
     * Given a sortList string or array pull out group fids
     * @param sortList -- sortList could be a string like 6.7:EQUALS.-10 or an array ["6", "7:EQUALS", "-10"] or an array of sort objects like [{fieldId: 7, sortOrder: "asc", groupType:"EQUALS"}]
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
     * Take as input a list of sort list objects and return as a string value, with each entry
     * separated by the list delimiter(.).
     *
     * Example input is an array of sort objects like [{fieldId: 7, sortOrder: "asc", groupType:"EQUALS"}]
     *
     * @param sortListObj
     * @returns {*}
     */
    static getSortListFromObject(sortListObj) {
        if (Array.isArray(sortListObj)) {
            let sortList = [];
            sortListObj.forEach((sortEl) => {
                sortList.push(ReportUtils.getGroupString(sortEl.fieldId, sortEl.sortOrder === constants.SORT_ORDER.ASC, sortEl.groupType));
            });
            return ReportUtils.getListString(sortList);
        }
        return sortListObj;
    }

    /*
     * find record in grouped records report
     *
     * @param node node in grouped record tree
     * @param recId record id to find
     * @param keyName key field name
     */
    static findGroupedRecord(node, recId, keyName) {

        if (Array.isArray(node)) {
            return ReportUtils.findGroupedRecord({children: node}, recId, keyName);
        }
        if (node[keyName] && node[keyName].value === recId) {
            return node;
        }
        if (node.children) {
            let result = null;

            for (let i = 0; result === null && i < node.children.length; i++) {
                result = ReportUtils.findGroupedRecord(node.children[i], recId, keyName);
            }
            return result;
        }
        return null;
    }


    /**
     * find the innermost group that in grouped records report
     *
     * @param node node in grouped record tree
     * @param recId record id to find
     * @param keyName key field name
     */
    static addGroupedRecordAfterRecId(group, node, recId, keyName, newRec) {

        if (Array.isArray(node)) {
            return ReportUtils.addGroupedRecordAfterRecId({children: node}, {children: node}, recId, keyName, newRec);
        }
        if (node.children) {
            let found = false;
            for (let i = 0; !found && i < node.children.length;i++) {
                if (node.children[i].children) {
                    found = ReportUtils.addGroupedRecordAfterRecId(node.children, node.children[i], recId, keyName, newRec);
                } else {
                    let recordIdx = node.children.findIndex(field => {
                        return field[keyName].value === recId;
                    });
                    if (recordIdx !== -1) {
                        found = true;
                        node.children.splice(recordIdx + 1, 0, newRec);
                    }
                }
            }
            return found;
        }
        return null;
    }

    static removeGroupedRecordById(group, node, recId, keyName) {

        if (Array.isArray(node)) {
            return ReportUtils.removeGroupedRecordById({children: node}, {children: node}, recId, keyName);
        }
        if (node.children) {
            let found = false;

            for (let i = 0; !found && i < node.children.length;i++) {
                if (node.children[i].children) {
                    found = ReportUtils.removeGroupedRecordById(node.children, node.children[i], recId, keyName);
                } else {
                    let removedRecs = _.remove(node.children, (field) => {
                        return field[keyName].value === recId;
                    });
                    found = removedRecs.length > 0;
                }
            }
            return found;
        }
        return null;
    }
}

ReportUtils.listDelimiter = listDelimiter;
ReportUtils.groupDelimiter = groupDelimiter;

export default ReportUtils;
