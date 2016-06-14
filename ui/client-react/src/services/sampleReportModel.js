/**
 * Created by agoel on 6/9/16.
 */

export const sampleReportModel = {
    reportMetaData: {
        "data" : {
            "name": "Ribef for table-We- appBa",
            "description": null,
            "type": "TABLE",
            "ownerId": "10000",
            "tableId": "0c4aq6aaaaac",
            "id": 1,
            "showDescriptionOnReport": false,
            "hideReport": false,
            "showSearchBox": true,
            "fids": [],
            "sortList": [],
            "facetFids": [],
            "facetBehavior": "default",
            "query": null,
            "allowEdit": true,
            "allowView": true,
            "displayNewlyChangedRecords": false,
            "reportFormat": "",
            "rolesWithGrantedAccess": [],
            "summary": "hide"
        }
    },
    reportData: {
        "data": {
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
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": true,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": false,
                    "userEditableValue": false,
                    "required": true,
                    "unique": true,
                    "indexed": true,
                    "keyField": true,
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
                            "max_chars": 1000
                        },
                        "htmlAllowed": false
                    },
                    "id": 6,
                    "name": "Text Field",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
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
                        "decimalPlaces": 14,
                        "treatNullAsZero": true,
                        "unitsDescription": ""
                    },
                    "id": 7,
                    "name": "Numeric",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "CURRENCY",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "decimalPlaces": 14,
                        "treatNullAsZero": true,
                        "unitsDescription": ""
                    },
                    "id": 8,
                    "name": "Currency",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "PERCENT",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "decimalPlaces": 14,
                        "treatNullAsZero": true,
                        "unitsDescription": ""
                    },
                    "id": 9,
                    "name": "Percent",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "RATING",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "decimalPlaces": 14,
                        "treatNullAsZero": true,
                        "unitsDescription": ""
                    },
                    "id": 10,
                    "name": "Rating Field Test a very long field name",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "DATE",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "showMonthAsName": false,
                        "showDayOfWeek": false,
                        "hideYearIfCurrent": false,
                        "dateFormat": "MM-dd-uuuu"
                    },
                    "id": 11,
                    "name": "Date Field",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "DATE_TIME",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "showMonthAsName": false,
                        "showDayOfWeek": false,
                        "hideYearIfCurrent": false,
                        "dateFormat": "MM-dd-uuuu",
                        "showTime": true,
                        "showTimeZone": false,
                        "timeZone": "America/Los_Angeles"
                    },
                    "id": 12,
                    "name": "Date Time Field",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "TIME_OF_DAY",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "showMonthAsName": false,
                        "showDayOfWeek": false,
                        "hideYearIfCurrent": false,
                        "dateFormat": "MM-dd-uuuu",
                        "showTime": true,
                        "showTimeZone": false,
                        "timeZone": "America/Los_Angeles",
                        "scale": "HH:MM",
                        "use24HourClock": false,
                        "useTimezone": false
                    },
                    "id": 13,
                    "name": "Time of Day Field",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "DURATION",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "decimalPlaces": 14,
                        "treatNullAsZero": true,
                        "scale": "Smart Units"
                    },
                    "id": 14,
                    "name": "Duration",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "CHECKBOX",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false,
                            "display_graphic": true
                        }
                    },
                    "id": 15,
                    "name": "Checkbox Field",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "PHONE_NUMBER",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "includeExtension": true
                    },
                    "id": 16,
                    "name": "Phone Number Field",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "EMAIL_ADDRESS",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false
                        },
                        "sortByDomain": false,
                        "showEmailEveryone": false
                    },
                    "id": 17,
                    "name": "Email",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                },
                {
                    "datatypeAttributes": {
                        "type": "URL",
                        "clientSideAttributes": {
                            "width": 50,
                            "bold": false,
                            "word_wrap": false,
                            "show_as_button": false,
                            "open_in_new_window": false
                        },
                        "displayProtocol": true,
                        "linkText": ""
                    },
                    "id": 18,
                    "name": "Url",
                    "type": "SCALAR",
                    "tableId": "0c4aq6aaaaac",
                    "builtIn": false,
                    "dataIsCopyable": true,
                    "includeInQuickSearch": true,
                    "appearsByDefault": true,
                    "userEditableValue": true,
                    "required": false,
                    "defaultValue": {},
                    "multiChoiceSourceAllowed": false
                }
            ],
            "records": [
                [
                    {
                        "id": 3,
                        "value": 3,
                        "display": "3"
                    },
                    {
                        "id": 6,
                        "value": "Lobub",
                        "display": "Lobub"
                    },
                    {
                        "id": 7,
                        "value": 4.7423,
                        "display": "4.74230000000000"
                    },
                    {
                        "id": 8,
                        "value": 40.6748,
                        "display": "$40.67480000000000"
                    },
                    {
                        "id": 9,
                        "value": 6.1699,
                        "display": "6.16990000000000%"
                    },
                    {
                        "id": 10,
                        "value": 6.0522,
                        "display": 6.0522
                    },
                    {
                        "id": 11,
                        "value": "2109-08-06",
                        "display": "08-06-2109"
                    },
                    {
                        "id": 12,
                        "value": "2100-08-27T16:26:24Z[UTC]",
                        "display": "08-27-2100 8:26 AM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T18:05:22Z[UTC]",
                        "display": "6:05 PM"
                    },
                    {
                        "id": 14,
                        "value": 3369948602,
                        "display": "5.57200496362434 weeks"
                    },
                    {
                        "id": 15,
                        "value": true,
                        "display": true
                    },
                    {
                        "id": 16,
                        "value": "(721) 612-8837",
                        "display": "(721) 612-8837"
                    },
                    {
                        "id": 17,
                        "value": "rahaddec@gmail.com",
                        "display": "rahaddec@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://votav.com/jowpe",
                        "display": "http://votav.com/jowpe"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 2,
                        "display": "2"
                    },
                    {
                        "id": 6,
                        "value": "Zectupiz",
                        "display": "Zectupiz"
                    },
                    {
                        "id": 7,
                        "value": 8.3473,
                        "display": "8.34730000000000"
                    },
                    {
                        "id": 8,
                        "value": 48.0428,
                        "display": "$48.04280000000000"
                    },
                    {
                        "id": 9,
                        "value": 10.2899,
                        "display": "10.28990000000000%"
                    },
                    {
                        "id": 10,
                        "value": 5.9992,
                        "display": 5.9992
                    },
                    {
                        "id": 11,
                        "value": "2063-06-23",
                        "display": "06-23-2063"
                    },
                    {
                        "id": 12,
                        "value": "2049-07-03T07:43:40Z[UTC]",
                        "display": "07-02-2049 11:43 PM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T18:15:00Z[UTC]",
                        "display": "6:15 PM"
                    },
                    {
                        "id": 14,
                        "value": 2017403887,
                        "display": "3.33565457506614 weeks"
                    },
                    {
                        "id": 15,
                        "value": false,
                        "display": false
                    },
                    {
                        "id": 16,
                        "value": "(370) 298-8595",
                        "display": "(370) 298-8595"
                    },
                    {
                        "id": 17,
                        "value": "juzovis@gmail.com",
                        "display": "juzovis@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://apa.io/zo",
                        "display": "http://apa.io/zo"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 4,
                        "display": "4"
                    },
                    {
                        "id": 6,
                        "value": "Pilda",
                        "display": "Pilda"
                    },
                    {
                        "id": 7,
                        "value": 1.7528,
                        "display": "1.75280000000000"
                    },
                    {
                        "id": 8,
                        "value": 96.8666,
                        "display": "$96.86660000000000"
                    },
                    {
                        "id": 9,
                        "value": 4.4951,
                        "display": "4.49510000000000%"
                    },
                    {
                        "id": 10,
                        "value": 5.3685,
                        "display": 5.3685
                    },
                    {
                        "id": 11,
                        "value": "2115-12-11",
                        "display": "12-11-2115"
                    },
                    {
                        "id": 12,
                        "value": "2021-11-13T20:12:46Z[UTC]",
                        "display": "11-13-2021 12:12 PM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T02:33:30Z[UTC]",
                        "display": "2:33 AM"
                    },
                    {
                        "id": 14,
                        "value": 1134334991,
                        "display": "1.87555388723545 weeks"
                    },
                    {
                        "id": 15,
                        "value": false,
                        "display": false
                    },
                    {
                        "id": 16,
                        "value": "(415) 853-5221",
                        "display": "(415) 853-5221"
                    },
                    {
                        "id": 17,
                        "value": "pozaiju@gmail.com",
                        "display": "pozaiju@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://kemlodud.edu/woskewrel",
                        "display": "http://kemlodud.edu/woskewrel"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 8,
                        "display": "8"
                    },
                    {
                        "id": 6,
                        "value": "Cubucnos",
                        "display": "Cubucnos"
                    },
                    {
                        "id": 7,
                        "value": 1.4935,
                        "display": "1.49350000000000"
                    },
                    {
                        "id": 8,
                        "value": 12.1597,
                        "display": "$12.15970000000000"
                    },
                    {
                        "id": 9,
                        "value": 2.7707,
                        "display": "2.77070000000000%"
                    },
                    {
                        "id": 10,
                        "value": 5.7999,
                        "display": 5.7999
                    },
                    {
                        "id": 11,
                        "value": "2049-04-02",
                        "display": "04-02-2049"
                    },
                    {
                        "id": 12,
                        "value": "2065-08-04T07:36:24Z[UTC]",
                        "display": "08-03-2065 11:36 PM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T06:48:24Z[UTC]",
                        "display": "6:48 AM"
                    },
                    {
                        "id": 14,
                        "value": 7315063445,
                        "display": "12.0950123098545 weeks"
                    },
                    {
                        "id": 15,
                        "value": true,
                        "display": true
                    },
                    {
                        "id": 16,
                        "value": "(447) 665-5920",
                        "display": "(447) 665-5920"
                    },
                    {
                        "id": 17,
                        "value": "efadifvi@gmail.com",
                        "display": "efadifvi@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://ruz.io/adu",
                        "display": "http://ruz.io/adu"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 6,
                        "display": "6"
                    },
                    {
                        "id": 6,
                        "value": "Kij",
                        "display": "Kij"
                    },
                    {
                        "id": 7,
                        "value": 7.5415,
                        "display": "7.54150000000000"
                    },
                    {
                        "id": 8,
                        "value": 50.294,
                        "display": "$50.29400000000000"
                    },
                    {
                        "id": 9,
                        "value": 8.7281,
                        "display": "8.72810000000000%"
                    },
                    {
                        "id": 10,
                        "value": 1.3285,
                        "display": 1.3285
                    },
                    {
                        "id": 11,
                        "value": "2065-06-04",
                        "display": "06-04-2065"
                    },
                    {
                        "id": 12,
                        "value": "2038-03-14T09:04:43Z[UTC]",
                        "display": "03-14-2038 1:04 AM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T21:18:32Z[UTC]",
                        "display": "9:18 PM"
                    },
                    {
                        "id": 14,
                        "value": 7128574144,
                        "display": "11.7866635978836 weeks"
                    },
                    {
                        "id": 15,
                        "value": false,
                        "display": false
                    },
                    {
                        "id": 16,
                        "value": "(917) 650-5117",
                        "display": "(917) 650-5117"
                    },
                    {
                        "id": 17,
                        "value": "cag@gmail.com",
                        "display": "cag@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://wuzeere.edu/bilef",
                        "display": "http://wuzeere.edu/bilef"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 7,
                        "display": "7"
                    },
                    {
                        "id": 6,
                        "value": "Biwrib",
                        "display": "Biwrib"
                    },
                    {
                        "id": 7,
                        "value": 6.3306,
                        "display": "6.33060000000000"
                    },
                    {
                        "id": 8,
                        "value": 77.6382,
                        "display": "$77.63820000000000"
                    },
                    {
                        "id": 9,
                        "value": 4.1057,
                        "display": "4.10570000000000%"
                    },
                    {
                        "id": 10,
                        "value": 1.776,
                        "display": 1.776
                    },
                    {
                        "id": 11,
                        "value": "2057-10-14",
                        "display": "10-14-2057"
                    },
                    {
                        "id": 12,
                        "value": "2038-12-19T19:21:24Z[UTC]",
                        "display": "12-19-2038 11:21 AM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T05:41:28Z[UTC]",
                        "display": "5:41 AM"
                    },
                    {
                        "id": 14,
                        "value": 5661240202,
                        "display": "9.36051620701058 weeks"
                    },
                    {
                        "id": 15,
                        "value": true,
                        "display": true
                    },
                    {
                        "id": 16,
                        "value": "(281) 524-8311",
                        "display": "(281) 524-8311"
                    },
                    {
                        "id": 17,
                        "value": "ne@gmail.com",
                        "display": "ne@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://ha.com/wuli",
                        "display": "http://ha.com/wuli"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 1,
                        "display": "1"
                    },
                    {
                        "id": 6,
                        "value": "Ohra",
                        "display": "Ohra"
                    },
                    {
                        "id": 7,
                        "value": 1.7735,
                        "display": "1.77350000000000"
                    },
                    {
                        "id": 8,
                        "value": 15.8376,
                        "display": "$15.83760000000000"
                    },
                    {
                        "id": 9,
                        "value": 5.3507,
                        "display": "5.35070000000000%"
                    },
                    {
                        "id": 10,
                        "value": 3.4113,
                        "display": 3.4113
                    },
                    {
                        "id": 11,
                        "value": "2034-10-19",
                        "display": "10-19-2034"
                    },
                    {
                        "id": 12,
                        "value": "2038-01-22T09:20:27Z[UTC]",
                        "display": "01-22-2038 1:20 AM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T03:15:35Z[UTC]",
                        "display": "3:15 AM"
                    },
                    {
                        "id": 14,
                        "value": 717501954,
                        "display": "1.1863458234127 weeks"
                    },
                    {
                        "id": 15,
                        "value": false,
                        "display": false
                    },
                    {
                        "id": 16,
                        "value": "(675) 734-1332",
                        "display": "(675) 734-1332"
                    },
                    {
                        "id": 17,
                        "value": "jovnuc@gmail.com",
                        "display": "jovnuc@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://ureso.io/olezepve",
                        "display": "http://ureso.io/olezepve"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 9,
                        "display": "9"
                    },
                    {
                        "id": 6,
                        "value": "Ewozki",
                        "display": "Ewozki"
                    },
                    {
                        "id": 7,
                        "value": 0.092,
                        "display": "0.09200000000000"
                    },
                    {
                        "id": 8,
                        "value": 80.0009,
                        "display": "$80.00090000000000"
                    },
                    {
                        "id": 9,
                        "value": 9.8347,
                        "display": "9.83470000000000%"
                    },
                    {
                        "id": 10,
                        "value": 2.256,
                        "display": 2.256
                    },
                    {
                        "id": 11,
                        "value": "2077-11-19",
                        "display": "11-19-2077"
                    },
                    {
                        "id": 12,
                        "value": "2085-11-02T02:42:47Z[UTC]",
                        "display": "11-01-2085 6:42 PM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T16:05:19Z[UTC]",
                        "display": "4:05 PM"
                    },
                    {
                        "id": 14,
                        "value": 4609553322,
                        "display": "7.62161594246032 weeks"
                    },
                    {
                        "id": 15,
                        "value": true,
                        "display": true
                    },
                    {
                        "id": 16,
                        "value": "(656) 757-9439",
                        "display": "(656) 757-9439"
                    },
                    {
                        "id": 17,
                        "value": "af@gmail.com",
                        "display": "af@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://wenrah.com/wetwire",
                        "display": "http://wenrah.com/wetwire"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 5,
                        "display": "5"
                    },
                    {
                        "id": 6,
                        "value": "Ridi",
                        "display": "Ridi"
                    },
                    {
                        "id": 7,
                        "value": 3.9207,
                        "display": "3.92070000000000"
                    },
                    {
                        "id": 8,
                        "value": 51.8918,
                        "display": "$51.89180000000000"
                    },
                    {
                        "id": 9,
                        "value": 7.8725,
                        "display": "7.87250000000000%"
                    },
                    {
                        "id": 10,
                        "value": 0.3251,
                        "display": 0.3251
                    },
                    {
                        "id": 11,
                        "value": "2051-07-19",
                        "display": "07-19-2051"
                    },
                    {
                        "id": 12,
                        "value": "2075-09-15T02:32:06Z[UTC]",
                        "display": "09-14-2075 6:32 PM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T15:51:02Z[UTC]",
                        "display": "3:51 PM"
                    },
                    {
                        "id": 14,
                        "value": 637269067,
                        "display": "1.05368562665344 weeks"
                    },
                    {
                        "id": 15,
                        "value": true,
                        "display": true
                    },
                    {
                        "id": 16,
                        "value": "(828) 399-9675",
                        "display": "(828) 399-9675"
                    },
                    {
                        "id": 17,
                        "value": "oti@gmail.com",
                        "display": "oti@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://tesco.net/lo",
                        "display": "http://tesco.net/lo"
                    }
                ],
                [
                    {
                        "id": 3,
                        "value": 10,
                        "display": "10"
                    },
                    {
                        "id": 6,
                        "value": "Wiz",
                        "display": "Wiz"
                    },
                    {
                        "id": 7,
                        "value": 0.2933,
                        "display": "0.29330000000000"
                    },
                    {
                        "id": 8,
                        "value": 79.1432,
                        "display": "$79.14320000000000"
                    },
                    {
                        "id": 9,
                        "value": 6.0652,
                        "display": "6.06520000000000%"
                    },
                    {
                        "id": 10,
                        "value": 6.8764,
                        "display": 6.8764
                    },
                    {
                        "id": 11,
                        "value": "2018-06-20",
                        "display": "06-20-2018"
                    },
                    {
                        "id": 12,
                        "value": "2019-11-26T00:23:30Z[UTC]",
                        "display": "11-25-2019 4:23 PM"
                    },
                    {
                        "id": 13,
                        "value": "1970-01-01T08:40:10Z[UTC]",
                        "display": "8:40 AM"
                    },
                    {
                        "id": 14,
                        "value": 1343745557,
                        "display": "2.2218015162037 weeks"
                    },
                    {
                        "id": 15,
                        "value": true,
                        "display": true
                    },
                    {
                        "id": 16,
                        "value": "(601) 925-6671",
                        "display": "(601) 925-6671"
                    },
                    {
                        "id": 17,
                        "value": "kakcu@gmail.com",
                        "display": "kakcu@gmail.com"
                    },
                    {
                        "id": 18,
                        "value": "http://fuoblas.gov/uso",
                        "display": "http://fuoblas.gov/uso"
                    }
                ]
            ],
            "groups": [],
            "facets": []
        }
    }
};

