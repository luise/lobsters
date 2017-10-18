// Contains functionality to deploy Lobsters. See lobsters-example.js for
// an example of how to use this file.

const { Container, publicInternet } = require('kelda');

exports.deploy = function deploy(deployment, sqlRootPassword) {
  // Create a container for mysql.
  const mysql = new Container('mysql', 'mysql:5.6.32', {
    // Set SQL environment variables to initialize the root password and a
    // lobsters user.
    env: {
      MYSQL_ROOT_PASSWORD: sqlRootPassword,
    },
  });

  // Create a container for lobste.rs and configure it.
  const lobsters = new Container('lobsters', 'keldaio/lobsters', {
    // Set the DATABASE_URL environment variable, which is how rails determines which database
    // to connect to.
    env: {
      DATABASE_URL: `mysql2://root:${sqlRootPassword}@${
        mysql.getHostname()}:3306/lobsters`,
    },
  });

  // Allow inbound connections to SQL at 3306 (the default SQL port).
  mysql.allowFrom(lobsters, 3306);

  // Allow inbound connections to the lobsters UI.
  lobsters.allowFrom(publicInternet, 3000);

  // Deploy lobste.rs and mysql using the given deployment object.
  mysql.deploy(deployment);
  lobsters.deploy(deployment);
};
