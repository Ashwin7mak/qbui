import RowTransformer from '../qbGrid/rowTransformer';
import _ from 'lodash';
import {DEFAULT_RECORD_KEY} from '../../../constants/schema';
import Locale from '../../../locales/locales';

/**
 * A helper class to transform report API data into rows that can be displayed the Reactabular grid
 * TODO:: Once AgGrid is removed, we may be able to improve performance by only doing these transformations once in the reportDataStore.
 */
class ReportRowTransformer extends RowTransformer {
    /**
     * Transforms records from the report API into rows that can be displayed in the Reactabular grid.
     * @param records
     * @param fields
     * @param info
     * @returns {Array}
     */
    static transformRecordsForGrid(
        records = [],
        fields = [],
        info = {
            primaryKeyFieldName: DEFAULT_RECORD_KEY,
            editingRecordId: null,
            pendEdits: {},
            selectedRows: [],
            parentId: null,
            subHeaderLevel: 0,
            isInlineEditOpen: false
        }) {

        if (!records || !_.isArray(records)) {
            return [];
        }

        let transformedRecords = [];

        records.forEach((record, index) => {
            if (isAGroupOfRecords(record)) {
                transformedRecords = flattenRecordGroup(record, transformedRecords, fields, info);
                return;
            }

            let transformedRecord = ReportRowTransformer.transformRecordForGrid(record, index, fields, info);
            if (transformedRecord) {
                transformedRecords.push(transformedRecord);
            }
        });

        return transformedRecords;
    }

    /**
     * Transform a single record from the report API to a row object that can be used by the Reactabular Grid
     * @param record
     * @param index
     * @param fields
     * @param info
     * @returns {*}
     */
    static transformRecordForGrid(record, index, fields, info) {
        let id = record[info.primaryKeyFieldName].value;

        let recordWithRelatedFieldDef = addUniqueKeyTo(addCurrentValues(id, addRelatedFieldDefinitions(record, fields, id), info.pendEdits), index);
        let editErrors = addEditErrorsIfExistForRow(id, info.pendEdits);

        return new ReportRowTransformer({
            record: recordWithRelatedFieldDef,
            id: id,
            editingRecordId: info.editingRecordId,
            isSelected: isRowSelected(id, info.selectedRows),
            parentId: info.parentId,
            isSaving: isRowSaving(id, info.pendEdits),
            // Is inlineEditOpen has to be passed in to make sure the first column updates to show the row actions again
            // when inlineEditOpen closes for a different row. Performance boosts in Reactabular won't allow a row/cell to be updated if the data doesn't change.
            isInlineEditOpen: info.isInlineEditOpen,
            editErrors
        });
    }

    constructor({record, id, editingRecordId, isSelected, parentId, isSaving, isInlineEditOpen, editErrors}) {
        let isEditing = (id === editingRecordId);

        let recordCopy = _.cloneDeep(record);
        let cells = [];
        Object.keys(recordCopy).forEach(key => {
            cells.push(addPropertiesToIndividualField(recordCopy[key], editErrors, isEditing, editingRecordId));
        });

        super(id, cells);

        this.isEditing = isEditing;
        this.isSelected = isSelected;
        this.parentId = parentId;
        this.isSaving = isSaving;
        this.isInlineEditOpen = isInlineEditOpen;
        this.isValid = true;

        if (editErrors) {
            this.isValid = editErrors.ok;
        }
    }
}


// --- PRIVATE FUNCTION ---
/**
 * Use the values for the record. However, if there are pendingEdits that match this record ID, use the most
 * recently updated values for the row so the user can see the changes they are making. The original record values
 * are not modified.
 * @param id
 * @param record
 * @param pendEdits
 * @returns {*}
 */
function addCurrentValues(id = null, record = {}, pendEdits = {}) {
    let recordCopy = _.cloneDeep(record);

    if (hasPendingEditsForRow(id, pendEdits)) {
        if (shouldFocusOnFieldWhenFirstOpenEditing(pendEdits, recordCopy)) {
            recordCopy[pendEdits.fieldToStartEditing.id].hasFocusOnEditStart = true;
        }

        Object.keys(pendEdits.recordChanges).forEach(key => {
            let pendingEdit = pendEdits.recordChanges[key];
            if (recordCopy.hasOwnProperty(key) && pendingEdit.newVal) {
                recordCopy[key].display = pendingEdit.newVal.display;
                recordCopy[key].value = pendingEdit.newVal.value;
            }
        });
    }

    return recordCopy;
}

/**
 * We add the field definitions to each cell/field in a record to make it easier to display fields in the Reactabular grid
 * @param record
 * @param fields
 * @param recordId
 * @returns {{}}
 */
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

