import React from 'react';
import FieldUtils from './fieldUtils';
import ColumnTransformer from '../components/dataTable/qbGrid/columnTransformer';
import RowTransformer from '../components/dataTable/qbGrid/rowTransformer';
import Locale from '../locales/locales';

/* A helper to transform Automation List Data into a format that can be used by QBGrid. Expects a list of Automation Objects*/
class AutomationListTransformer  {

    /**
     * Transforms columns from automations api data to a class that has helpers used by the QbGrid
     * @param automations
     * @returns {Array}
     */
    static transformAutomationListColumnsForGrid(automations = []) {
        if (!automations || !Array.isArray(automations)) {
            return [];
        }
        let key = 1;
        let columns = [];
        columns.push("name");
        columns.push("description");
        columns.push("active");
        return columns.map(column => {
            return this.createAutomationGridColumn(column, key++);
        });
    }

    static transformAutomationListRowsForGrid(automations = []) {
        if(!automations || !Array.isArray(automations)) {
            return [];
        }
        return automations.map(automation => {
            return this.createAutomationGridRow(automation);
        });
    }

    /**
     * Transform a single column data into a column that can be used by the QbGrid
     * @param column
     * @param key
     * @returns {ColumnTransformer}
     */
    static createAutomationGridColumn(column, key) {
        let headerLabel = column;
        let headerClasses = ['gridHeaderCell'];
        let headerLabelClasses = FieldUtils.getColumnHeaderLabelClasses();
        let isHidden = false;
        let isPlaceholder = false;
        let cellIdentifierValue = key;
        return new ColumnTransformer(headerLabel, cellIdentifierValue, headerClasses, headerLabelClasses, isHidden, isPlaceholder);
    }

    /**
     * Transform a single automation item into a row that can be used by QbGrid
     * @param automation
     * @param rowId
     */
    static createAutomationGridRow(automation, rowId) {
        let id = automation.id;
        let cells = [];

        let active = automation.active ? Locale.getMessage("automation.automationList.activeYes") : Locale.getMessage("automation.automationList.activeNo");
        cells.push(this.createCellForField("NAME", automation.name, rowId, 1, false));
        cells.push(this.createCellForField("DESCRIPTION", automation.description, rowId, 2, false));
        cells.push(this.createCellForField("TEST", active, rowId, 3, false));
        cells.push(this.createCellForField("ID", automation.id, rowId, 4, true));
        return new RowTransformer(id, cells);
    }

    static createCellForField(fieldName, fieldValue, rowId, cellId, isHidden) {

        let cell = {
            defaultValue: fieldValue,
            display: fieldValue,
            editingRecordId: null,
            field: fieldName,
            fieldType: "SCALAR",
            headerName: fieldName,
            invalidMessage: null,
            invalidResultData: null,
            isEditing: false,
            isHidden: false,
            isInvalid: false,
            isPlaceholder: false,
            id: cellId,
            order: cellId,
            recordId: rowId,
            uniqueElementKey: rowId + "_" + cellId,
            value: fieldValue,
            fieldDef: {
                builtIn: false,
                dataIsCopyable: true,
                datatypeAttributes: {
                    clientSideAttributes: {
                        bold: false,
                        max_chars: 3998,
                        num_lines: 1,
                        width: 400,
                        word_wrap: false
                    },
                    htmlAllowed: false,
                },
                id: cellId,
                includeInQuickSearch: true,
                indexed: false,
                multiChoiceSourceAllowed: false,
                name: fieldName,
                required: false,
                type: "SCALAR",
                unique: false,
                userEditableValue: true
            }
        };
        return cell;
    }

}
export default AutomationListTransformer;



