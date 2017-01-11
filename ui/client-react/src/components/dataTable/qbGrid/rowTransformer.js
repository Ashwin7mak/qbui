/**
 * A class that holds information about properties that you may want to set for a row to be used
 * in the QbGrid. The rowId is required and a unique identifier for the row. The options are options,
 * but are useful to know about to create subHeaders or other specific row states.
 *
 * No transformation is needed here (as in the ColumnTransformer) because the props for a row are passed through to React components;
 * however, specific grid implementations may want to extend this class to transform data into props. (See ReportRowTransformer as an example)
 */
class RowTransformer {
    /**
     * Builds a row instance
     * @param rowId Required. Unique identifier for row.
     * @param options Other options that are passed as props to the row.
     */
    constructor(
        rowId, // Required unique identifier for a row.
        options = {
            isSubHeader: false, // If set to true, row will appear as a subheader row instead of a regular row
            subHeaderLabel: null, // The label for a subheader row
            subHeaderLevel: null, // The level (i.e., indentation for a subheader, 1-6 is currently supported via styling)
            isEditing: false, // Whether the row is in an editing mode. (Adds an 'editing' class when true)
            isSelected: false, // Denotes when a particular row has been selected
            classes: [] // Any additional css classes to add to the row
        }) {

        this.id = rowId;
        Object.assign(this, options);
    }
}

export default RowTransformer;
