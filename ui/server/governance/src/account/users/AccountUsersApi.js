/*
 The purpose of this module is to process governance api requests for users in an account.
 */
(function() {
    'use strict';

    let perfLogger = require('../../../../src/perfLogger');
    let httpStatusCodes = require('../../../../src/constants/httpStatusCodes');
    let log = require('../../../../src/logger').getLogger();
    let _ = require('lodash');
    let fs = require('fs');


    // Since we don't want to always connect to the external services, we may want to stub out dummy data
    const dummyData = [
        {
            "uid": 10000,
            "firstName": "Administrator",
            "lastName": "User for default SQL Installation",
            "email": "koala_bumbles2@quickbase.com",
            "userName": "administrator",
            "lastAccess": "2017-02-28T19:32:04.223Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 2,
            "userBasicFlags": 24576,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 0,
            "systemRights": -1
        },
        {
            "uid": 56760756,
            "firstName": "Koala",
            "lastName": "Bumbles",
            "email": "koala.bumbles.jr@g88.net",
            "userName": "koala.bumbles.jr@g88.net",
            "lastAccess": "2017-02-22T23:29:02.56Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 1,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 8192,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 13362,
            "systemRights": 0
        },
        {
            "uid": 56760773,
            "firstName": "Koala",
            "lastName": "Realm",
            "email": "koala.bumbles.jr+realm@g88.net",
            "userName": "koala.bumbles.jr+realm@g88.net",
            "lastAccess": "2011-04-12T22:44:50.757Z",
            "numGroupsMember": 1,
            "numGroupsManaged": 1,
            "hasAppAccess": true,
            "numAppsManaged": 1,
            "userBasicFlags": 8192,
            "accountTrusteeFlags": 13,
            "realmDirectoryFlags": 51,
            "systemRights": 0
        },
        {
            "uid": 56760777,
            "firstName": "Koala",
            "lastName": "Realm2",
            "email": "koala.bumbles.jr+realm2@g88.net",
            "userName": "koala.bumbles.jr+realm2@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 4,
            "systemRights": 0
        },
        {
            "uid": 56760786,
            "firstName": "John",
            "lastName": "Smith",
            "email": "koala@zoo.org",
            "userName": "koala@zoo.org",
            "lastAccess": "2017-03-07T00:21:00.04Z",
            "numGroupsMember": 2,
            "numGroupsManaged": 2,
            "hasAppAccess": true,
            "numAppsManaged": 21,
            "userBasicFlags": 8196,
            "accountTrusteeFlags": 13,
            "realmDirectoryFlags": 13365,
            "systemRights": 0
        },
        {
            "uid": 56760787,
            "firstName": "Koala",
            "lastName": "Test Denied",
            "email": "koala+testprov@zoo.org",
            "userName": "koalaDenied",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 8,
            "systemRights": 0
        },
        {
            "uid": 56760788,
            "firstName": "Koala Gmail",
            "lastName": "Test Prov",
            "email": "koala.bumbles.jr+testprov@g88.net",
            "userName": "koala.bumbles.jr+testprov@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 4,
            "systemRights": 0
        },
        {
            "uid": 56760790,
            "firstName": "",
            "lastName": "",
            "email": "koala.bumbles.jr+testreg@g88.net",
            "userName": "koala.bumbles.jr+testreg@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 1,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 0,
            "systemRights": 0
        },
        {
            "uid": 56760791,
            "firstName": "Koala",
            "lastName": "Test 2 Old",
            "email": "koala+test2@zoo.org",
            "userName": "koala+test2@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 56,
            "systemRights": 0
        },
        {
            "uid": 56760792,
            "firstName": "Koala",
            "lastName": "New Test 2",
            "email": "koala+test2@zoo.org",
            "userName": "koala+test2@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56760793,
            "firstName": "Koala",
            "lastName": "Test 2 New",
            "email": "koala+test2@zoo.org",
            "userName": "koala+test2@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 1,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 8196,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 56,
            "systemRights": 0
        },
        {
            "uid": 56760794,
            "firstName": "Koala",
            "lastName": "Test Alt Corp",
            "email": "koala+testalt@zoo.org",
            "userName": "koala+testalt@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 116,
            "systemRights": 0
        },
        {
            "uid": 56760795,
            "firstName": "Koala",
            "lastName": "Test Alt QB",
            "email": "koala+testalt@zoo.org",
            "userName": "sbumblesTestAlt",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 56,
            "systemRights": 0
        },
        {
            "uid": 56760796,
            "firstName": "Koala",
            "lastName": "TestProv",
            "email": "koala+testprov@zoo.org",
            "userName": "koala+testprov@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56760797,
            "firstName": "Koala",
            "lastName": "TestProv 11",
            "email": "sVeOrIgDiVoO+ItDeVsOtIpDrVoOvI1D1V@OhIuDnVgOrIyDbVeOaIrD.VoOrIgD",
            "userName": "sVeOrIgDiVoO+ItDeVsOtIpDrVoOvI1D1V@OhIuDnVgOrIyDbVeOaIrD.VoOrIgD",
            "lastAccess": "2011-04-11T21:19:28.16Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 68,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56760798,
            "firstName": "Koala",
            "lastName": "TestProv12",
            "email": "koala+testprov12@zoo.org",
            "userName": "koala+testprov12@zoo.org",
            "lastAccess": "2011-04-11T21:22:10.353Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 68,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56760799,
            "firstName": "John",
            "lastName": "Smith",
            "email": "koala+changename@zoo.org",
            "userName": "koala+changename@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56760800,
            "firstName": "Koala",
            "lastName": "Realm",
            "email": "koala+realm@zoo.org",
            "userName": "koala+realm@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56760801,
            "firstName": "Zebra",
            "lastName": "Kittens",
            "email": "koala+testprov13@zoo.org",
            "userName": "testprov13",
            "lastAccess": "2011-04-12T22:46:00.03Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 54,
            "systemRights": 0
        },
        {
            "uid": 56760802,
            "firstName": "",
            "lastName": "",
            "email": "koala.bumbles.jr+testprovtosaml@g88.net",
            "userName": "koala.bumbles.jr+testprovtosaml@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 0,
            "systemRights": 0
        },
        {
            "uid": 56760803,
            "firstName": "John",
            "lastName": "Test Prov 13",
            "email": "koala+testprov134@zoo.org",
            "userName": "koala_testprov13",
            "lastAccess": "2011-04-21T20:48:47.673Z",
            "numGroupsMember": 1,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 84,
            "systemRights": 0
        },
        {
            "uid": 56760804,
            "firstName": "Koala",
            "lastName": "Test Prov Reg 2",
            "email": "koala.bumbles.jr+testprovtoreg2@g88.net",
            "userName": "koala.bumbles.jr+testprovtoreg2@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 8,
            "systemRights": 0
        },
        {
            "uid": 56760806,
            "firstName": "Koala",
            "lastName": "Boa",
            "email": "koala+boa@zoo.org",
            "userName": "koala+boa@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 34,
            "systemRights": 0
        },
        {
            "uid": 56763287,
            "firstName": "Koala",
            "lastName": "Bumbles",
            "email": "koala.bumbles.jr+secondaccount@g88.net",
            "userName": "koala.bumbles.jr+secondaccount@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 8192,
            "accountTrusteeFlags": 12,
            "realmDirectoryFlags": 5170,
            "systemRights": 0
        },
        {
            "uid": 56763290,
            "firstName": "John",
            "lastName": "Smith",
            "email": "koala+forcesaml@zoo.org",
            "userName": "koala+forcesaml@zoo.org",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 52,
            "systemRights": 0
        },
        {
            "uid": 56763293,
            "firstName": "Koala",
            "lastName": "Force SAML",
            "email": "koala+forcesaml@zoo.org",
            "userName": "koalaforcesaml",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": false,
            "numAppsManaged": 0,
            "userBasicFlags": 8196,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 5236,
            "systemRights": 0
        },
        {
            "uid": 56778691,
            "firstName": "",
            "lastName": "",
            "email": "koala.bumbles.jr+sharetest1@g88.net",
            "userName": "koala.bumbles.jr+sharetest1@g88.net",
            "lastAccess": "0001-01-01T00:00:00Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 4,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 0,
            "systemRights": 0
        }
    ];

    module.exports = function(config) {
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        let requestHelper = require('../../../../src/api/quickbase/requestHelper')(config);
        let routeHelper = require('../../../../src/routes/routeHelper');

        let accountUsersAPI = {

            /**
             * Allows you to override the request object
             * @param requestOverride
             */
            setRequestObject: function(requestOverride) {
                request = requestOverride;
            },
            /**
             * Allows you to override the requestHelper object
             * @param requestRequestOverride
             */
            setRequestHelperObject: function(requestHelperOverride) {
                requestHelper = requestHelperOverride;
            },

            /**
             * Get all the users in the account. Resolve either the dummy data or the actual one
             * @param req
             * @param useSSL
             * @returns {Promise}
             */
            getAccountUsers: function(req, accountId) {

                return new Promise((resolve, reject) => {

                    // if using a config property to point to a mock then return the dummyData
                    if (config && config.useGovernanceMockData) {
                        return resolve(dummyData);
                    }

                    // make a request to the current stack to get the results
                    let opts = requestHelper.setOptions(req, false, true);
                    opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                    opts.url = routeHelper.getAccountUsersCurrentStack(accountId);

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(JSON.parse(response.body));
                        },
                        (error) => {
                            log.error({req: req}, "getAccountUsers.getAccountUsers(): Error retrieving account users.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('getAccountUsers.getAccountUsers(): unexpected error retrieving account users.', ex, true);
                        reject(ex);
                    });
                });

            }
        };

        return accountUsersAPI;
    };

}());
