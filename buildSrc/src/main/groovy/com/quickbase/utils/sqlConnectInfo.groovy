package com.quickbase.utils;

import org.gradle.api.InvalidUserDataException

abstract class SqlConnectInfo {
    String preInvoke = null;
    String baseDomain = ".newstack.quickbaserocks.com";

    String url = null;
    String rootDirectory = null;

    protected SqlConnectInfo() {}

    abstract def getConnectUrl();
    abstract def getDriver();
    abstract def getJdbcLib();
    abstract def createTestUser(String testUser, String testPassword);
    abstract def dropTestUser(String testUser);

    /*
     SQL file execution is based on the blog
     http://blau-it.basata.bplaced.net/en/2014/02/datenbank-schema-bauen-mit-gradle-teil-ii/
     */
    // Split a SQL file into a set of SQL commands
    def static String[] splitIntoSQLCommands(String path) {
        def result = []
        def sb     = new StringBuilder(8192)

        new File(path).eachLine { line ->
            if (line.length() > 0 && line[0] == '/') {
                def cmd = sb.toString().trim()
                if ( ! cmd.isEmpty()) {
                    result << cmd
                }
                sb.setLength(0)
            } else if ( ! line.trim().startsWith('--')) {
                sb << line << '\n'
            }
        }
        return result
    }

    // Detect if the given SQL command is a select, a stored procedure call
    // or a DDL/DML SQL statement.
    // NOTE: we should tolerate leading comments in future versions
    def static getCommandType(sql) {
        def pattern    = ~/\s/
        def matcher    = pattern.matcher(sql)
        def firstToken = matcher.find() ? sql.substring(0, matcher.start()).toLowerCase() : ""

        if (firstToken == 'select') {
            'select'
        } else if (firstToken in ['declare', 'begin' ]) {
            'call'
        } else {
            'execute'
        }
    }

    /**
     * Execute a SQL script.
     * @param path Path the to the SQL script being invoked
     * @return null
     */
    def invokeDBScript(path, String library, user, password, url) {

        if (url.contains("prod")) {
            println 'URL for database seems like a production url. Aborting...';
            throw InvalidUserDataException ;
        }

        println "Connecting to database with url: ${url} ..."

        def driver = getDriver();
        // Load the oracle driver to connect to database
        URLClassLoader loader = (URLClassLoader)GroovyObject.class.classLoader
        loader.addURL ( new File(library).toURL() )
        Class driverClass = loader.loadClass(driver)
        java.sql.Driver driverInstance = driverClass.newInstance()
        java.sql.DriverManager.registerDriver(driverInstance)

        // Create SQL instance with server name and login creadentials
        def sql = groovy.sql.Sql.newInstance(url, user, password, driver)
        println "Connected to DB with url: ${url} and driver: ${driver}"

        int commandCount = 0

        if (null != preInvoke) {
            println "... Pre-invoking sql statement: ${preInvoke}"
            sql.execute(preInvoke)
        }
        println "... Calling script: ${path}"

        splitIntoSQLCommands(path).each { command ->
            def type = getCommandType(command)
            // println "\n\nType $type:\n$command"
            switch (type) {
                case 'select':
                    sql.eachRow(command) { row -> println "  ${rowToString(row)}" }
                    break
                case 'call':
                    sql.call(command)
                    break
                default:
                    sql.execute(command)
            }
            commandCount++
        }
        println "... $commandCount commands executed in '$path'."
    }

    /**
     * Format a row into a string
     * @param row to format
     * @return  formatted string
     */
    def static rowToString(row) {
        def result   = new StringBuffer()
        def metaData = row.getMetaData()

        for (i in 1..metaData.getColumnCount()) {
            if (i > 1) result << ', '
            result << metaData.getColumnName(i) << ': "' << row.getAt(i - 1).toString() << '"'
        }
        return result.toString()
    }

    /**
     * Find a temp directory to store temporary SQL files, either /dev/shm or /tmp
     * @return
     */
    def static getTempDir() {
        def tempDir= new File("/dev/shm");
        if (!tempDir.exists()) {
            tempDir = new File("/tmp");
        }

        return tempDir
    }

    /**
     * print the information on console
     */
    def static printInfo(database, rdsTag, rdsInstance, swimlaneId, environment) {
        println("**************************************")
        println("Database: " + database)
        println("RDS Tag: " + rdsTag)
        println("RDS Instance: " + rdsInstance)
        println("Swimlane: " + swimlaneId)
        println("Environment: " + environment)
        println("**************************************")
    }
}
