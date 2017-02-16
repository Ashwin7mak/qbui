export default {
    appId: "0duiiaaaaj3",
    tblId: "0duiiaaaakc",
    rptId: "1",
    loading: false,
    error: false,
    records: [
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
