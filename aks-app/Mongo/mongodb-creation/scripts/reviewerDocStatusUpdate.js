const async = require('async');
const moment = require('moment');
const _ = require('lodash');
const config = require('../config');
const client = require("../util/mongoClient");

const dbutil = require("../util/db");
const db = dbutil.getDatabase(config.mongoDBName);

const connectDatabase = async (cb) => {
    try {
        await client.connect();
        console.log("Database connected with in reviewerDocStatus :- " + db.databaseName);

        db && db.listCollections().toArray(function (err, collInfos) {
            if (collInfos && collInfos.length > 0) {
                let collections;
                collInfos.filter((coll) => {
                    collections = collections ? collections + "," + coll.name : coll.name;
                })
                console.log('Total Available collections in the db are:- ' + collInfos.length);
                console.log(collections);
            }
            else {
                console.log("No collections found in db");
            }
        });

        const docColl = db.collection("document_metadata");

        docColl && docColl.countDocuments({}, function (error, numOfDocs) {
            console.log(numOfDocs + ' documents in document_metadata present');
        });

        async.waterfall(
            [
                function (callback) {
                    let query = { document_review_status: "UNDER REVIEW" };
                    let projection = { projection: { documentId: 1, lastUpdatedOn: 1 } };
                    let unlockTime = config.AUTO_UNLOCK_DOCUMENT_IN;
                    console.log("Unlock those docs which are in UnderReview status from more than:-" + unlockTime + "mins");

                    docColl.find(query, projection).toArray(function (err, docs) {
                        console.log("UnderReview docs found in ReviewerCronJob from query is:- " + docs.length);

                        docs = docs.filter((doc) => {
                            var diff = new Date() - doc.lastUpdatedOn; // this is a time in milliseconds
                            var diff_as_date = diff / (1000 * 60); // this is time in mins
                            if (diff_as_date > unlockTime) {
                                console.log("Documents Unlocked.");
                                return doc;
                            }
                        })
                        callback(null, docs)
                    });
                },
                function (docs, callback) {
                    if (docs && docs.length > 0) {
                        console.log("!!! HURRAY !!! " + docs.length + " documents were unlocked at " + new Date());
                        let operations = [];
                        docs.forEach(doc => {
                            operations.push({
                                updateOne: {
                                    filter: { documentId: doc.documentId },
                                    update: { $set: { "document_review_status": 'REVIEW_CANCELED' } },
                                    upsert: true
                                }
                            })
                        })

                        docColl.bulkWrite(operations, { upsert: true }, function (err, r) {
                            callback(err, r);
                        });
                    }
                    else {
                        callback(null, docs);
                    }
                }
            ],
            function (err, result) {
                cb(err, result);
            }
        );
    } catch (err) {
        console.log("Error occured in reviewerDocStatusUpdate.js");
        console.log(err);
    } finally {
        // await client.close();
    }
}

module.exports = runJob = async (cb) => {
    await connectDatabase(cb);
}

