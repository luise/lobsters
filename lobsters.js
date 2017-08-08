// Contains functionality to deploy Lobsters. See lobsters-example.js for
// an example of how to use this file.

const { Container, Service, publicInternet } = require('@quilt/quilt');

exports.deploy = function deploy(deployment, sqlRootPassword) {
  // Create a container for mysql.
  const sqlContainer = new Container('mysql:5.6.32');

  // Set SQL environment variables to initialize the root password and a
  // lobsters user.
  sqlContainer.setEnv('MYSQL_ROOT_PASSWORD', sqlRootPassword);

  const sqlService = new Service('sql', [sqlContainer]);

  // Create a container for lobste.rs and configure it.
  const lobstersContainer = new Container('quilt/lobsters');

  // Set the DATABASE_URL environment variable, which is how rails determines which database
  // to connect to.
  const sqlDatabaseUrl = `mysql2://root:${sqlRootPassword}@${
    sqlService.hostname()}:3306/lobsters`;
  lobstersContainer.setEnv('DATABASE_URL', sqlDatabaseUrl);

  const lobstersService = new Service('lobsters', [lobstersContainer]);

  // Allow inbound connections to SQL at 3306 (the default SQL port).
  sqlService.allowFrom(lobstersService, 3306);

  // Allow inbound connections to the lobsters UI.
  lobstersService.allowFrom(publicInternet, 3000);

  // Deploy lobste.rs and mysql using the given deployment object.
  deployment.deploy(sqlService);
  deployment.deploy(lobstersService);
};
