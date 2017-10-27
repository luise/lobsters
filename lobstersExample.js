// This is an example of how to use the Lobsters spec to deploy
// Lobsters to a single Amazon instance.

const { Infrastructure, Machine } = require('kelda');
const lobsters = require('./lobsters.js');

const baseMachine = new Machine({ provider: 'Amazon' });

const infra = new Infrastructure(baseMachine, baseMachine);

// Deploy lobsters with "mysqlRootPassword" as the SQL root password.
// In the future, Kelda will have improved functionality for secrets.
// Currently, SQL is only accessible from other containers in the cluster,
// which limits the risk of this.
lobsters.deploy(infra, 'mysqlRootPassword');
