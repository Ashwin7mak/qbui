/**
 The purpose of this module is to process /apps/<id>/tables/<id>/form api requests.
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();
    let constants = require('../../../../common/src/constants');
    let stringUtils = require('../../utility/stringUtils');

    module.exports = function(config) {

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        let requestHelper = require('./requestHelper')(config);
        let recordsApi = require('./recordsApi')(config);
        let routeHelper = require('../../routes/routeHelper');

        let fakeData = {
            "formId": 1,
            "tableId": "0wbfabsaaaaac",
            "appId": "0wbfabsaaaaab",
            "type": "EDIT",
            "name": "nameU0xaL1464879524910",
            "description": "LJFB7GPw0BWOIM1lXm50q32PMnJ7mOgdNvLuZYZ29iGZP2KUP3q6D6MdPTmfY11yseIJZE6baLJiqXO4GcCWBccYgUnj2sbRno7g",
            "wrapLabel": true,
            "includeBuiltIns": true,
            "wrapElements": false,
            "newFieldAction": "ASK",
            "tabs": {
                "0": {
                    "orderIndex": 0,
                    "title": "nameMdhfp1464879524917",
                    "sections": {
                        "0": {
                            "orderIndex": 0,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "ZyLnRkgRh1hrz6UDqp2ekiTSK5bSMFDxKnjIT7cjfvolWlw2rs",
                                    "displayOptions": [
                                        "VIEW"
                                    ],
                                    "position": "LEFT",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormTextElement": {
                                        "displayText": "nVKDmsHNglesDRcAE4QoGKj6cd5UdfESolSBpZ31zGBcFsFHTY",
                                        "displayOptions": [
                                            "ADD"
                                        ],
                                        "position": "ABOVE",
                                        "type": "TEXT",
                                        "orderIndex": 0,
                                        "textType": "RAW"
                                    }
                                }
                            }
                        },
                        "1": {
                            "orderIndex": 1,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "y0PJyN2isHoeynP4XnggiboW3ZmWJ3suFHOEYhOboRGOtMQUSD",
                                    "displayOptions": [
                                        "ADD",
                                        "EDIT",
                                        "VIEW"
                                    ],
                                    "position": "ABOVE",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormFieldElement": {
                                        "displayText": "xIepCSrq8URUBZXa6ve6XP78JazogRQ0nFT5P8g7kFf176OzEj",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT"
                                        ],
                                        "position": "ABOVE",
                                        "type": "FIELD",
                                        "orderIndex": 0,
                                        "useAlternateLabel": false,
                                        "readOnly": false,
                                        "required": false,
                                        "fieldId": 2,
                                        "fieldLabel": "testLabel2",
                                        "fieldValue": 123,
                                        "fieldType": "NUMERIC"
                                    }
                                },
                                "1": {
                                    "FormFieldElement": {
                                        "displayText": "g6e5k9ySac7EhVscoc5pHKhAJ1skg7F8zIZlHW8hFuZqq486fz",
                                        "displayOptions": [
                                            "EDIT"
                                        ],
                                        "position": "ABOVE_AND_LEFT",
                                        "type": "FIELD",
                                        "orderIndex": 1,
                                        "useAlternateLabel": true,
                                        "readOnly": true,
                                        "required": false,
                                        "fieldId": 3
                                    }
                                },
                                "2": {
                                    "FormTextElement": {
                                        "displayText": "FFWJ4RpUxV5HioEb1GeipR3EGbmGC6fycKb1kMHlJAvWhVCqvE",
                                        "displayOptions": [
                                            "VIEW"
                                        ],
                                        "position": "ABOVE_AND_LEFT",
                                        "type": "TEXT",
                                        "orderIndex": 2,
                                        "textType": "RAW"
                                    }
                                }
                            }
                        }
                    }
                },
                "1": {
                    "orderIndex": 1,
                    "title": "name0ppDo1464879524917",
                    "sections": {
                        "0": {
                            "orderIndex": 0,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "JlSqUA189ja3ZTbYUq0KbepjpUX7QlNeMEepofeQEAi7dvPGxq",
                                    "displayOptions": [
                                        "ADD",
                                        "EDIT",
                                        "VIEW"
                                    ],
                                    "position": "ABOVE",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormTextElement": {
                                        "displayText": "PCCpyq7xqk5GrCbkUuEfsBRKM2llLn5yzquVsZD8SjE3fMBhlZ",
                                        "displayOptions": [
                                            "EDIT"
                                        ],
                                        "position": "ABOVE",
                                        "type": "TEXT",
                                        "orderIndex": 0,
                                        "textType": "HTML"
                                    }
                                },
                                "1": {
                                    "FormFieldElement": {
                                        "displayText": "tPLX7UPCRBcbBBOZvVWs0RKSlQcCi7DzhIXJNrdl9LOkpyhMSJ",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT",
                                            "VIEW"
                                        ],
                                        "position": "ABOVE_AND_LEFT",
                                        "type": "FIELD",
                                        "orderIndex": 1,
                                        "useAlternateLabel": false,
                                        "readOnly": false,
                                        "required": true,
                                        "fieldId": 1
                                    }
                                },
                                "2": {
                                    "FormFieldElement": {
                                        "displayText": "9zTXdv9VFV7DzSlt72OUYzL5SCfTwFPyOVuHnkezWYiXiOHEwj",
                                        "displayOptions": [
                                            "EDIT",
                                            "VIEW"
                                        ],
                                        "position": "LEFT",
                                        "type": "FIELD",
                                        "orderIndex": 2,
                                        "useAlternateLabel": true,
                                        "readOnly": false,
                                        "required": false,
                                        "fieldId": 4
                                    }
                                },
                                "3": {
                                    "FormTextElement": {
                                        "displayText": "RwtgnolEg1opdV1NTqEfqryErggPg2gBfgG0CaBoFj5Cbsf570",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT"
                                        ],
                                        "position": "ABOVE",
                                        "type": "TEXT",
                                        "orderIndex": 3,
                                        "textType": "HTML"
                                    }
                                },
                                "4": {
                                    "FormTextElement": {
                                        "displayText": "IG50bl9eGyPffIXY87nF235ymuo6tz4BZsQXgkbr9Y09hn8kas",
                                        "displayOptions": [
                                            "ADD",
                                            "VIEW"
                                        ],
                                        "position": "LEFT",
                                        "type": "TEXT",
                                        "orderIndex": 4,
                                        "textType": "HTML"
                                    }
                                }
                            }
                        }
                    }
                },
                "2": {
                    "orderIndex": 2,
                    "title": "nameJ33bc1464879524917",
                    "sections": {
                        "0": {
                            "orderIndex": 0,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "FsJGYu6E0XHYYZ1TRiklLG5c6BfXO1xHx6Sf4un6asWHoH4cc1",
                                    "displayOptions": [
                                        "EDIT"
                                    ],
                                    "position": "ABOVE",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormTextElement": {
                                        "displayText": "H6B1Z77CxNtB7utLRWV72OzICi4oCIuSEq93CmCID8uRkaKHxo",
                                        "displayOptions": [
                                            "ADD",
                                            "VIEW"
                                        ],
                                        "position": "ABOVE_AND_LEFT",
                                        "type": "TEXT",
                                        "orderIndex": 0,
                                        "textType": "RAW"
                                    }
                                },
                                "1": {
                                    "FormFieldElement": {
                                        "displayText": "BlQP5z5ZafYIQ8h1DOU7eghOPEf9VFsvaEm7sPp9I5mBj4X1wc",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT"
                                        ],
                                        "position": "ABOVE",
                                        "type": "FIELD",
                                        "orderIndex": 1,
                                        "useAlternateLabel": false,
                                        "readOnly": false,
                                        "required": true,
                                        "fieldId": 1
                                    }
                                }
                            }
                        },
                        "1": {
                            "orderIndex": 1,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "6798Pl3alg4M6wvfI7m9W7bUFxnPAZ00qciItlr5lIVkmD9a5U",
                                    "displayOptions": [
                                        "ADD"
                                    ],
                                    "position": "ABOVE",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormFieldElement": {
                                        "displayText": "9R52EaVaXO0OOrYbt21CiwLklQeSkB16K7kflzPz5nuj5bI70w",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT"
                                        ],
                                        "position": "ABOVE_AND_LEFT",
                                        "type": "FIELD",
                                        "orderIndex": 0,
                                        "useAlternateLabel": true,
                                        "readOnly": false,
                                        "required": true,
                                        "fieldId": 3
                                    }
                                },
                                "1": {
                                    "FormFieldElement": {
                                        "displayText": "zagmTsdjBYENmTFV6nFhR3NO9wOphouh2hbuIBJvWcVkpATFkD",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT",
                                            "VIEW"
                                        ],
                                        "position": "ABOVE_AND_LEFT",
                                        "type": "FIELD",
                                        "orderIndex": 1,
                                        "useAlternateLabel": true,
                                        "readOnly": false,
                                        "required": true,
                                        "fieldId": 0
                                    }
                                }
                            }
                        },
                        "2": {
                            "orderIndex": 2,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "kDGeyukdE6JoqL1Kp9L0yNtJk6Xl42szH5RHzXsFqfZN23bjAk",
                                    "displayOptions": [
                                        "ADD",
                                        "EDIT",
                                        "VIEW"
                                    ],
                                    "position": "ABOVE_AND_LEFT",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormTextElement": {
                                        "displayText": "mT0VsBJXCzH0mZdZQnZVgEpE2fiMVpMtp9qNL4mNNUTTj4lnxN",
                                        "displayOptions": [
                                            "VIEW"
                                        ],
                                        "position": "LEFT",
                                        "type": "TEXT",
                                        "orderIndex": 0,
                                        "textType": "RAW"
                                    }
                                },
                                "1": {
                                    "FormTextElement": {
                                        "displayText": "9ebAxaU5V3Zsuw1VoS0agPNpfRPKup9J72ejUlY9V1x4644z5d",
                                        "displayOptions": [
                                            "ADD"
                                        ],
                                        "position": "LEFT",
                                        "type": "TEXT",
                                        "orderIndex": 1,
                                        "textType": "RAW"
                                    }
                                },
                                "2": {
                                    "FormFieldElement": {
                                        "displayText": "pNYtoPkcXkKemJUPJL7q8mFfWEBdCkk6e9WCt0EZedNCJCIKMt",
                                        "displayOptions": [
                                            "VIEW"
                                        ],
                                        "position": "ABOVE",
                                        "type": "FIELD",
                                        "orderIndex": 2,
                                        "useAlternateLabel": false,
                                        "readOnly": false,
                                        "required": true,
                                        "fieldId": 3
                                    }
                                },
                                "3": {
                                    "FormTextElement": {
                                        "displayText": "nNRO9RSH61zBEIHdmzeSH5hsbiptyuFUMYPQVUft9N2c4GHyq6",
                                        "displayOptions": [
                                            "VIEW"
                                        ],
                                        "position": "ABOVE",
                                        "type": "TEXT",
                                        "orderIndex": 3,
                                        "textType": "HTML"
                                    }
                                }
                            }
                        },
                        "3": {
                            "orderIndex": 3,
                            "headerElement": {
                                "FormHeaderElement": {
                                    "displayText": "KZaQHNH2nNr2X4CGtw3hESHwZr8QydfZYFfoT8ynFOAVT6Wesw",
                                    "displayOptions": [
                                        "ADD",
                                        "EDIT",
                                        "VIEW"
                                    ],
                                    "position": "LEFT",
                                    "type": "HEADER"
                                }
                            },
                            "elements": {
                                "0": {
                                    "FormFieldElement": {
                                        "displayText": "VBZUL5affN2slm3rc6HMXNk6WRtaeG4Ngcx1vEzYYb21GRChDQ",
                                        "displayOptions": [
                                            "EDIT"
                                        ],
                                        "position": "LEFT",
                                        "type": "FIELD",
                                        "orderIndex": 0,
                                        "useAlternateLabel": true,
                                        "readOnly": true,
                                        "required": true,
                                        "fieldId": 1
                                    }
                                },
                                "1": {
                                    "FormFieldElement": {
                                        "displayText": "zug0TC5Qpo2xTZNFX67gSyL0RRPcmpMx5mcy8EBDrYat4MDFCc",
                                        "displayOptions": [
                                            "ADD",
                                            "EDIT",
                                            "VIEW"
                                        ],
                                        "position": "ABOVE",
                                        "type": "FIELD",
                                        "orderIndex": 1,
                                        "useAlternateLabel": true,
                                        "readOnly": true,
                                        "required": true,
                                        "fieldId": 4
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        /**
         *
         * @param form
         * @returns {Array}
         */
        function extractFidsListFromForm(form) {
            if (!form) {
                return null;
            }

            let fidList = [];

            //  every form should have at least 1 tab
            let tabs = form.tabs;
            if (tabs) {
                for (var tabKey in tabs) {
                    //  each tab should have at least 1 section
                    var tab = tabs[tabKey];
                    if (tab.sections) {
                        for (var sectionKey in tab.sections) {
                            //  each section has elements (text, header, field, etc)
                            var section = tab.sections[sectionKey];
                            if (section.elements) {
                                for (var elementKey in section.elements) {
                                    //  is this a form field element
                                    var element = section.elements[elementKey];
                                    if (element.FormFieldElement) {
                                        //  examine the fieldId and push to the array if not already added
                                        let fieldId = element.FormFieldElement.fieldId;
                                        if (fieldId && !stringUtils.contains(fidList, fieldId)) {
                                            fidList.push(fieldId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return fidList;
        }

        let formsApi = {

            /**
             * Allows you to override the requestHelper object for unit tests.
             * @param requestRequestOverride
             */
            setRequestHelperObject: function(obj) {
                requestHelper = obj;
            },

            /**
             * Allows you to override the recordsApi object for unit tests.
             * @param requestRequestOverride
             */
            setRecordsApiObject: function(obj) {
                recordsApi = obj;
            },

            fetchFormMetaData: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                //  TODO: TEMPORARAY...JUST RETURN FORM ID 1 for now...
                //  TODO: NEED NEW ENDPOINT THAT DOES NOT REQUIRE AN ID...
                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFormsRoute(req.url, 1);
                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Fetch form meta data, a single record and associated fields meta data from a table.
             *
             * @param req
             * @returns Promise
             */
            fetchFormComponents: function(req) {

                return new Promise(function(resolve, reject) {
                    //  fetch the form meta data
                    this.fetchFormMetaData(req).then(
                        function(response) {
                            //  create return object with the form meta data
                            let obj = {
                                formMeta: JSON.parse(response.body),
                                record: {},
                                fields: {}
                            };

                            obj.formMeta = fakeData;

                            //  extract into list all the fields defined on the form.  If any fields, will query for the
                            //  record and fields; otherwise will return empty object for records and fields.
                            let fidList = extractFidsListFromForm(obj.formMeta);
                            if (fidList && fidList.length > 0) {
                                //  ensure the fid list is ordered
                                fidList.sort();

                                //  convert the fid array into a delimited string that will get added to the request as a query parameter
                                let columnList = stringUtils.convertListToDelimitedString(fidList, constants.REQUEST_PARAMETER.LIST_DELIMITER);
                                if (columnList) {
                                    requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.COLUMNS, columnList);
                                }

                                //  get the records and fields
                                recordsApi.fetchSingleRecordAndFields(req).then(
                                    function(resp) {
                                        obj.record = resp.record;
                                        obj.fields = resp.fields;
                                        resolve(obj);
                                    },
                                    function(err) {
                                        let errObj = {};
                                        if (err) {
                                            errObj.statusCode = err.statusCode;
                                            errObj.message = err.statusMessage;
                                            errObj.body = JSON.parse(err.body);
                                        }
                                        reject(errObj);
                                    }
                                );
                            } else {
                                //  no fids on the form; just return the form meta data and empty records and fields
                                resolve(obj);
                            }
                        },
                        function(error) {
                            let errObj = {};
                            if (error) {
                                errObj.statusCode = error.statusCode;
                                errObj.message = error.statusMessage;
                                errObj.body = JSON.parse(error.body);
                            }
                            reject(errObj);
                        }
                    ).catch(function(ex) {
                        requestHelper.logUnexpectedError('formsApi...fetchFormComponents', ex, true);
                        reject(ex);
                    });
                }.bind(this));
            }
        };

        return formsApi;
    };

}());
