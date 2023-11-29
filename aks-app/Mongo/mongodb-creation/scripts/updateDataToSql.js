const async = require('async');
const { getDataTobeStored } = require("../util/shared");
const { selectQuery } = require("../util/sqlQueries");
const { sqlTables } = require("../util/sqlMappingData");

const bulkInsertForERRstatusDocuments = async (cb) => {
    console.log(`Entered in bulkInsertForERRstatusDocuments method at ${new Date().toUTCString()}`);

    try {
        async.waterfall([
            function (callback) {

                let documents = [];
                const tableName = sqlTables.metaData;
                const status = 'ERR';
                let WhereClause = `status='${status}'`;

                selectQuery(tableName, WhereClause).then((ifDataExists) => {
                    console.log(`From bulkInsertForERRstatusDocuments method Checking isDataExists for status -  ${status} in ${tableName}..at ${new Date().toUTCString()}`);

                    if (ifDataExists && ifDataExists.rows && ifDataExists.rows.length > 0) { //UPDATE
                        console.log(`Found ${ifDataExists.rows.length} documents for ${status} status in ${tableName}..at ${new Date().toUTCString()}`);
                        ifDataExists.rows.forEach(doc => {
                            documents.push(doc.document_id);
                        });
                    }
                    else {
                        console.log(`No Document Found in bulkInsertForERRstatusDocuments method for ${status} status in ${tableName}..at ${new Date().toUTCString()}`);
                        console.log(ifDataExists.rows);
                    }
                    callback(null, documents);
                }).catch((err) => {
                    console.log(`Error in bulkInsertForERRstatusDocuments method while checking whether data exists or not at ${new Date().toUTCString()}`);
                    console.log(err);
                    callback(err, null);
                });
            },
            function (documents, callback) {
                console.log(`From bulkInsertForERRstatusDocuments method Executing getDataTobeStored for ${documents.length} documents at ${new Date().toUTCString()}`);
                console.log(documents);

                if (documents && documents.length > 0) {
                    documents.forEach(doc => {
                        getDataTobeStored(doc);
                    });
                    callback(null, { message: "Data Stored successfully" })
                }
                else {
                    callback(null, {})
                }
            }
        ], function (err, result) {
            cb(err, result);
        });
    } catch (error) {
        console.log(`Got Error in bulkInsertForERRstatusDocuments method at ${new Date().toUTCString()}`);
        console.log(error);
        cb(error, null);
    } finally {
    }
}

module.exports = runJob = async (cb) => {
    await bulkInsertForERRstatusDocuments(cb);
}