/**
 * Create the unique key that React can use to keep track of each element in the grid. This has 2 benefits:
 *   1) Performance improvements - React won't try to recreate every element on every render
 *   2) Keeps focus on the cell you are editing. When an input field is re-rendered, focus is lost.
 * @param recordWithFields
 * @param index
 * @returns {*}
 */
function addUniqueKeyTo(recordWithFields, index) {
    let recordWithFieldsAndUniqueKeys = _.cloneDeep(recordWithFields);
    Object.keys(recordWithFieldsAndUniqueKeys).forEach(key => {
        recordWithFieldsAndUniqueKeys[key].uniqueElementKey = `${index}-fid-${recordWithFieldsAndUniqueKeys[key].id}-recId-${recordWithFieldsAndUniqueKeys[key].recordId}`;
    });
    return recordWithFieldsAndUniqueKeys;
}

/**
 * Determines if the current record is actually a group of records that needs to be flattened
 * @param record
 */
function isAGroupOfRecords(record) {
    return _.has(record, 'group');
}

/**
 * Take a record group (nested object of records) and convert it to a flattened array of row objects for use in Reactabular.
 * Uses recursion to get deeply nested groups and keep track of the level of the subheadings.
 * @param record
 * @param transformedRecords
 * @param fields
 * @param subHeaderLevel
 * @param info
 * @returns {Array|[*,*]}
 */
function flattenRecordGroup(record, transformedRecords, fields, info) {
    // Use a uniqueId to avoid identical keys when the same group name is repeated
    let groupHeaderId = _.uniqueId(`groupHeader_${record.group}`);

    let currentSubHeaderLevel = (_.isNumber(info.subHeaderLevel) ? info.subHeaderLevel : 0);

    transformedRecords.push({
        isSubHeader: true,
        subHeaderLevel: currentSubHeaderLevel,
        subHeaderLabel: record.group,
        localized: record.localized,
        id: groupHeaderId,
        parentId: info.parentId
    });

    let newInfo = {
        ...info,
        subHeaderLevel: currentSubHeaderLevel + 1,
        parentId: groupHeaderId
    };

    return [...transformedRecords, ...ReportRowTransformer.transformRecordsForGrid(record.children, fields, newInfo)];
}

/**
 * Determine if the current row is selected
 * @param id
 * @param selectedRows
 * @returns {boolean}
 */
function isRowSelected(id, selectedRows) {
    let isSelected = false;
    if (_.isArray(selectedRows)) {
        // Need to use lodash here because current PhantomJS browser does not support [].includes() and babel is not transpiling it
        isSelected = _.includes(selectedRows, id);
    }
    return isSelected;
}


/**
 * Determine if there are pending edits for the current record
 * @param id
 * @param pendEdits
 * @returns {*}
 */
function hasPendingEditsForRow(id, pendEdits) {
    return (pendEdits ? pendEdits.currentEditingRecordId === id && pendEdits.isInlineEditOpen : false);
}

/**
 * Determine if the record is in a saving state
 * @param id
 * @param pendEdits
 * @returns {*}
 */
function isRowSaving(id, pendEdits) {
    return (hasPendingEditsForRow(id, pendEdits) ? pendEdits.saving : false);
}

/**
 * Add any validation errors for a record if they exist
 * @param id
 * @param pendEdits
 * @returns {*}
 */
function addEditErrorsIfExistForRow(id, pendEdits) {
    return (hasPendingEditsForRow(id, pendEdits) ? pendEdits.editErrors : null);
}

/**
 * For each cell (i.e., field) in the row, add the properties for displaying it correctly in the Reactabular grid.
 * @param field
 * @param editErrors
 * @param isEditing
 * @param editingRecordId
 * @returns {*}
 */
function addPropertiesToIndividualField(field, editErrors, isEditing, editingRecordId) {
    field.isEditing = isEditing;
    field.editingRecordId = editingRecordId;
    field.isInvalid = false;
    field.invalidMessage = null;
    field.invalidResultData = null;

    let editError = (editErrors ? _.find(editErrors.errors, {id: field.id}) : null);
    if (editError) {
        field.isInvalid = editError.isInvalid;
        field.invalidMessage = editError.invalidMessage;
        field.invalidResultData = editError.invalidResultData;
    }

    return field;
}

/**
 * Determines whether a field should be focused when the record first enters editing mode.
 * To identify whether the field is first entering edit mode, we check the recordChanges. When a field first opens for
 * editing, the recordChanges is an empty object. If this check is absent, then this field will keep getting focused after
 * a user edits a different field.
 * @param pendEdits
 * @param record
 * @returns {*|boolean}
 */
function shouldFocusOnFieldWhenFirstOpenEditing(pendEdits, record) {
    return (_.has(pendEdits, 'fieldToStartEditing.id') && _.has(record, pendEdits.fieldToStartEditing.id) && (!pendEdits.recordChanges || Object.keys(pendEdits.recordChanges).length === 0));
}

export default ReportRowTransformer;
