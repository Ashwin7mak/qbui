/**
 * Static class of utility functions related to reports meta data
 */
const sortFidDelimiter = ".";
const groupDelimiter = ":";
class ReportUtils {

    /**
     * Given an array of sort Fids return a sortList string that can be used as request param
     * //TODO: Add handling of group fids
     * @param sortFids
     * @returns {string}
     */
    static getSortListString(sortFids) {
        if (sortFids && sortFids.length) {
            return sortFids.join(sortFidDelimiter);
        }
        return "";
    }
    /**
     * Given a sortList string pull out sort fids
     * @param sortList
     * @returns {Array}
     */
    static getSortFids(sortList) {
        let sortFids = [];
        if (sortList && sortList.length) {
            let sortListParts = sortList.split(sortFidDelimiter);
            sortListParts.forEach((sort) => {
                if (sort) {
                    //  format is fid:groupType..split by delimiter(':') to allow us
                    // to pass in the fid for server side sorting.
                    var sortEl = sort.split(groupDelimiter);
                    sortFids.push(sortEl[0]);
                }
            });
        }
        return sortFids;
    }
    //TODO
    /**
     * Given a sortList string pull out group fids
     * @param sortList
     */
    static getGroupFids(sortList) {
    }

    /**
     * Given a sortList, append a sortFid to this list
     * //ToDo handle grouping
     * @param sortList
     * @param sortFid
     * @returns {*}
     */
    static appendSortFidToList(sortList, sortFid) {
        if (typeof sortFid === 'number') {
            sortFid = sortFid.toString();
        }
        if (sortList && sortList.length) {
            sortList += sortFid && sortFid.length ? sortFidDelimiter + sortFid : "";
        } else {
            sortList = sortFid;
        }
        return sortList;
    }

    /**
     * Given a sortList, prepend a sortFid to this list
     * //ToDo handle grouping
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
                result += sortFidDelimiter + sortList;
            }
            return result;
        } else {
            return sortList;
        }

    }

}

export default ReportUtils;
