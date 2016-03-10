import org.gradle.api.InvalidUserDataException

class SqlConnectInfo {
    String user = "cadmin";
    String password = "oracle";
    String url = null;
    String sid = null;
    String port = "1521";
    String preInvoke = null;

    String jdbcLib = null;
    String oracleDriver = 'oracle.jdbc.OracleDriver';

    String rootDirectory = null;


    SqlConnectInfo(rootDir) {

        rootDirectory = rootDir;

        // If rdsTag is set, find the RDS instance and
        // set default RDS values user, password, url, and SID.
        def rdsTag = System.getProperty("rdsTag");
        if (rdsTag != null) {
            def rdsInstance = Utils.executeCmd("${rootDirectory}/tools/ci/rdsFindByTag.sh " + rdsTag);
            if (rdsInstance == null) {
                throw InvalidUserDataException ;
            }
            def swimlaneId = Utils.executeCmd("${rootDirectory}/tools/ci/rdsGetTagValue.sh " + rdsInstance + " SwimlaneID");
            def environment = Utils.executeCmd("${rootDirectory}/tools/ci/rdsGetTagValue.sh " + rdsInstance + " QuickBaseEnv");

            def stackname = swimlaneId + "-" + environment + "-oracle";

            println 'Using tag ' + rdsTag + ' found RDS instance ' + rdsInstance + '  swimlane ' + swimlaneId + '  environment ' + environment;

            user = "awsuser"
            password = Utils.executeCmd("${rootDirectory}/tools/ci/getSecret.sh " + stackname + " " + stackname + ".masterpw");
            url = "oracle1." + swimlaneId + ".newstack.quickbaserocks.com";
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
        return "jdbc:oracle:thin:@${url}:${port}/${sid}"
    }

    /*
     SQL file execution is based on the blog
     http://blau-it.basata.bplaced.net/en/2014/02/datenbank-schema-bauen-mit-gradle-teil-ii/
     */
    // Split a SQL file into a set of SQL commands
    String[] splitIntoSQLCommands(path) {
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
    def getCommandType(sql) {
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
    def invokeDBScript(path) {
        if (url == null || sid == null) {
            println 'Invalid Parameters\n' +
                    'Usage:\n' +
                    ' gradle invokeDBScript -Ddburl=<databaseurl> -Ddbsid=<database sid>\n' +
                    ' \n' +
                    '  Optional Parameters:\n' +
                    '  -DpreInvoke SQL statement to invoke before executing the file contents\n' +
                    '  -Dsqlfile <file path location where .sql file should be loaded> no default\n' +
                    '  -Dusername <username to connect to database> (default to cadmin)\n' +
                    '  -Dpassword <password to connect to database> (default to oracle)';
            throw InvalidUserDataException ;
        }

        if (url.contains("prod")) {
            println 'URL for database seems like a production url. Aborting...';
            throw InvalidUserDataException ;
        }

        println "Connecting to database with url: " + getConnectUrl() + " ..."

        // Load the oracle driver to connect to database
        URLClassLoader loader = GroovyObject.class.classLoader
        loader.addURL ( new File(jdbcLib).toURL() )
        Class driverClass = loader.loadClass(oracleDriver)
        java.sql.Driver driverInstance = driverClass.newInstance()
        java.sql.DriverManager.registerDriver(driverInstance)

        // Create SQL instance with server name and login creadentials
        def sql = groovy.sql.Sql.newInstance(getConnectUrl(), user, password, oracleDriver)
        println 'Connected to Oracle...'

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
     * Find a temp directory to store temporary SQL files, either /dev/shm or /tmp
     * @return
     */
    def getTempDir() {
        def tempDir= new File("/dev/shm");
        if (!tempDir.exists()) {
            tempDir = new File("/tmp");
        }

        return tempDir
    }

    /**
     * Creates a testUser in the Oracle DB and then initializes that schema for QuickBase tests.
     * @param testUser User to create
     * @param testPassword Password of user
     * @return null
     */
    def createTestUserInSQL(String testUser, String testPassword) {
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

        // User the test user's credentials to initialize the DB for testing
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
    def dropTestUserFromSQL(String testUser) {
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
