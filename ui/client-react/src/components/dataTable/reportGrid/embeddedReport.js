import React, {PropTypes} from 'react';
import ReportGrid from './reportGrid';
import _ from 'lodash';

const EmbeddedReport = React.createClass({
    propTypes: {
        appId: PropTypes.string,
        tblId: PropTypes.string,
        rptId: PropTypes.string,

        /**
         * The records to be displayed on the grid */
        records: PropTypes.array,

        /**
         * The columns displayed on the grid */
        columns: PropTypes.array,

        /**
         * The name of the primary key field (usually Record ID#) */
        primaryKeyName: PropTypes.string,

        /**
         * Whether the data for the grid is still loading. Dispalys the loader when true. */
        loading: PropTypes.bool,

        /**
         * Any currently pending edits to a record that have not been saved. The pending values will be displayed
         * instead of the current record values if they exist and the isInlineEditOpen property is true on pending edits.
         */
        pendEdits: PropTypes.object,

        /**
         * Any validation errors for a record that is being edited */
        editErrors: PropTypes.object,

        /**
         * Action that starts inline editing */
        onEditRecordStart: PropTypes.func,

        /**
         * Action to save a record that is currently being edited */
        onClickRecordSave: PropTypes.func,

        /**
         * The action that will cancel any pending edits and close inline editing */
        onEditRecordCancel: PropTypes.func,

        /**
         * The action that will delete a record */
        onRecordDelete: PropTypes.func,

        /**
         * An action that is called when a field should be validated */
        handleValidateFieldValue: PropTypes.func,

        /**
         * Action to add a new blank record to the grid and open it for editing */
        onRecordNewBlank: PropTypes.func,

        /**
         * A property that indicates whether inline edit should be open */
        isInlineEditOpen: PropTypes.bool,

        /**
         * When adding a new blank row, there is now record ID yet. Instead the reportDataStore sets the index of the
         * record in the grid along with an editingId. This property may be depracted once AgGrid is removed. See more information
         * in the getCurrentlyEditingRecordId method
         */
        editingIndex: PropTypes.number,

        /**
         * Related to editingIndex */
        editingId: PropTypes.number,

        /**
         * The currently selected rows. Indicated by the checkboxes in the first column of the grid.*/
        selectedRows: PropTypes.array,

        /**
         * The action to select a row or rows on the grid */
        selectRows: PropTypes.func,

        /**
         * The action to toggle the selection of a row on the grid */
        toggleSelectedRow: PropTypes.func,

        /**
         * The action to take a user to the form view for editing */
        openRecordForEdit: PropTypes.func,

        /**
         * A list of ids by which the report has been sorted (used for displaying the report header menu) */
        sortFids: PropTypes.array
    },

    getDefaultProps:function() {
        return {
            reportData: {
                "loading": false,
                "error": false,
                "data": {
                    "columns": [
                        {
                            "order": 1,
                            "id": 6,
                            "headerName": "Text Field",
                            "field": "Text Field",
                            "fieldDef": {
                                "datatypeAttributes": {
                                    "type": "TEXT",
                                    "clientSideAttributes": {
                                        "width": 50,
                                        "bold": false,
                                        "word_wrap": false,
                                        "num_lines": 1,
                                        "max_chars": 3998
                                    },
                                    "htmlAllowed": false
                                },
                                "id": 6,
                                "name": "Text Field",
                                "type": "SCALAR",
                                "tableId": "0duiiaaaakc",
                                "builtIn": false,
                                "dataIsCopyable": true,
                                "includeInQuickSearch": true,
                                "userEditableValue": true,
                                "required": false,
                                "unique": true,
                                "defaultValue": {},
                                "multiChoiceSourceAllowed": false
                            },
                            "fieldType": "SCALAR",
                            "defaultValue": null,
                            "placeholder": "up to 3998 characters"
                        },
                        {
                            "order": 2,
                            "id": 7,
                            "headerName": "Numeric Parent1 ID",
                            "field": "Numeric Parent1 ID",
                            "fieldDef": {
                                "datatypeAttributes": {
                                    "type": "NUMERIC",
                                    "clientSideAttributes": {
                                        "width": 50,
                                        "bold": false,
                                        "word_wrap": false
                                    },
                                    "treatNullAsZero": true,
                                    "unitsDescription": ""
                                },
                                "id": 7,
                                "name": "Numeric Parent1 ID",
                                "type": "SCALAR",
                                "tableId": "0duiiaaaakc",
                                "builtIn": false,
                                "dataIsCopyable": true,
                                "includeInQuickSearch": true,
                                "userEditableValue": true,
                                "required": false,
                                "indexed": true,
                                "defaultValue": {},
                                "multiChoiceSourceAllowed": false
                            },
                            "fieldType": "SCALAR",
                            "defaultValue": null
                        }
                    ],
                    "description": "This is the report description and it belongs in the stage. We could be so lucky!",
                    "facets": [],
                    "fids": [
                        6,
                        7
                    ],
                    "filteredRecords": [
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 1,
                                "display": "1"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Mujulef",
                                "display": "Mujulef"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 1,
                                "display": "1"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 2,
                                "display": "2"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Omibu",
                                "display": "Omibu"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 1,
                                "display": "1"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 3,
                                "display": "3"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Rureke",
                                "display": "Rureke"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 2,
                                "display": "2"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 4,
                                "display": "4"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Zu",
                                "display": "Zu"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 2,
                                "display": "2"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 5,
                                "display": "5"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Ewva",
                                "display": "Ewva"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 2,
                                "display": "2"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 6,
                                "display": "6"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Bobo",
                                "display": "Bobo"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 3,
                                "display": "3"
                            }
                        }
                    ],
                    "filteredRecordsCount": 6,
                    "fields": [
                        {
                            "datatypeAttributes": {
                                "type": "NUMERIC",
                                "clientSideAttributes": {
                                    "width": 50,
                                    "bold": false,
                                    "word_wrap": false
                                },
                                "decimalPlaces": 0,
                                "treatNullAsZero": true,
                                "unitsDescription": ""
                            },
                            "id": 3,
                            "name": "Record ID#",
                            "type": "SCALAR",
                            "tableId": "0duiiaaaakc",
                            "builtIn": true,
                            "dataIsCopyable": true,
                            "includeInQuickSearch": true,
                            "userEditableValue": false,
                            "required": true,
                            "unique": true,
                            "indexed": true,
                            "defaultValue": {},
                            "multiChoiceSourceAllowed": false
                        },
                        {
                            "datatypeAttributes": {
                                "type": "TEXT",
                                "clientSideAttributes": {
                                    "width": 50,
                                    "bold": false,
                                    "word_wrap": false,
                                    "num_lines": 1,
                                    "max_chars": 3998
                                },
                                "htmlAllowed": false
                            },
                            "id": 6,
                            "name": "Text Field",
                            "type": "SCALAR",
                            "tableId": "0duiiaaaakc",
                            "builtIn": false,
                            "dataIsCopyable": true,
                            "includeInQuickSearch": true,
                            "userEditableValue": true,
                            "required": false,
                            "unique": true,
                            "defaultValue": {},
                            "multiChoiceSourceAllowed": false
                        },
                        {
                            "datatypeAttributes": {
                                "type": "NUMERIC",
                                "clientSideAttributes": {
                                    "width": 50,
                                    "bold": false,
                                    "word_wrap": false
                                },
                                "treatNullAsZero": true,
                                "unitsDescription": ""
                            },
                            "id": 7,
                            "name": "Numeric Parent1 ID",
                            "type": "SCALAR",
                            "tableId": "0duiiaaaakc",
                            "builtIn": false,
                            "dataIsCopyable": true,
                            "includeInQuickSearch": true,
                            "userEditableValue": true,
                            "required": false,
                            "indexed": true,
                            "defaultValue": {},
                            "multiChoiceSourceAllowed": false
                        }
                    ],
                    "keyField": {
                        "datatypeAttributes": {
                            "type": "NUMERIC",
                            "clientSideAttributes": {
                                "width": 50,
                                "bold": false,
                                "word_wrap": false
                            },
                            "decimalPlaces": 0,
                            "treatNullAsZero": true,
                            "unitsDescription": ""
                        },
                        "id": 3,
                        "name": "Record ID#",
                        "type": "SCALAR",
                        "tableId": "0duiiaaaakc",
                        "builtIn": true,
                        "dataIsCopyable": true,
                        "includeInQuickSearch": true,
                        "userEditableValue": false,
                        "required": true,
                        "unique": true,
                        "indexed": true,
                        "defaultValue": {},
                        "multiChoiceSourceAllowed": false
                    },
                    "fieldsMap": {},
                    "groupFields": null,
                    "gridColumns": null,
                    "groupLevel": 0,
                    "name": "Test Report",
                    "records": [
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 1,
                                "display": "1"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Mujulef",
                                "display": "Mujulef"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 1,
                                "display": "1"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 2,
                                "display": "2"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Omibu",
                                "display": "Omibu"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 1,
                                "display": "1"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 3,
                                "display": "3"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Rureke",
                                "display": "Rureke"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 2,
                                "display": "2"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 4,
                                "display": "4"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Zu",
                                "display": "Zu"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 2,
                                "display": "2"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 5,
                                "display": "5"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Ewva",
                                "display": "Ewva"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 2,
                                "display": "2"
                            }
                        },
                        {
                            "Record ID#": {
                                "id": 3,
                                "value": 6,
                                "display": "6"
                            },
                            "Text Field": {
                                "id": 6,
                                "value": "Bobo",
                                "display": "Bobo"
                            },
                            "Numeric Parent1 ID": {
                                "id": 7,
                                "value": 3,
                                "display": "3"
                            }
                        }
                    ],
                    "recordsCount": 6,
                    "sortFids": [
                        2
                    ],
                    "groupEls": [],
                    "originalMetaData": {
                        "name": "Test Report",
                        "description": "This is the report description and it belongs in the stage. We could be so lucky!",
                        "type": "TABLE",
                        "ownerId": "10000",
                        "tableId": "0duiiaaaakc",
                        "id": 1,
                        "showDescriptionOnReport": false,
                        "hideReport": false,
                        "showSearchBox": true,
                        "fids": [],
                        "sortList": [],
                        "facetFids": [],
                        "summarizations": null,
                        "facetBehavior": "default",
                        "query": null,
                        "allowEdit": true,
                        "allowView": true,
                        "displayNewlyChangedRecords": false,
                        "reportFormat": "",
                        "calculatedColumns": null,
                        "reportDefaults": {
                            "fids": [
                                6,
                                7
                            ],
                            "sortList": [
                                {
                                    "fieldId": 2,
                                    "sortOrder": "asc",
                                    "groupType": null
                                }
                            ],
                            "dynamicFilters": [
                                6
                            ],
                            "facetBehavior": "default",
                            "addNewFieldsBehavior": true
                        },
                        "rolesWithGrantedAccess": [],
                        "summary": "hide"
                    },
                    "columnsHaveLocalization": false,
                    "sortList": "2"
                },
                "appId": "0duiiaaaaj3",
                "tblId": "0duiiaaaakc",
                "rptId": "1",
                "pageOffset": 0,
                "numRows": 20,
                "countingTotalRecords": false,
                "searchStringForFiltering": "",
                "selections": {
                    "selectionsHash": {}
                },
                "facetExpression": {},
                "nonFacetClicksEnabled": true,
                "selectedRows": [],
                "currentRecordId": null,
                "nextRecordId": null,
                "previousRecordId": null,
                "nextOrPrevious": "",
                "currentEditRecordId": null,
                "nextEditRecordId": null,
                "previousEditRecordId": null,
                "nextOrPreviousEdit": "",
                "navigateAfterSave": false,
                "isRecordDeleted": false
            },
            columns: [
                {
                    "order": 1,
                    "id": 6,
                    "headerName": "Text Field",
                    "field": "Text Field",
                    "fieldDef": {
                        "datatypeAttributes": {
                            "type": "TEXT",
                            "clientSideAttributes": {
                                "width": 50,
                                "bold": false,
                                "word_wrap": false,
                                "num_lines": 1,
                                "max_chars": 3998
                            },
                            "htmlAllowed": false
                        },
                        "id": 6,
                        "name": "Text Field",
                        "type": "SCALAR",
                        "tableId": "0duiiaaaakc",
                        "builtIn": false,
                        "dataIsCopyable": true,
                        "includeInQuickSearch": true,
                        "userEditableValue": true,
                        "required": false,
                        "unique": true,
                        "defaultValue": {},
                        "multiChoiceSourceAllowed": false
                    },
                    "fieldType": "SCALAR",
                    "defaultValue": null,
                    "placeholder": "up to 3998 characters"
                },
                {
                    "order": 2,
                    "id": 7,
                    "headerName": "Numeric Parent1 ID",
                    "field": "Numeric Parent1 ID",
                    "fieldDef": {
                        "datatypeAttributes": {
                            "type": "NUMERIC",
                            "clientSideAttributes": {
                                "width": 50,
                                "bold": false,
                                "word_wrap": false
                            },
                            "treatNullAsZero": true,
                            "unitsDescription": ""
                        },
                        "id": 7,
                        "name": "Numeric Parent1 ID",
                        "type": "SCALAR",
                        "tableId": "0duiiaaaakc",
                        "builtIn": false,
                        "dataIsCopyable": true,
                        "includeInQuickSearch": true,
                        "userEditableValue": true,
                        "required": false,
                        "indexed": true,
                        "defaultValue": {},
                        "multiChoiceSourceAllowed": false
                    },
                    "fieldType": "SCALAR",
                    "defaultValue": null
                }
            ],
            primaryKeyName: "Record ID#",
            appUsers: [
                {
                    "firstName": "administrator",
                    "lastName": "none",
                    "screenName": "administrator",
                    "email": "administrator@quickbase.com",
                    "userId": "10000"
                }
            ]
        };
    },

    render() {
        return (
            <ReportGrid
                appId={this.props.reportData.appId}
                tblId={this.props.reportData.tblId}
                rptId={this.props.reportData.rptId}

                records={this.props.reportData.data ? _.cloneDeep(this.props.reportData.data.filteredRecords) : []}
                columns={this.props.reportData.data ? this.props.reportData.data.columns : []}
                primaryKeyName={this.props.primaryKeyName}
                loading={this.props.reportData.loading}
                appUsers={this.props.appUsers}
                sortFids={this.props.reportData.data ? this.props.reportData.data.sortFids : []}
            />
        );
    }
});

export default EmbeddedReport;
