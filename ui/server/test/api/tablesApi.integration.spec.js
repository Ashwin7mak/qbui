(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var log = require('../../src/logger').getLogger();
    var testConsts = require('./api.test.constants');
    var errorCodes = require('../../src/api/errorCodes');
    var testUtils = require('./api.test.Utils');

    describe('API - Validate table apis', function() {
        var app;

        // App variable with different data fields
        var appWithNoFlags = {
            name: 'App for table testing',
            tables: [
                {
                    name: 'table1', fields: [
                    {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'}
                    ]
                }
            ]

        };

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
         */
        before(function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            recordBase.createApp(appWithNoFlags, true).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                done();
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
            return app;
        });


        /**
         * Test that tableComponents end point creates the required components
         */
        it('Should create table components', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT);

            var tableComponentsEndpoint = recordBase.apiBase.resolveTableComponentsEndpoint(app.id);
            let name = testUtils.generateRandomString(10);
            const payload = {name: name, description: "desc", tableIcon: "icon", tableNoun: "noun"};
            recordBase.apiBase.executeRequest(tableComponentsEndpoint, consts.POST, payload).then(
                (response) => {
                    var tableId = response.body;
                    //get table, tableprops, fields, report and form
                    var tableEndpoint = recordBase.apiBase.resolveTablesEndpoint(app.id, tableId);
                    recordBase.apiBase.executeRequest(tableEndpoint, consts.GET).then(
                        (tableResponse) => {
                            var table = JSON.parse(tableResponse.body);
                            assert.equal(table.name, payload.name, "Unexpected table name returned");

                            var promises = [];
                            var tablePropsEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(app.id, tableId);
                            promises.push(recordBase.apiBase.executeRequest(tablePropsEndpoint, consts.GET));
                            var fieldsEndpoint = recordBase.apiBase.resolveFieldsEndpoint(app.id, tableId);
                            promises.push(recordBase.apiBase.executeRequest(fieldsEndpoint, consts.GET));
                            var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, tableId);
                            promises.push(recordBase.apiBase.executeRequest(reportsEndpoint, consts.GET));
                            var formsEndpoint = recordBase.apiBase.resolveFormsEndpoint(app.id, tableId, 1);
                            promises.push(recordBase.apiBase.executeRequest(formsEndpoint, consts.GET));

                            Promise.all(promises).then(
                                (responses) => {
                                    let tableProps = JSON.parse(responses[0].body);
                                    assert.equal(tableProps.tableNoun, payload.tableNoun, "Unexpected table noun returned");
                                    assert.equal(tableProps.tableIcon, payload.tableIcon, "Unexpected table icon returned");
                                    assert.equal(tableProps.description, payload.description, "Unexpected description returned");

                                    let fieldResp = JSON.parse(responses[1].body);
                                    assert.ok(Array.isArray(fieldResp));
                                    assert.equal(fieldResp.length, Object.keys(consts.BUILTIN_FIELD_ID).length + 3, "Unexpected number of fields returned");

                                    let reportResp = JSON.parse(responses[2].body);
                                    assert.ok(Array.isArray(reportResp));
                                    assert.equal(reportResp.length, 2, "Unexpected number of reports returned");

                                    let formResp = JSON.parse(responses[3].body);
                                    assert(formResp.name, payload.tableNoun + " form", "Unexpected form returned");
                                    done();
                                },
                                (error) => {
                                    done(new Error("Error retrieving table components: " + JSON.stringify(error)));
                                }
                            ).catch((error) => {
                                done(new Error("Assertion failure: " + JSON.stringify(error)));
                            });
                        },
                        (error) => {
                            done(new Error("Expected table not found"));
                        }
                    ).catch((error) => {
                        done(new Error("Assertion failure: " + JSON.stringify(error)));
                    });
                },
                (error) => {
                    done(new Error("Failure creating table components: " + JSON.stringify(error)));
                }).catch(function(error) {
                    log.error(JSON.stringify(error));
                    done();
                });
        });

        it('Should update table', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT);

            var tableId = app.tables[0].id;
            var tablesEndpoint = recordBase.apiBase.resolveTablesEndpoint(app.id, tableId, true);
            let name = testUtils.generateRandomString(10);
            const payload = {name: name, description: "desc", tableIcon: "icon", tableNoun: "noun"};
            recordBase.apiBase.executeRequest(tablesEndpoint, consts.PATCH, payload).then(
                (response) => {
                    var promises = [];
                    var tableEndpoint = recordBase.apiBase.resolveTablesEndpoint(app.id, tableId);
                    promises.push(recordBase.apiBase.executeRequest(tableEndpoint, consts.GET));
                    var tablePropsEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(app.id, tableId);
                    promises.push(recordBase.apiBase.executeRequest(tablePropsEndpoint, consts.GET));
                    Promise.all(promises).then(
                        (responses) => {
                            var table = JSON.parse(responses[0].body);
                            assert.equal(table.name, payload.name, "Unexpected table name returned");
                            var tableProps = JSON.parse(responses[1].body);
                            assert.equal(tableProps.tableNoun, payload.tableNoun, "Unexpected table noun returned");
                            assert.equal(tableProps.tableIcon, payload.tableIcon, "Unexpected table icon returned");
                            assert.equal(tableProps.description, payload.description, "Unexpected description returned");
                            done();
                        },
                        (error) => {
                            done(new Error("Unexpected error retrieving table from core"));
                        }
                    ).catch((error) => {
                        done(new Error("Assertion failure: " + JSON.stringify(error)));
                    });
                },
                (error) => {
                    done(new Error("Error calling update Table " + JSON.stringify(error)));
                }
            ).catch((error) => {
                done(new Error("Unexpected exception calling update Table " + JSON.stringify(error)));
            });
        });


        // it('should update a table with no table properties successfully after first creating table properties', function(done) {
        //     this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
        //     recordBase.createApp(appWithNoFlags, 'false').then(function(appResponse) {
        //         let appWithTablesWithoutProps = JSON.parse(appResponse.body);
        //         let tableId = appWithTablesWithoutProps.tables[0].id;
        //         let tablesEndpoint = recordBase.apiBase.resolveTablesEndpoint(appWithTablesWithoutProps.id, tableId, true);
        //         let name = testUtils.generateRandomString(10);
        //         const payload = {name: name, description: "desc", tableIcon: "icon", tableNoun: "table noun"};
        //         recordBase.apiBase.executeRequest(tablesEndpoint, consts.PATCH, payload).then(
        //             (coreResponse) => {
        //                 assert.equal(coreResponse.statusCode, 200, "Unexpected HTTP response code received during update table call to EE");
        //                 let tablePropsEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(appWithTablesWithoutProps.id, tableId);
        //                 recordBase.apiBase.executeRequest(tablePropsEndpoint, consts.GET).then(
        //                     (eeResponse) => {
        //                         let tableProps = JSON.parse(eeResponse.body);
        //                         assert.equal(tableProps.tableNoun, payload.tableNoun, "Unexpected table noun returned");
        //                         assert.equal(tableProps.tableIcon, payload.tableIcon, "Unexpected table icon returned");
        //                         assert.equal(tableProps.description, payload.description, "Unexpected description returned");
        //                         done();
        //                     },
        //                     (eeError) => {
        //                         done(new Error("Unexpected error validating get table properties response" + JSON.stringify(eeError)));
        //                     }
        //                 ).catch((eeException) => {
        //                     done(new Error("Unexpected exception validating get table properties response" + JSON.stringify(eeException)));
        //                 });
        //             },
        //             (coreError) => {
        //                 done(new Error("Unexpected error on update table call to EE" + JSON.stringify(coreError)));
        //             }
        //         ).catch((coreException) => {
        //             done(new Error("Unexpected exception on update table call to EE" + JSON.stringify(coreException)));
        //         });
        //     }).catch(function(exception) {
        //         log.error(JSON.stringify(exception));
        //         done();
        //     });
        // });

        it('Should delete table', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT);

            var tableId = app.tables[0].id;
            var tablesEndpoint = recordBase.apiBase.resolveTablesEndpoint(app.id, tableId, true);
            recordBase.apiBase.executeRequest(tablesEndpoint, consts.DELETE).then(
                (response) => {
                    var tablePropsEndpoint = recordBase.apiBase.resolveTablePropertiesEndpoint(app.id, tableId);
                    recordBase.apiBase.executeRequest(tablePropsEndpoint, consts.GET).then(
                        (responses) => {
                            done(new Error("Unexpected error, table expected to be deleted on EE"));
                        },
                        (eeError) => {
                            assert.equal(eeError.statusCode, 404, "Table should have been deleted on EE");
                            var tableEndpoint = recordBase.apiBase.resolveTablesEndpoint(app.id, tableId);
                            recordBase.apiBase.executeRequest(tableEndpoint, consts.GET).then(
                                () => {
                                    done(new Error("Unexpected error, table expected to be deleted on Core and EE"));
                                },
                                (coreError) => {
                                    assert.equal(coreError.statusCode, 404, "Table should have been deleted on core");
                                    done();
                                }
                            ).catch((error) => {
                                done(new Error("Assertion failure: " + JSON.stringify(error)));
                            });
                        }
                    ).catch((error) => {
                        done(new Error("Assertion failure: " + JSON.stringify(error)));
                    });
                },
                (error) => {
                    done(new Error("Error calling delete Table " + JSON.stringify(error)));
                }
            ).catch((error) => {
                done(new Error("Unexpected exception calling delete Table " + JSON.stringify(error)));
            });
        });

        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
