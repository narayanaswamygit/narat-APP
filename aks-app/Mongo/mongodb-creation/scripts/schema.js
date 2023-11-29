const dotenv = require('dotenv');
const result = dotenv.config({ path: '../.env' })

if (result.error) {
    console.log(result.error)
}
const client = require('../util/mongoClient');
const assert = require('assert');
const async = require('async');
const config = require('../config');
const dbName = config.mongoDBName;

client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server.");
    console.log("Creating the schemas and indexes...");
    createIndexes(function () {
        console.log("Schema and indexes created successfully.");
        client.close();
    })
});

const createIndexes = (cb) => {
    async.parallel([
        function (callback) {
            createDocumentMetadataIndexes(callback)
        },
        function (callback) {
            createVendorIndexes(callback)
        },
        function (callback) {
            createTemplateIndexes(callback)
        },
        function (callback) {
            createDocumentResultIndexes(callback)
        },
        function (callback) {
            createDocumentResultAuditIndexes(callback)
        },
        function (callback) {
            createDocumentAnalyticsMetadataIndexes(callback)
        },
        function (callback) {
            createDocumentStatsIndexes(callback)
        },
        function (callback) {
            createUsersIndexes(callback)
        },
        function (callback) {
            createTokenIndexes(callback)
        },
        function (callback) {
            createUserVendorMapIndexes(callback)
        },
        function (callback) {
            createXMLMappingIndexes(callback)
        },
        function (callback) {
            createRolesIndexes(callback)
        },
        function (callback) {
            createDashboardGraphIndexes(callback)
        }
    ], function (err, results) {
        assert.equal(null, err);
        cb();
    })
}

const createDocumentMetadataIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('document_metadata').createIndexes([{
        key: {
            documentId: 1
        },
        name: "docmeta_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('docmeta_unique_index', result);
        cb();
    });
}

const createVendorIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('vendor').createIndexes([{
        key: {
            vendorId: 1
        },
        name: "vendor_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('vendor_unique_index', result);
        cb();
    });
}

const createTemplateIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('template').createIndexes([{
        key: {
            templateId: 1
        },
        name: "tpl_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('tpl_unique_index', result);
        cb();
    });
}

const createDocumentResultIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('document_result').createIndexes([{
        key: {
            documentId: 1,
            resultId: 1
        },
        name: "dr_unique_index_1",
        unique: true
    },
    {
        key: {
            documentId: 1,
            processingEngine: 1
        },
        name: "docres_unique_index_2",
        unique: true
    }
    ], function (err, result) {
        assert.equal(null, err);
        console.log('docres_unique_index', result);
        cb();
    });
}

const createDocumentResultAuditIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('document_result_audit').createIndexes([{
        key: {
            documentId: 1,
            resultId: 1
        },
        name: "docresaudit_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('docresaudit_unique_index', result);
        cb();
    });
}

const createDocumentAnalyticsMetadataIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('document_analytics_metadata').createIndexes([{
        key: {
            documentId: 1
        },
        name: "docanalytis_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('docanalytis_unique_index', result);
        cb();
    });
}

const createDocumentStatsIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('document_stats').createIndexes([{
        key: {
            period: 1,
            vendorId: 1,
            templateId: 1
        },
        name: "docstats_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('document_stats', result);
        cb();
    });
}

const createUsersIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('users').createIndexes([{
        key: {
            userId: 1
        },
        name: "users_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('users_unique_index', result);
        cb();
    });
}

const createTokenIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('tokens').createIndexes([{
        key: {
            tokenId: 1
        },
        name: "token_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('token_unique_index', result);
        cb();
    });
}

const createUserVendorMapIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('UserVendorMap').createIndexes([{
        key: {
            mapId: 1
        },
        name: "userVendorMap_unique_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('userVendorMap_unique_index', result);
        cb();
    });
}

const createXMLMappingIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('XMLMapping').createIndexes([{
        key: {
            xmlMapId: 1
        },
        name: "XMLMapping_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('XMLMapping_index', result);
        cb();
    });
}

const createRolesIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('roles').createIndexes([{
        key: {
            role: 1
        },
        name: "roles_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('roles_index', result);
        cb();
    });
}

const createDashboardGraphIndexes = (cb) => {
    const db = client.db(dbName);
    db.collection('dashboard_graphs').createIndexes([{
        key: {
            chartId: 1
        },
        name: "dashboard_graphs_index",
        unique: true
    }], function (err, result) {
        assert.equal(null, err);
        console.log('dashboard_graphs_index', result);
        cb();
    });
}
