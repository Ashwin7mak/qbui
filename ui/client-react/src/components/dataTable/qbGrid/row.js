import _ from 'lodash';

class Row {
    static transformRecordsForGrid(records = [], fields = [], primaryKeyFieldName = 'Record ID#', editingRecordId, pendingEdits, selectedRows) {
        if (!records || !_.isArray(records)) {
            return [];
        }

        return records.map((record, index) => {
            let id = record[primaryKeyFieldName].value;

            let recordWithRelatedFieldDef = addRelatedFieldDefinitions(record, fields, id);
            let editing = (id === editingRecordId);

            let selected = false;
            if (_.isArray(selectedRows)) {
                selected = selectedRows.includes(id);
            }

            if (pendingEdits.currentEditingRecordId === id) {
                Object.keys(pendingEdits.recordChanges).forEach(key => {
                    let pendingEdit = pendingEdits.recordChanges[key];
                    let editedField = recordWithRelatedFieldDef[key];

                    // Because after a blur, newVal.display and newVal.value are objects instead of values
                    // I'm not sure why that happens, but it does, and I'm dealing with it this way because
                    // I don't want to break the current AgGrid
                    if (_.has(pendingEdit, 'newVal.display.display')) {
                        editedField.display = pendingEdit.newVal.display.display;
                        editedField.value = pendingEdit.newVal.value.value;
                    } else {
                        editedField.display = pendingEdit.newVal.display;
                        editedField.value = pendingEdit.newVal.value;
                    }
                });
            }

            return new Row(addUniqueKeyTo(recordWithRelatedFieldDef, index), id, editing, selected);
        });
    }

    constructor(record, id, editing, selected) {
        this.id = id;
        this.editing = editing;
        this.selected = selected;
        let recordCopy = _.cloneDeep(record);
        Object.keys(recordCopy).forEach(key => {
            recordCopy[key].editing = editing;
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
