const async = require('async');
const moment = require('moment');
const _ = require('lodash');
const config = require('../config');
const dbutil = require("../util/db");
const util = require("../util/util");
const db = dbutil.getDatabase(config.mongoDBName);

module.exports = runJob = (cb) => {
    // const docColl = db.collection("document_metadata");
    // const resultColl = db.collection("document_result");
    const tokenCollection = db.collection("tokens");
    // const analyticsMetadataColl = db.collection("document_analytics_metadata");
    async.waterfall(
        [
            function (callback) {
                tokenCollection.find({
                        $or: [util.getSearchQuery({
                            expiryDueOn: {
                                "<=": util.generateTimestamp()
                            }
                        }), {
                            disabled: false
                        }]
                    }

                ).toArray(function (err, docs) {
                    callback(err, docs)
                });
            },
            function (docs, callback) {
                let tokenIds = _.map(docs, 'tokenId')
                let tokenMap = _.chain(docs).keyBy('tokenId').value();
                tokenCollection.find({
                    tokenId: {
                        $in: tokenIds
                    }
                }).toArray(function (err, docResults) {
                    callback(err, tokenMap, docResults)
                });
            },
            function (tokenMap, docResults, callback) {
                // let docAnalytics = [];
                let tokenList = [];
                docResults.forEach(doc => {
                    let docNew = doc;
                    docNew.disabled = true
                    tokenList.push(docNew);
                });
                callback(null, tokenList);
            },
            function (docs, callback) {
                let operations = [];
                docs.forEach(doc => {
                    operations.push({
                        replaceOne: {
                            filter: {
                                tokenId: doc.tokenId
                            },
                            replacement: doc,
                            upsert: true
                        }
                    })
                })

                if (operations && operations.length) {
                    tokenCollection.bulkWrite(operations, {
                        upsert: true
                    }, function (err, r) {
                        callback(err, r);
                    });
                } else {
                    callback(null, {});
                }

            }
        ],
        function (err, result) {
            cb(err, result);
        }
    );
}