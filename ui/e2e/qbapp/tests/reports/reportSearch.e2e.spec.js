(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportFacetsPage = requirePO('reportFacets');
    var reportServicePage = new ReportServicePage();
    var reportFacetsPage = new ReportFacetsPage();

    describe('Search Report', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var searchTableResults = [];

        var testRecord = [
            [{'id': 6, 'value': ''}, {'id': 7, 'value': '2016-04-12'}, {'id': 8, 'value': '2016-04-12T05:51:19Z'}, {'id': 9, 'value': 'first_name_last_name@quickbase.com'}, {'id': 10, 'value': true}, {'id': 11, 'value': 7.642}],
            [{'id': 6, 'value': 'xyz'}, {'id': 7, 'value': '2015-04-12'}, {'id': 8, 'value': '2015-04-12T05:51:19Z'}, {'id': 9, 'value': 'xyz_last_name@quickbase.com'}, {'id': 10, 'value': false}, {'id': 11, 'value': 9.292}],
            [{'id': 6, 'value': 'wuv'}, {'id': 7, 'value': '2016-01-12'}, {'id': 8, 'value': '2016-01-12T05:51:19Z'}, {'id': 9, 'value': 'abcxyz_LastName@quickbase.com'}, {'id': 10, 'value': true}, {'id': 11, 'value': 6.05}]
        ];

        beforeAll(function(done) {
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Date Field'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Date Time Field'] = {fieldType: consts.SCALAR, dataType: consts.DATE_TIME};
            tableToFieldToFieldTypeMap['table 1']['Email'] = {fieldType: consts.SCALAR, dataType: consts.EMAIL_ADDRESS};
            tableToFieldToFieldTypeMap['table 1']['Checkbox Field'] = {fieldType: consts.SCALAR, dataType: consts.CHECKBOX};
            tableToFieldToFieldTypeMap['table 1']['Numeric Field'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};

            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 0).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord);
            }).then(function() {
                //Create a report with facets [text field and checkbox field]
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE1].id, [6, 10]);
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Wait for the leftNav to load
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    done();
                });
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup beforeAll: ' + error.message);
            });
        });

        afterAll(function(done) {
            e2eBase.cleanup(done);
        });

        /**
         * Function that will verify the filtered rows are contained in actual record list.
         * @param facets Group
         */
        var verifySearchTableResults = function(expectedTableResults) {
            var actualTableResults = [];
            reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                //sleep for loading of table to finish
                e2eBase.sleep(browser.params.smallSleep);
                reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                    reportServicePage.agGridRecordElList.map(function(row) {
                        var cells = row.all(by.className('ag-cell-no-focus'));
                        return [
                            cells.get(1).all(by.tagName('input')).first().getAttribute('value'),
                            cells.get(2).all(by.tagName('input')).first().getAttribute('value'),
                            // Selenium returns 'Invalid date' when trying to get the value of a Date/Time field, getText works however
                            cells.get(3).getText(),
                            cells.get(4).all(by.tagName('input')).first().getAttribute('value'),
                            // Checkbox field no longer a text field with value
                            cells.get(5).all(by.tagName('input')).first().isSelected(),
                            cells.get(6).all(by.tagName('input')).first().getAttribute('value')
                        ];
                    }).then(function(results) {
                        for (var i = 0; i < results.length; i++) {
                            actualTableResults.push(results[i]);
                        }
                        var found = false;
                        actualTableResults.sort();
                        expectedTableResults.sort();
                        expect(actualTableResults.length).toEqual(expectedTableResults.length);
                        expect(actualTableResults).toEqual(expectedTableResults);
                    });
                });
            });
        };

        /**
         * Data Provider for reports and faceting results.
         */
        function searchTestCases() {
            return [
                {
                    message: ' Numeric value',
                    query: '7.642',
                    columnId: 7,
                    expectedSearchResults:[
                        ['', '04-12-2016', '04-11-2016 10:51 PM', 'first_name_last_name@quickbase.com', true, '7.642']
                    ]
                },
                {
                    message: ' Checkbox value',
                    query: 'true',
                    expectedSearchResults: [
                        ['', '04-12-2016', '04-11-2016 10:51 PM', 'first_name_last_name@quickbase.com', true, '7.642'],
                        ['wuv', '01-12-2016', '01-11-2016 9:51 PM', 'abcxyz_LastName@quickbase.com', true, '6.05']
                    ]
                },
                {
                    message: ' Text value',
                    query: 'xyz',
                    expectedSearchResults: [
                        ['wuv', '01-12-2016', '01-11-2016 9:51 PM', 'abcxyz_LastName@quickbase.com', true, '6.05'],
                        ['xyz', '04-12-2015', '04-11-2015 10:51 PM', 'xyz_last_name@quickbase.com', false, '9.292']
                    ]
                }
                //TODO the below gives error loading report error
                //{
                //    message: ' with null value',
                //    query: '',
                //    expectedSearchResults: [{'Text':'','Date':'4/12/2016','DateTime':'04-11-2016 10:51 PM','Email':'first_name_last_name@quickbase.com','Checkbox':'true'}]
                //},
                //{
                //    message: ' Text value',
                //    query: 'd',
                //    expectedSearchResults: [
                //        ['wuv','1/12/2016','01-11-2016 9:51 PM','abcxyz_LastName@quickbase.com','true','6.05']
                //    ]
                //},
                //{
                //    message: ' Text value',
                //    query: 'today',
                //    expectedSearchResults: [
                //        ['wuv','1/12/2016','01-11-2016 9:51 PM','abcxyz_LastName@quickbase.com','true','6.05']
                //    ]
                //},
            ];
        }

        // Grab a random test case from the data provider
        var testcase = searchTestCases()[Math.floor(Math.random() * searchTestCases().length)];

        it(' With Facets - ' + testcase.message, function(done) {
            //go to report page directly
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterSearchBox).then(function() {
                    reportServicePage.reportFilterSearchBox.clear().sendKeys(testcase.query, protractor.Key.ENTER).then(function() {
                        reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                            verifySearchTableResults(testcase.expectedSearchResults);
                            done();
                        });
                    });
                });
            });
        });

        it(' Without Facets - ' + testcase.message, function(done) {
            //go to report page directly
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterSearchBox).then(function() {
                    reportServicePage.reportFilterSearchBox.clear().sendKeys(testcase.query, protractor.Key.ENTER).then(function() {
                        reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                            verifySearchTableResults(testcase.expectedSearchResults);
                            done();
                        });
                    });
                });
            });
        });

        it('Special characters Test', function(done) {
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
            reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                reportServicePage.reportFilterSearchBox.clear().sendKeys('@#^&*!!', protractor.Key.ENTER);
                //sleep for loading of table to finish
                e2eBase.sleep(browser.params.mediumSleep);
                expect(reportServicePage.griddleWrapperEl.getText()).toEqual('There is no data to display.');
                expect(reportServicePage.reportFilterSearchBox.isDisplayed()).toBeTruthy();
                done();
            });
        });

    });
}());
