import _ from 'lodash';

class Row {
    static transformRecordsForGrid(records = [], fields = [], primaryKeyFieldName = 'Record ID#') {
        if (!records || !_.isArray(records)) {
            return [];
        }

        return records.map(record => {
            let id = record[primaryKeyFieldName].value;
            return new Row(addRelatedFieldDefinitions(record, fields), id);
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

export default Row;
