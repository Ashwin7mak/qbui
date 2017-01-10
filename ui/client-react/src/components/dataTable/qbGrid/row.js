import _ from 'lodash';

class Row {
    static transformRecordsForGrid(records = [], fields = [], primaryKeyFieldName = 'Record ID#', editingRecordId, pendingEdits, selectedRows, parentId = null, subHeaderLevel = 0) {
        if (!records || !_.isArray(records)) {
            return [];
        }

        let transformedRecords = [];

        records.forEach((record, index) => {
            if (_.has(record, 'group')) {
                let groupHeaderId = _.uniqueId('groupHeader_');
                transformedRecords.push({
                    subHeader: true,
                    subHeaderLevel: subHeaderLevel,
                    subHeaderLabel: record.group,
                    localized: record.localized,
                    id: groupHeaderId,
                });

                transformedRecords = [...transformedRecords, ...Row.transformRecordsForGrid(record.children, fields, primaryKeyFieldName, editingRecordId, pendingEdits, selectedRows, groupHeaderId, subHeaderLevel + 1)];
                return transformedRecords;
            }

            let id = record[primaryKeyFieldName].value;

            let recordWithRelatedFieldDef = addRelatedFieldDefinitions(record, fields, id);

            let isSelected = false;
            if (_.isArray(selectedRows)) {
                isSelected = selectedRows.includes(id);
            }

            let saving = false;

            // We don't want to add any blank rows unless we are currently adding a new row
            // TODO:: This could cause performance problems if it happens a lot (we could be adding a lot of blank rows). Refactor once AgGrid is removed.
            if (id === null && !pendingEdits.isInlineEditOpen) {
                return;
            }

            let editErrors = null;
            if (pendingEdits.currentEditingRecordId === id && pendingEdits.isInlineEditOpen) {
                saving = pendingEdits.saving;
                editErrors = pendingEdits.editErrors;

                Object.keys(pendingEdits.recordChanges).forEach(key => {
                    let pendingEdit = pendingEdits.recordChanges[key];
                    let editedField = recordWithRelatedFieldDef[key];

                    if (pendingEdit.newVal) {
                        editedField.display = pendingEdit.newVal.display;
                        editedField.value = pendingEdit.newVal.value;
                    }
                });
            }

            transformedRecords.push(new Row(addUniqueKeyTo(recordWithRelatedFieldDef, index), id, editingRecordId, isSelected, parentId, saving, editErrors));
        });

        return transformedRecords;
    }

    constructor(record, id, editingRecordId, isSelected, parentId, saving, editErrors) {
        let isEditing = (id === editingRecordId);
        this.id = id;
        this.isEditing = isEditing;
        this.editingRecord = editingRecordId;
        this.isSelected = isSelected;
        this.parentId = parentId;
        this.saving = saving;
        this.isValid = true;

        if (editErrors) {
            this.isValid = editErrors.ok;
        }

        let recordCopy = _.cloneDeep(record);
        Object.keys(recordCopy).forEach(key => {
            let currentField = recordCopy[key];
            currentField.isEditing = isEditing;
            currentField.isInvalid = false;
            currentField.invalidMessage = null;
            currentField.invalidResultData = null;

            let editError = (editErrors ? _.find(editErrors.errors, {id: currentField.id}) : null);
            if (editError) {
                currentField.isInvalid = editError.isInvalid;
                currentField.invalidMessage = editError.invalidMessage;
                currentField.invalidResultData = editError.invalidResultData;
            }

            this[key] = currentField;
        });
    }
}

function addRelatedFieldDefinitions(record = {}, fields = [], recordId) {
    let transformedRecord = {};
    Object.keys(record).forEach(key => {
        let transformedField = Object.assign({}, record[key]);
        let fieldDef = fields.find(field => {
            return field.id === record[key].id;
        });

        if (fieldDef) {
            transformedField = Object.assign({}, fieldDef, transformedField);
        }

        transformedField.recordId = recordId;
        transformedRecord[transformedField.id] = transformedField;
    });
    return transformedRecord;
}

function addUniqueKeyTo(recordWithFields, index) {
    let recordWithFieldsAndUniqueKeys = _.cloneDeep(recordWithFields);
    Object.keys(recordWithFieldsAndUniqueKeys).forEach(key => {
        recordWithFieldsAndUniqueKeys[key].uniqueElementKey = `${index}-fid-${recordWithFieldsAndUniqueKeys[key].id}-recId-${recordWithFieldsAndUniqueKeys[key].recordId}`;
    });
    return recordWithFieldsAndUniqueKeys;
}

export default Row;
