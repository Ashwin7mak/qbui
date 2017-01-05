import _ from 'lodash';

class Row {
    static transformRecordsForGrid(records = [], fields = [], primaryKeyFieldName = 'Record ID#', editingRecordId) {
        if (!records || !_.isArray(records)) {
            return [];
        }

        return records.map((record, index) => {
            let id = record[primaryKeyFieldName].value;
            let recordWithRelatedFieldDef = addRelatedFieldDefinitions(record, fields, id);
            let editing = (id === editingRecordId);
            return new Row(addUniqueKeyTo(recordWithRelatedFieldDef, index), id, editing);
        });
    }

    constructor(record, id, editing) {
        this.id = id;
        this.editing = editing;
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
