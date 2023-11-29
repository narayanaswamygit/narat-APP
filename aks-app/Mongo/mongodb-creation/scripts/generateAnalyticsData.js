const async = require('async');
const moment = require('moment');
const _ = require('lodash');
const config = require('../config');
const client = require("../util/mongoClient");
const dbutil = require("../util/db");
const db = dbutil.getDatabase(config.mongoDBName);

module.exports = runJob = (cb) => {
    console.log("Database connected from generateAnalyticsJob is :- " + db.databaseName);
    const docColl = db.collection("document_metadata");
    const resultColl = db.collection("document_result");
    const analyticsMetadataColl = db.collection("document_analytics_metadata");

    async.waterfall(
        [
            function(callback) {
                docColl.find({ status: { $in: ['REVIEW', 'PROCESSED', 'REVIEW_COMPLETED'] } }).toArray(function(err, docs) {
                    callback(err, docs)
                });
            },
            function(docs, callback) {

                let docIds = _.map(docs, 'documentId');
                let docsMap = _.chain(docs).keyBy('documentId').value();
                resultColl.find({ documentId: { $in: docIds } }).toArray(function(err, docResults) {
                    callback(err, docsMap, docResults)
                });
            },
            function(docsMap, docResults, callback) {
                let docAnalytics = [];
                docResults.forEach(doc => {
                    let fieldCount = 0;
                    let correctedCount = 0;
                    let accuracy = 0;
                    let manuallyCorrected = false;
                    let manualIntervention = false;
                    fieldCount += doc.documentInfo.length;
                    correctedCount += _.remove(_.map(doc.documentInfo, 'correctedValue'), function(n) { return n }).length;
                    
                    doc.documentLineItems.forEach(lineItem => {
                        fieldCount += lineItem.fieldset.length;
                        correctedCount += _.remove(_.map(lineItem.fieldset, 'correctedValue'), function(n) { return n }).length;
                    })
                    if (fieldCount == 0) {
                        accuracy = -1;
                    } else {
                        accuracy = ((fieldCount - correctedCount) / fieldCount) * 100;
                        if (correctedCount > 0) // commented gaurav
                            manuallyCorrected = true;
                    }
                    const originalDoc = docsMap[doc.documentId];
                    if (manuallyCorrected || originalDoc.manualRPAProcessing) {
                        manualIntervention = true;
                    }

                    docAnalytics.push({
                        documentId: doc.documentId,
                        fieldCount: fieldCount,
                        correctedFieldCount: correctedCount,
                        extractionAccuracy: accuracy,
                        manuallyCorrected: manuallyCorrected,
                        manualRPAProcessing: originalDoc.manualRPAProcessing,
                        manualIntervention: manualIntervention,
                        submittedPeriod: parseInt(moment(originalDoc.createdOn).format('YYYYMMDD')),
                        lastUpdatedPeriod: parseInt(moment(originalDoc.lastUpdatedOn).format('YYYYMMDD')),
                        lastReviewedPeriod: parseInt(moment(originalDoc.lastReviewedOn).format('YYYYMMDD')),
                        lastProcessedPeriod: parseInt(moment(originalDoc.lastProcessedOn).format('YYYYMMDD')),
                        vendorId: originalDoc.vendorId,
                        docTypeId: originalDoc.docTypeId,
                        orgTypeId: originalDoc.orgTypeId,
                        templateId: originalDoc.templateId,
                        status: originalDoc.status,
                        userId: originalDoc.userId,
                        pageCount: parseInt(originalDoc.pageCount)
                    })
                });
                callback(null, docAnalytics);
            },
            function(docs, callback) {
                let operations = [];
                docs.forEach(doc => {
                    operations.push({
                        replaceOne: {
                            filter: { documentId: doc.documentId },
                            replacement: doc,
                            upsert: true
                        }
                    })
                })

                analyticsMetadataColl.bulkWrite(operations, { upsert: true }, function(err, r) {
                    callback(err, r);
                });
            }
        ],
        function(err, result) {
            cb(err, result);
        }
    );
}