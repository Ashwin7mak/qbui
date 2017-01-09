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

            let selected = false;
            if (_.isArray(selectedRows)) {
                selected = selectedRows.includes(id);
            }

            let saving = false;
            if (pendingEdits.currentEditingRecordId === id) {
                saving = pendingEdits.saving;
                Object.keys(pendingEdits.recordChanges).forEach(key => {
                    let pendingEdit = pendingEdits.recordChanges[key];
                    let editedField = recordWithRelatedFieldDef[key];

                    editedField.display = pendingEdit.newVal.display;
                    editedField.value = pendingEdit.newVal.value;
                });
            }

            transformedRecords.push(new Row(addUniqueKeyTo(recordWithRelatedFieldDef, index), id, editingRecordId, selected, parentId, saving));
        });

        return transformedRecords;
    }

    constructor(record, id, editingRecordId, selected, parentId, saving) {
        let isEditing = (id === editingRecordId);
        this.id = id;
        this.isEditing = isEditing;
        this.editingRecord = editingRecordId;
        this.selected = selected;
        this.parentId = parentId;
        this.saving = saving;
        let recordCopy = _.cloneDeep(record);
        Object.keys(recordCopy).forEach(key => {
            recordCopy[key].isEditing = isEditing;
            this[key] = recordCopy[key];
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
        recordWithFieldsAndUniqueKeys[key].key = `${index}-fid-${recordWithFieldsAndUniqueKeys[key].id}-recId-${recordWithFieldsAndUniqueKeys[key].recordId}`;
    });
    return recordWithFieldsAndUniqueKeys;
}

export default Row;
