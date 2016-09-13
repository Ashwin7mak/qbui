package com.quickbase.utils

import org.gradle.api.InvalidUserDataException

/**
 * SQL connection information needed to pull from AWS and/or create/delete test users in oracle
 *
 * Created by amusale on 3/7/16.
 */
class OracleSqlConnectInfo extends SqlConnectInfo {

    String oracleDriver = 'oracle.jdbc.OracleDriver';
    String jdbcLib = null;
    String user = "cadmin";
    String password = "oracle";
    String sid = null;
    String port = "1521";
    String awsEngine = "oracle";

    OracleSqlConnectInfo(rootDir) {

        rootDirectory = rootDir;

        // If rdsTag is set, find the RDS instance and
        // set default RDS values user, password, url, and SID.
        def rdsTag = System.getProperty("rdsTag");
        if (rdsTag != null) {
            def rdsInstance = Utils.executeCmd("${rootDirectory}/tools/ci/rdsFindByTag.sh " + rdsTag + " " + awsEngine);
            if (rdsInstance == null || rdsInstance.length() == 0) {
                println("ERROR: RDSInstance not found for rdsTag: " + rdsTag + "  engine: " + awsEngine);
                throw InvalidUserDataException ;
            }
            def swimlaneId = Utils.executeCmd("${rootDirectory}/tools/ci/rdsGetTagValue.sh " + rdsInstance + " SwimlaneID");
            def environment = Utils.executeCmd("${rootDirectory}/tools/ci/rdsGetTagValue.sh " + rdsInstance + " Environment");

            def stackname = swimlaneId + "-" + environment + "-oracle";

            printInfo(awsEngine, rdsTag, rdsInstance, swimlaneId, environment)
            user = "awsuser";
            password = Utils.executeCmd("${rootDirectory}/tools/ci/getSecret.sh " + stackname + " " + stackname + ".masterpw");
            url = "oracle1." + swimlaneId + baseDomain;
            sid = "RDSORCL";
        }

        jdbcLib = "${rootDirectory}/lib/ojdbc-12.1.0.2.jar";

        def uname = System.getProperty("username");
        if (uname != null) {
            user = uname;
        }

        def pword = System.getProperty("password");
        if (pword != null) {
            password = pword;
        }

        def portArg = System.getProperty("port");
        if (portArg != null) {
            port = portArg;
        }

        def dbURL = System.getProperty("dburl");
        if (dbURL != null) {
            url = dbURL;
        }

        def dbSid = System.getProperty("dbsid");
        if (dbSid != null) {
            sid = dbSid;
        }

        def preInv = System.getProperty("preInvoke");
        if (preInv != null) {
            preInvoke = preInv;
        }
    }


    def getConnectUrl() {
        return "jdbc:oracle:thin:@${url}:${port}/${sid}";
    }

    def getDriver() {
        return oracleDriver;
    }

    def getJdbcLib() {
        return jdbcLib;
    }

    def invokeDBScript(path) {
        super.invokeDBScript(path, getJdbcLib(), user, password, getConnectUrl())
    }

    /**
     * Creates a testUser in the Oracle DB and then initializes that schema for QuickBase tests.
     * @param testUser User to create
     * @param testPassword Password of user
     * @return null
     */
    def createTestUser(String testUser, String testPassword) {
        // From the template file, create a new file in the temp directory,
        // replacing the user and pasword with the actual values
        def tempCreateUserFile = new File(getTempDir().getAbsolutePath() + "/create-test-user-" + testUser + ".sql");
        tempCreateUserFile.withWriter { w ->
            new File("${rootDirectory}/scripts/create-test-user-template.sql").eachLine { line ->
                w << line.replaceAll('@testuser', testUser).replaceAll('@password', testPassword) << '\n'
            }
        }

        // Run the sql script to create the new user as the permanent admin user (CADMIN or AWSUSER)
        invokeDBScript(tempCreateUserFile.getAbsolutePath());

        // Use the test user's credentials to initialize the DB for testing
        def savedUser = user;
        def savedPassword = password;
        user = testUser;
        password = testPassword;

        def tempResetFile = new File(getTempDir().getAbsolutePath() + "/db-reset-user-" + testUser + ".sql");
        tempResetFile.withWriter { w ->
            new File("${rootDirectory}/scripts/db-reset-test-user-template.sql").eachLine { line ->
                w << line.replaceAll('@testuser', testUser) << '\n'
            }
        }

        invokeDBScript(tempResetFile.getAbsolutePath());

        // Add QB Functions
        invokeDBScript("${rootDirectory}/queryBuilder/src/main/resources/QBFunctions.sql");

        // Restore the permanent admin user credentials and delete the temporary files
        user = savedUser;
        password = savedPassword;

        tempCreateUserFile.delete();
        tempResetFile.delete();
    }

    /**
     * Deletes the test user
     * @param testUser user to delete
     * @return null
     */
    def dropTestUser(String testUser) {
        // From the template file, create a new file in the temp directory,
        // replacing the user and pasword with the actual values
        def tempDropUserFile = new File(getTempDir().getAbsolutePath() + "/drop-test-user-" + testUser + ".sql");
        tempDropUserFile.withWriter { w ->
            new File("${rootDirectory}/scripts/drop-test-user-template.sql").eachLine { line ->
                w << line.replaceAll('@testuser', testUser) << '\n'
            }
        }

        // Run the sql script to delete the test user as the permanent admin user (CADMIN or AWSUSER)
        invokeDBScript(tempDropUserFile.getAbsolutePath());

        tempDropUserFile.delete();
    }
}
