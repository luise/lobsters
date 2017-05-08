// Contains functionality to deploy Lobsters. See lobsters-example.js for
// an example of how to use this file.

exports.Deploy = function(deployment, sqlRootPassword) {
    // Create a container for mysql.
    var sqlContainer = new Container("mysql:5.6.32");

    // Set SQL environment variables to initialize the root password and a
    // lobsters user.
    sqlContainer.setEnv("MYSQL_ROOT_PASSWORD", sqlRootPassword);

    var sqlService = new Service("sql", [sqlContainer]);

    // Create a container for lobste.rs and configure it.
    var lobstersContainer = new Container("quilt/lobsters");

    // Set the DATABASE_URL environment variable, which is how rails determines which database
    // to connect to.
    var sqlDatabaseUrl = "mysql2://root:" + sqlRootPassword + "@" +
        sqlService.hostname() + ":3306/lobsters";
    lobstersContainer.setEnv("DATABASE_URL", sqlDatabaseUrl);

    var lobstersService = new Service("lobsters", [lobstersContainer]);

    // Allow inbound connections to SQL at 3306 (the default SQL port).
    lobstersService.connect(3306, sqlService);

    // Allow inbound connections to the lobsters UI.
    publicInternet.connect(3000, lobstersService);

    // Deploy lobste.rs and mysql using the given deployment object.
    deployment.deploy(sqlService);
    deployment.deploy(lobstersService);
}
