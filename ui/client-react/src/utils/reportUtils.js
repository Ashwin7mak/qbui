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

    static getGroupListString(sortFids, groupFids) {
        let gListString = ReportUtils.getListString(sortFids);
        if (gListString) {
            gListString += listDelimiter;
        }
        gListString += ReportUtils.getListString(groupFids);
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
     * Given a sortList string, pull out sort fids
     * @param sortList
     * @returns {Array}
     */
    static getSortFids(sortList) {
        let sortFids = [];
        if (typeof sortList === 'string') {
            let sortListParts = sortList.split(listDelimiter);
            sortListParts.forEach((sort) => {
                if (sort) {
                    //  each element is formated as fid:groupType
                    var sortEl = sort.split(groupDelimiter);
                    sortFids.push(sortEl[0]);
                }
            });
        }
        return sortFids;
    }
    /**
     * Given a sortList string pull out sort fids
     * @param sortList -- sortList could be a string like 6.7:V.-10 or an array ["6", "7:V", "-10"]
     * @returns {Array}
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
     * Given a sortList string pull out group fids
     * @param sortList
     */
    static getGroupFids(sortList) {
        let groupFids = [];
        if (sortList && sortList.length) {
            let sortListParts = sortList.split(listDelimiter);
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
        }
        return groupFids;
    }

    /**
     * Given a sortList, append a sortFid to this list
     *
     * @param sortList
     * @param sortFid
     * @returns {*}
     */
    static appendSortFidToList(sortList, sortFid) {
        if (typeof sortFid === 'number') {
            sortFid = sortFid.toString();
        }
        if (sortList && sortList.length) {
            sortList += sortFid && sortFid.length ? listDelimiter + sortFid : "";
        } else {
            sortList = sortFid;
        }
        return sortList;
    }

    /**
     * Given a sortList, prepend a sortFid to this list
     *
     * @param sortList
     * @param sortFid
     * @returns {*}
     */
    static prependSortFidToList(sortList, sortFid) {
        if (typeof sortFid === 'number') {
            sortFid = sortFid.toString();
        }
        if (sortFid && sortFid.length) {
            let result = sortFid;
            if (sortList && sortList.length) {
                result += listDelimiter + sortList;
            }
            return result;
        } else {
            return sortList;
        }

    }

    /**
     * Takes in a query's sortlist which can have sort and grouping strings
     * and returns a string with just sort fids delimited by "."
     *
     * @param sortList
     * @returns {string}
     */
    static getSortStringFromSortListArray(sortList) {
        let sortFids = [];
        if (sortList && sortList.length) {
            sortList.forEach((sort) =>{
                if (sort) {
                    var sortEl = sort.split(groupDelimiter);
                    sortFids.push(sortEl[0]);
                }
            });
        }
        return ReportUtils.getSortListString(sortFids);
    }

    static getGroupString(fid, groupType) {
        return fid + groupDelimiter + groupType;
    }
}

export default ReportUtils;
