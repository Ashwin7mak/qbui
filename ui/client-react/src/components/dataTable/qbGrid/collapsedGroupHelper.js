import _ from 'lodash';

class CollapsedGroupHelper {
    static isGrouped(rows = []) {
        return rows.some(row => {return row.isSubHeader;});
    }

    constructor(collapsedGroups, rows) {
        this.collapsedGroups = collapsedGroups || [];
        this.rows = rows || [];
        this.subHeaderRows = [];
        if (this.rows.length) {
            this.getSubHeaderRows(false);
        }
    }

    areAllCollapsed() {
        return this.collapsedGroups.length >= this.subHeaderRows.length;
    }

    getSubHeaderRows(shouldResetCollapsedGroupsIfRowsDifferent = true) {
        let updatedSubHeaderRows = this.rows.filter(row => {return row.isSubHeader;});

        // For now, reset the grouping like AgGrid did when new groups are added
        if (shouldResetCollapsedGroupsIfRowsDifferent && updatedSubHeaderRows.length !== this.subHeaderRows.length) {
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

        if (!this.collapsedGroups || this.collapsedGroups.length === 0) {
            return this.rows;
        }

        this.subHeaderRows.forEach(subHeaderRow => {
            subHeaderRow.isCollapsed = _.includes(this.collapsedGroups, subHeaderRow.id);
        });

        return this.rows.filter(row => {
            return !_.includes(this.collapsedGroups, row.parentId);
        });
    }

    addSubGroups(currentSubHeaderId) {
        let subHeaderIds = [currentSubHeaderId];

        this.rows.forEach(row => {
            if (_.includes(subHeaderIds, row.parentId) && row.isSubHeader) {
                subHeaderIds.push(row.id);
            }
        });

        return subHeaderIds;
    }

    toggleCollapseGroup(subHeaderId) {
        if (_.includes(this.collapsedGroups, subHeaderId)) {
            this.collapsedGroups = this.collapsedGroups.filter(currentSubHeaderId => {
                return currentSubHeaderId !== subHeaderId;
            });
        } else {
            this.collapsedGroups = [...this.collapsedGroups, ...this.addSubGroups(subHeaderId)];
        }

        return this.collapsedGroups;
    }

    toggleCollapseAllGroups() {
        let subHeaderRows = this.rows.filter(row => {return row.isSubHeader;}).map(row => {return row.id;});

        if (subHeaderRows.length > this.collapsedGroups.length) {
            this.collapsedGroups = subHeaderRows;
        } else {
            this.collapsedGroups = [];
        }

        return this.collapsedGroups;
    }

}

export default CollapsedGroupHelper;
