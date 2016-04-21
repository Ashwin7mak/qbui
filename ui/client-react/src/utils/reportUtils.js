/**
 * Static class of utility functions related to reports meta data
 */
const listDelimiter = ".";
const groupDelimiter = ":";

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
     * @returns sorlList string ex: [-6:V.3]
     */
    static getGroupListString(sortFids, groupEls) {
        let gListString = ReportUtils.getListString(groupEls);
        if (gListString) {
            gListString += listDelimiter;
        }
        gListString += ReportUtils.getListString(sortFids);
        return gListString;
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
     * Given a sortList string, does it have grouping info included.  No
     * validation is performed; just whether grouping is included.
     *
     * @param sort list
     * @returns boolean
     */
    static hasGroupingFids(sortList) {
        if (sortList) {
            if (typeof sortList === 'string') {
                let elements = sortList.split(listDelimiter);
                for (let idx = 0; idx < elements.length; idx++) {
                    let el = elements[idx].split(groupDelimiter, 2);
                    if (el.length === 2) {
                        return true;
                    }
                }
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
        let sortFids = [];
        let sortListParts = [];
        if (typeof sortList === 'string') {
            sortListParts = sortList.split(listDelimiter);
        } else { //should be an array
            sortListParts = sortList;
        }
        sortListParts.forEach((sort) => {
            if (sort) {
                //  each element is formated as fid:groupType
                var sortEl = sort.split(groupDelimiter);
                sortFids.push(sortEl[0]);
            }
        });
        return sortFids;
    }
    /**
     * Given a sortList string or array pull out sort fids
     * @param sortList -- sortList could be a string like 6.7:V.-10 or an array ["6", "7:V", "-10"]
     * @returns array of sort fids ( ignores all grouped fids)
     */
    static getSortFidsOnly(sortList) {
        let sortFids = [];
        let sortListParts = [];
        if (typeof sortList === 'string') {
            sortListParts = sortList.split(listDelimiter);
        } else { //should be an array
            sortListParts = sortList;
        }
        sortListParts.forEach((sort) => {
            if (sort) {
                //  format is fid:groupType..split by delimiter(':') to allow us
                // to pass in the fid for server side sorting.
                var sortEl = sort.split(groupDelimiter);
                if (sortEl.length === 1) {
                    sortFids.push(sortEl[0]);
                }
            }
        });
        return sortFids;
    }
    //TODO
    /**
     * Given a sortList string or array pull out group fids
     * @param sortList -- sortList could be a string like 6.7:V.-10 or an array ["6", "7:V", "-10"]
     * @returns array of group elements ( ignores all sort fids)
     */
    static getGroupElements(sortList) {
        let groupFids = [];
        let sortListParts = [];
        if (typeof sortList === 'string') {
            sortListParts = sortList.split(listDelimiter);
        } else { //should be an array
            sortListParts = sortList;
        }
        sortListParts.forEach((sort) => {
            if (sort) {
                //  format is fid:groupType..split by delimiter(':') to allow us
                // to pass in the fid for server side sorting.
                var sortEl = sort.split(groupDelimiter);
                if (sortEl.length > 1) {
                    groupFids.push(sort);
                }
            }
        });
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
            sortFid = sortEl.toString();
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
        return (order ? "" : "-") + fid + groupDelimiter + groupType;
    }
}

export default ReportUtils;
