import _ from 'lodash';

class Row {
    static transformRecordsForGrid(records = [], fields = [], primaryKeyFieldName = 'Record ID#') {
        if (!records || !_.isArray(records)) {
            return [];
        }

        return records.map((record, index) => {
            let id = record[primaryKeyFieldName].value;
            let recordWithRelatedFieldDef = addRelatedFieldDefinitions(record, fields);
            return new Row(addUniqueKeyTo(recordWithRelatedFieldDef, index, id), id);
        });
    }

    constructor(record, id) {
        this.id = id;
        Object.keys(record).forEach(key => {
            this[key] = record[key];
        });
    }

}

function addRelatedFieldDefinitions(record = {}, fields = []) {
    let transformedRecord = {};
    Object.keys(record).forEach(key => {
        let transformedField = Object.assign({}, record[key]);
        let fieldDef = fields.find(field => {
            return field.id === record[key].id;
        });

        if (fieldDef) {
            transformedField = Object.assign({}, fieldDef, transformedField);
        }
        transformedRecord[transformedField.id] = transformedField;
    });
    return transformedRecord;
}

function addUniqueKeyTo(recordWithFields, index, recordId) {
    let recordWithFieldsAndUniqueKeys = _.cloneDeep(recordWithFields);
    Object.keys(recordWithFieldsAndUniqueKeys).forEach(key => {
        recordWithFieldsAndUniqueKeys[key].key = `${index}-fid-${recordWithFieldsAndUniqueKeys[key].id}-recId-${recordId}`;
    });
    return recordWithFieldsAndUniqueKeys;
}

export default Row;
