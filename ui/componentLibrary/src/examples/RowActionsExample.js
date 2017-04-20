// This is a basic example for the React playground
// Please update to include other properties or states for your component
const rowId = 1;
const props = {
    rowId: rowId,
    isEditing: false,
    editingRowId: null,
    isEditingRowValid: true,
    isEditingRowSaving: true,
    isInlineEditOpen: false,
    iconActionsNode: null,
    editingRowErrors: [],
    onCancelEditingRow() {},
    onClickAddNewRow() {},
    onClickToggleSelectedRow() {},
    onClickSaveRow() {}
};

const basicRowActionsExample = (
    <div>
        <dt>Default: </dt>
        <dd>
            <RowActions {...props}/>
        </dd>
    </div>
);

ReactDOM.render(basicRowActionsExample, mountNode);
