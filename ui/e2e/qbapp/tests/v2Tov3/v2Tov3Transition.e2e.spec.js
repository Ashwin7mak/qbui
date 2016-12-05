/**
 * Created by skamineni on 12/5/16.
 */
(function() {
    'use strict';

    //Load the page Objects
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var v2Tov3Page = requirePO('v2Tov3');
    var v2Tov3PO = new v2Tov3Page();

    describe('V2 to V3 transition Tests:', function() {
        var realmName;
        var realmId;
        var app;
        var appId;
        var tableId;
        var recordList;
        var userId;

        beforeAll(function(done) {
            //App basic setUp
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                appId = app.id;
                tableId = app.tables[0].id;
            }).then(function() {
                //create user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                    //add user to participant appRole
                    return e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, '11', [userId]);
                });
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                done();
            });
        });

        xit('Login as admin and verify you see Mange user access to Mercury popup in the apps page footer', function(done) {
            RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint)).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Select the app
                RequestAppsPage.selectApp(app);
            }).then(function() {
                //Click on popup in the footer
                v2Tov3PO.clickManageUserAccessToggle();
            }).then(function() {
                //Verify switch to mercury is selected by default
                expect(v2Tov3PO.openInMercury.element(by.tagName('input')).getAttribute('value')).toBe('true');
            }).then(function() {
                done();
            });
        });

        xit('Login as user and Verify Mange user access to Mercury popup dont show up in the apps page footer', function(done) {
            RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId=')).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Select the app
                RequestAppsPage.selectApp(app);
            }).then(function() {
                expect(v2Tov3PO.popUpTitle.element(by.className('popupFooterTitleLabel')).isPresent()).toBeFalsy();
            }).then(function() {
                done();
            });
        });

        it('Login as user and switch to classic toggle under user Menu and verify it went to V2', function(done) {
            //get the user authentication
            RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId=')).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Select the app
                RequestAppsPage.selectApp(app);
            }).then(function() {//select classic Toggle under user Menu
                v2Tov3PO.clickUserMenuItem('Switch to QuickBase Classic');
            }).then(function() {
                //verify its switched to classic view (ie V2)
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toBe(e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/db/' + app.id));
                });
            }).then(function() {
                done();
            });
        });

    });
}());
