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
        const docColl = db.collection("document_metadata");
        const usersColl = db.collection("users");

        async.waterfall(
            [
                function (callback) {
                    let query = { $and: [{ status: "REVIEW" }, { ReviewerId: { $exists: false } }] };
                    let projection = { projection: { documentId: 1, vendorId: 1 } };

                    docColl.find(query, projection).toArray(function (err, docs) {
                        callback(err, docs)
                    });
                },
                function (docs, callback) {
                    let query = { $and: [{ role: "reviewer" }, { isActive: true }, { emailVerified: true }] };
                    let projection = { projection: { role: 1, userId: 1 } };

                    usersColl.find(query, projection).toArray(function (err, reviewers) {
                        callback(err, docs, reviewers)
                    });
                },
                function (docs, reviewers, callback) {
                    let totalDocs = docs && docs.length ? docs.length : 0;
                    let totalReviewers = reviewers && reviewers.length ? reviewers.length : 0;

                    if (totalDocs && totalReviewers) {

                        // let docsToBeDivide = Math.round(totalDocs / totalReviewers);
                        // let distributedDocs = getDividedDocs(docs, docsToBeDivide);
                        // reviewers.forEach((reviewer, i) => {
                        //     if (distributedDocs && distributedDocs.length) {
                        //         distributedDocs[i].forEach((element) => {
                        //             element["ReviewerId"] = reviewer.userId;
                        //         });
                        //     }
                        // });

                        docs.forEach((doc, index) => {
                            let modulas = index % totalReviewers;
                            reviewers = shuffle(reviewers);
                            doc["ReviewerId"] = reviewers[modulas].userId;
                        });
                    }

                    callback(null, docs);
                },
                function (docs, callback) {
                    if (docs && docs.length > 0) {
                        let operations = [];
                        docs.forEach(doc => {
                            operations.push({
                                updateOne: {
                                    filter: { documentId: doc.documentId },
                                    update: { $set: { "ReviewerId": doc.ReviewerId } },
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
        console.log(err.stack);
    } finally {
        // await client.close();
    }
}

module.exports = runJob = async (cb) => {
    await connectDatabase(cb);
}

const getDividedDocs = (docs, docsToBeDivide) => {

    var result = docs.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / docsToBeDivide)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])

    return result;
}

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}