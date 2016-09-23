# Migrate Test Data for QuickBase

You may want additional test data to play around with while working on the newstack.
One way to get some data that looks more like typical user data is to migrate it from the pre-production server.
This guide will walk you through the process of migrating data from pre-production tests to your local dev
environment.

## Requirements

You will need the following:

1. A local oracle server (see https://github.com/QuickBase/QuickBase for getting setup)
2. A local tomcat server (see https://github.com/QuickBase/QuickBase for getting setup)
3. Access to the AWS Pre-production server (AWS account). If you need an account, please complete
an ops request at https://team.quickbase.com/db/bhvkpd55u
4. Bastion must be setup (see below)
5. If working from home, you will need VPN to access https://www.jenkinscs1.quickbaserocks.com

## Setting up Bastion

(Similar instructions are also available at https://github.com/QuickBase/aws)

1. Get the `development-preprod.pem` from a team member (it is not in the repository)
2. Copy the `development-preprod.pem` file to the `~/.ssh` folder (you may need to create that folder)
3. Set the permissions to 0400
  - You can use the command `$ chmod 0400 ~/.ssh/development-preprod.pem`
4. Create/Update the `config` file in `~/.ssh/` with the following contents:
  ```
  Host bastion
    ServerAliveInterval 60
    hostname bastion.services.newstack.quickbaserocks.com
    User ec2-user
    IdentityFile "~/.ssh/development-preprod.pem"
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null

  Host 10.82.*
    ServerAliveInterval 60
    User ec2-user
    IdentityFile "~/.ssh/development-preprod.pem"
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    ProxyCommand ssh -q ec2-user@bastion -W %h:%p
  ```

## Setup Your Tests to Migrate and Save Data

1. Update the `migration.local.properties` in `QuickBase/migration/src/main/resources` (easier to search for the file using CMD-SHIFT-N) to point to the migration server. The migration server is the test server running current stack at http://www.jenkinscs1.quickbaserocks.com. You are migrating to your local dev environment which hosts the newstack java core (e.g., http://localhost:8080/api). You may want to ask a team member for a copy of their file. An example file is below.
    ```java
    # Example of migration.local.properties for migrating data to a dev environment

    #integration endpoint
    realmId=117000
    realmName=localhost
    endpoint=http://quickbase-dev.com:8080/api

    migration.apiserver.endpoint=http://quickbase-dev.com:8080/api/api/v1
    migration.apiserver.creation.realm=localhost
    migration.apiserver.creation.realmId=117000
    migration.recordChunkSize=1000
    migration.maxErrorRetries=10000
    migration.api.chunkSize=1000

    migration.source.bufferedReads=10
    migration.destination.threadcount=1

    connectionTimeout=60000
    connectionRequestTimeout=60000
    socketTimeout=60000

    legacy.admin.username=administrator
    legacy.admin.password=jbcdjja
    legacy.user.password=quickbase123
    legacy.testkey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    legacy.excludeFiles=true
    legacy.sql.driver=net.sourceforge.jtds.jdbc.Driver
    legacy.sql.user=quickbase
    legacy.sql.password=onebase

    auth.ticket.validate=true
    auth.ticket.encryption.salt=salt123
    auth.ticket.encryption.anothersalt=salt456
    auth.ticket.encryption.hashkey=*ad023,.SdfW
    auth.ticket.version.max=8
    auth.ticket.version.min=8
    auth.ticket.version.current = 8
    auth.ticket.ignore.expiration = false
    auth.ticket.duration.minutes = 7200

    #
    ##################################################################################################################
    #   Migration Properties that reference a lab server.  This is used when testing against a branch
    #   that has yet to be merged into the master branch!
    ##################################################################################################################

    migration.aleroot=http://www.jenkinscs1.quickbaserocks.com/ALE
    legacy.quickbase.endpoint=https://jenkinscs1.quickbaserocks.com:443
    legacy.sql.url=jdbc:jtds:sqlserver://localhost:1433/QuickBase
    ```
2. In `MigrationTestSetup.java` (in `QuickBase/migration/src/test/java/com.quickbase/migration/legacy/services/`),
set the annotation above the `destroy` method to `@AfterClass(enabled = false, alwaysRun = true)` (currently on line 156).
This prevents the migrated data from being deleted after the test completes. If that doesn't work, try
commenting out the contents of the `destroy` method as shown below.
  ``` java
  //QuickBase/migration/src/test/java/com.quickbase/migration/legacy/services/MigrationTestSetup.java
  // starting on line 150

    /**
     * Cleanup data used in testing.
     */
    @AfterClass(enabled = false, alwaysRun = true)
    public void destroy() {
  //        if (null != newRealm) {
  //            // Remove current stack and new stack realms used in testing
  //            setDefaultRealmSubdomainEndpoint();
  //            legacyRealmService.deleteRealm(legacyRealm);
  //            try {
  //                newRealmService.deleteRealm(newRealm, "cleanup migrated realm and apps");
  //            } catch (AssertionError e) {
  //                LOGGER.sys().warn("Assertion error occured during deleteRealm and will be ignored.", e);
  //            }
  //
  //            if (null != legacyAppSchema && null != legacyAppSchema.getTables()) {
  //                // delete all the sb1 files downloaded
  //                for (TableExport tableExport : legacyAppSchema.getTables()) {
  //
  //                    String fileName = tableExport.getId() + IDBIDStreamResolver.FileType.RECORD.getExtension();
  //                    File file = new File(fileName);
  //
  //                    if (file.delete()) {
  //                        LOGGER.sys().info("rec file with name {} deleted", fileName);
  //                    } else {
  //                        LOGGER.sys().info("failed to delete rec file with name {}", fileName);
  //                    }
  //                }
  //            }
  //        }
      }
  ```

## Migrating Test Data

1. Make sure that your local oracle server is running (VMWare environment)
2. Start or restart the Tomcat server (especially if you made the changes in the prior sections)
3. Obtain the IP address of the pre-production database
  - Login at https://quickbase-preprod.signin.aws.amazon.com/console using your AWS credentials
  - Click 'EC2' (Should be on the top right under 'Computer')
  - Click "Instances" (in the menu on the left)
  - Enter "jenkins" (no quotes) in the search filter
  - Click "JENKINSCS1-dev-current-stack"
  - In the panel, copy the number next to "Private IPs" (e.g., 10.82.555.555), you will need this number soon.
4. Start running the bastion tunnel to that server
  - In the terminal run, `$ ssh bastion -L 1433:[AWS IP ADDRESS GOES HERE]:1433` replace the brackets with the IP address you got in Step 2.
  - For example, `$ ssh bastion -L 1433:10.82.150.152:1433`
5. Run one of the migration tests
  - For example:
  - Open `OpportunitiesMigrationTest.java` in `QuickBase\migration\src\test\java\com.quickbase\migration\e2e`
  - Right click on the tab with the file name up at the top
  - In the menu, click "Run Opportunities Migration Test"
6. Find the realm and id of your newly imported data
  - Stop and restart the Tomcat server
  - In the logs search for "realm: id"
  - You should see something like: `{"timestamp":"2016-09-12T14:09:13.503-04:00","logger":"system:com.quickbase.coherence.realm.discovery.OracleRealmResolver","thread":"pool-2-thread-1","level":"INFO","HOSTNAME":"cmbl130e983f7.corp.quickbase.net","message":"Found realm: id=11605059 ob32Id=mcfcd name=dgphqeh9foclc5zqt671mgkcidw07ggi subdomain=rn7twcmvsdceaw0rv1birjtgaw7fmdq4"}`
  - Copy the `id` and `subdomain`
  - Create a ticket to login to that realm by visiting `http://<SUBDOMAIN>.localhost:9000/api/api/v1/ticket?uid=10000&realmId=<REALMID>` (replace subdomain and realm id with the values from above)
  - Visit your apps at `http://<SUBDOMAIN>.localhost:9000/apps`
  - **Note:** You may have setup your test domain to be `localhost.com` or `localhost.dev` or `quickbase.dev`. Be sure to make the appropriate changes to the URLs above if you have a different domain.
  - **Tip:** Bookmark the ticket so you don't have to find these values again.
  - **Tip:** If you prefer, you can also find the Realm ID and Subdomain inside of SqlDeveloper (Oracle DB) by viewing information in the `[random_letters]_META` tables.

## Migrating a Custom App

1. Visit https://www.jenkinscs1.quickbaserocks.com
2. Login with the administrator credentials
  - Open `migration.local.properties`
  - Copy the value for `legacy.admin.username` for the username
  - Copy the value for `legacy.admin.password` for the password
3. Create your app on current stack
4. After building your app, go to the "App Settings"
  - If you are on the "Home" tab for your app, click "Settings", then "App Properties"
  - Scroll to the "Internal QuickBase Use Only" area
  - The "Is a sample application" should be checked
  - The "This is a CWG sample" should be checked
5. Add the appropriate user permission
  - Go to the home page of your app and click the "Users" tab at the top
  - Click "Share app with new user"
  - Click the open book (directory) button (it is to the left of the "Enter email address..." field)
  - Change the dropdown next to the "Search" field to "Groups"
  - Choose "Everyone on the Internet"
  - Click "OK"
  - **Uncheck the "Send email invitation" checkbox**
  - Click "Add"
6. Finish building out your app
7. Before you leave, copy the DB id
  - It is in the url `https://www.jenkinscs1.quickbaserocks.com/db/[db_id]`
  - For example, the id is `bk63ynrtg` for the URL `https://www.jenkinscs1.quickbaserocks.com/db/bk63ynrtg?a=manageusers`
8. Follow steps 1 to 4 in [Migrating Test Data](#migrating-test-data)
9. Open one of the migration tests
  - For example:
  - Open `OpportunitiesMigrationTest.java` in `QuickBase\migration\src\test\java\com.quickbase\migration\e2e`
10. Change the `appToClone` to the DB id you obtained in step 7. (e.g., `appToClone="bk63ynrtg";`
11. Run the migration test
  - For example:
  - Right click on the tab with the file name up at the top
  - In the menu, click "Run Opportunities Migration Test"
12. See Step 6 in [Migrating Test Data](#migrating-test-data) for obtaining your Realm ID and viewing it on newstack on your dev machine


## Troubleshooting

### I get a "properties not found" error when running the tests

Try copying:
- `c3p0.properties`
- `mchange-commons.properties`
- `mchange-log.properties`
from `allServices/src/main/webapp/WEB-INF/` to `migration/src/main/resources/`


### I'm getting Authentication errors

Make sure the 'salts' are the same across all of the following files:
- `migration.local.properties`
- `core.local.properties`
- (if you have it) `/usr/local/etc/qbase/core.local.properties`

### I'm getting an "invalid ticket for realm" error

- Make sure you followed step 4 and 5 in [Migrating a Custom App](#migrating-a-custom-app) carefully.
- Update your master branch, re-run gradle, and restart your Tomcat server

### I'm getting somewhat unclear error messages when I try to migrate my own app (not a ticket error)

- You may be trying to migrate a field (or a field with specific settings) that are not yet supported by the migration service
- Try simplifying the fields in your table and try again
