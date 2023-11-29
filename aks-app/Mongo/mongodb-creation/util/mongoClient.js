const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config');

// Connection URL
const url = config.mongoDBHost;
//const url = config.databaseUrl;

// Create a new MongoClient
const client = new MongoClient(
    url,
    { useUnifiedTopology: true },
    { useNewUrlParser: true },
    { connectTimeoutMS: 30000 },
    { keepAlive: 1 }
);

module.exports = client;