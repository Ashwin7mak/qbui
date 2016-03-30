package com.quickbase.utils

import org.gradle.api.InvalidUserDataException

/**
 * SQL connection information needed to pull from AWS and/or create/delete test users in Postgres
 *
 * Created by amusale on 3/7/16.
 */
class PostgresSqlConnectInfo extends SqlConnectInfo {

    String postgresDriver = 'org.postgresql.Driver';
    String jdbcLib = null;
    String postgresUrl = null;
    String postgresUser = null;
    String postgresAdminUser = "dts";
    String postgresAdminPwd = "quickbase";
    String postgresPwd = null;
    String postgresDBName = null;
    String defaultPostgresDBName = "dtsDB";
    String awsEngine = "postgres";

    PostgresSqlConnectInfo(rootDir) {

        rootDirectory = rootDir;

        // If rdsTag is set, find the RDS instance and
        // set default RDS values user, password, url
        def rdsTag = System.getProperty("rdsTag");
        if (rdsTag != null) {
            def rdsInstance = Utils.executeCmd("${rootDirectory}/tools/ci/rdsFindByTag.sh " + rdsTag + " " + awsEngine);
            if (rdsInstance == null || rdsInstance.length() == 0) {
                println("ERROR: RDSInstance not found for rdsTag: " + rdsTag + "  engine: " + awsEngine);
                throw InvalidUserDataException ;
            }
            def swimlaneId = Utils.executeCmd("${rootDirectory}/tools/ci/rdsGetTagValue.sh " + rdsInstance + " SwimlaneID");
            def environment = Utils.executeCmd("${rootDirectory}/tools/ci/rdsGetTagValue.sh " + rdsInstance + " QuickBaseEnv");

            printInfo(awsEngine, rdsTag, rdsInstance, swimlaneId, environment)
            postgresUser = "dts";
            postgresUrl = "dts-postgres." + swimlaneId + baseDomain;
            postgresAdminPwd = Utils.executeCmd("${rootDirectory}/tools/ci/getSecret.sh dts dts.dbpwd");
        }

        jdbcLib = "${rootDirectory}/lib/postgresql-9.4.1208.jre6.jar";

        def uname = System.getProperty("psql.testuser");
        if (uname != null) {
            postgresUser = uname;
        }

        def pword = System.getProperty("psql.password");
        if (pword != null) {
            postgresPwd = pword;
        }

        def portArg = System.getProperty("psql.port");
        if (portArg != null) {
            port = portArg;
        }

        def dbURL = System.getProperty("psql.dburl");
        if (dbURL != null) {
            postgresUrl = dbURL;
        }

        def dbname = System.getProperty("psql.dbname");
        if (dbname != null) {
            postgresDBName = dbname;
        } else {
            postgresDBName = Utils.generator(('A'..'Z').join(), 5);
        }

        def preInv = System.getProperty("preInvoke");
        if (preInv != null) {
            preInvoke = preInv;
        }
    }

    def getConnectUrl(dbName) {
        return "jdbc:postgresql://${postgresUrl}:5432/${dbName}";
    }

    def getConnectUrl() {
        return getConnectUrl(postgresDBName);
    }

    def getDriver() {
        return postgresDriver;
    }

    def getJdbcLib() {
        return jdbcLib;
    }

    /**
     * Creates a testUser in the Postgres DB and then initializes the schema for QuickBase tests.
     *
     * @param testUser User to create
     * @param testPassword Password of user
     * @return null
     */
    def createTestUser(String testUser, String testUserPassword) {
        println("Creating user in postgres");
        postgresUser = testUser;
        postgresPwd = testUserPassword;

        def tempCreateUserFile = new File(getTempDir().getAbsolutePath() + "/create-postgres-test-user-" + testUser + ".sql");
        tempCreateUserFile.withWriter { w ->
            new File("${rootDirectory}/scripts/dtsCreateDatabase-postgres.sql").eachLine { line ->
                w << line.replaceAll('@testuser', testUser).replaceAll('@password', testUserPassword).replaceAll('@dbname', postgresDBName) << '\n'
            }
        }

        // Run the sql script to create the new user as postgres user
        invokeDBScript(tempCreateUserFile.getAbsolutePath(), getJdbcLib(),
                postgresAdminUser, postgresAdminPwd, getConnectUrl(defaultPostgresDBName));

        def tempResetFile = new File(getTempDir().getAbsolutePath() + "/create-postgres-tables-" + testUser + ".sql");
        tempResetFile.withWriter { w ->
            new File("${rootDirectory}/scripts/dtsCreateTables-postgres.sql").eachLine { line ->
                w << line.replaceAll('@testuser', testUser) << '\n'
            }
        }

        invokeDBScript(tempResetFile.getAbsolutePath(), getJdbcLib(), testUser, testUserPassword, getConnectUrl());

        tempCreateUserFile.delete();
        tempResetFile.delete();
    }

    /**
     * Deletes the test user from postgres database
     * @param testUser user to delete
     * @return null
     */
    @Override
    def dropTestUser(String testUser) {
        // From the template file, create a new file in the temp directory,
        // replacing the user and pasword with the actual values
        def tempDropUserFile = new File(getTempDir().getAbsolutePath() + "/drop-test-user-postgres-" + testUser + ".sql");
        tempDropUserFile.withWriter { w ->
            new File("${rootDirectory}/scripts/dtsDropDBAndUser-postgres.sql").eachLine { line ->
                w << line.replaceAll('@testuser', testUser).replaceAll('@dbname', postgresDBName) << '\n'
            }
        }

        // Run the sql script to delete the test user as the permanent admin user (CADMIN or AWSUSER)
        invokeDBScript(tempDropUserFile.getAbsolutePath(), getJdbcLib(), postgresAdminUser, postgresAdminPwd,
                getConnectUrl(defaultPostgresDBName));

        tempDropUserFile.delete();
    }
}
