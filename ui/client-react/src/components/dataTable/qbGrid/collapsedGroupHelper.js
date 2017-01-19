import _ from 'lodash';

class CollapsedGroupHelper {
    static isGrouped(rows = []) {
        return rows.some(row => {return row.isSubHeader;});
    }

    constructor(collapsedGroups = [], rows = []) {
        this.collapsedGroups = collapsedGroups;
        this.rows = rows;
        this.subHeaderRows = [];
        if (rows.length) {
            this.getSubHeaderRows(rows);
        }
    }

    areAllCollapsed() {
        return this.collapsedGroups.length >= this.subHeaderRows.length;
    }

    getSubHeaderRows() {
        let updatedSubHeaderRows = this.rows.filter(row => {return row.isSubHeader;});

        // For now, reset the grouping like AgGrid did when new groups are added
        if (updatedSubHeaderRows.length !== this.subHeaderRows.length) {
            this.collapsedGroups = [];
        }

        this.subHeaderRows = updatedSubHeaderRows;
        return this.subHeaderRows;
    }

    filterRows(rows) {
        if (!Array.isArray(rows)) {
            this.rows = [];
            return this.rows;
        }

        this.rows = _.cloneDeep(rows);
        this.getSubHeaderRows();

        this.subHeaderRows.forEach(subHeaderRow => {
            subHeaderRow.isCollapsed = this.collapsedGroups.includes(subHeaderRow.id);
        });

        return this.rows.filter(row => {
            return !this.collapsedGroups.includes(row.parentId);
        });
    }

    addSubGroups(currentSubHeaderId) {
        let subHeaderIds = [currentSubHeaderId];

        this.rows.forEach(row => {
            if (subHeaderIds.includes(row.parentId) && row.isSubHeader) {
                subHeaderIds.push(row.id);
            }
        });

        return subHeaderIds;
    }

    toggleCollapseGroup(subHeaderId) {
        if (this.collapsedGroups.includes(subHeaderId)) {
            this.collapsedGroups = this.collapsedGroups.filter(currentSubHeaderId => {
                return currentSubHeaderId !== subHeaderId;
            });
        } else {
            this.collapsedGroups = [...this.collapsedGroups, ...this.addSubGroups(subHeaderId)];
        }

        return this.collapsedGroups;
    }

    toggleCollapseAllGroups(rows) {
        let subHeaderRows = rows.filter(row => {return row.isSubHeader;}).map(row => {return row.id;});

        if (subHeaderRows.length > this.collapsedGroups.length) {
            this.collapsedGroups = subHeaderRows;
        } else {
            this.collapsedGroups = [];
        }

        return this.collapsedGroups;
    }

}

export default CollapsedGroupHelper;
