const client = require('../util/mongoClient');
const assert = require('assert');
const async = require('async');
const faker = require('faker');
const util = require('../util/util');
const config = require('../config');
const dbName = config.mongoDBName;

client.connect(function (err) {
    assert.equal(null, err);
    createXMLMockData();
});

const createXMLMockData = () => {

    async.parallel([
        function (callback) {
            createXMLMapping(callback);
        },
    ],
        function (err, results) {
            console.log("Inserted the mock data...");
            client.close();
        });

}

const createXMLMapping = (cb) => {
    const db = client.db(dbName);
    db.collection('XMLMapping').bulkWrite([
        {
            replaceOne: {
                filter: {
                    "xmlMapId": 1
                },
                replacement: {
                    "xmlMapId": 1,
                    "poNumber": [
                        "poNumber"
                    ],
                    "invoiceNumber": [
                        "invoiceNumber"
                    ],
                    "invoiceDate": [
                        "invoiceDate"
                    ],
                    "vendorName": [
                        "vendorName"
                    ],
                    "vendorAddress": [
                        "vendorAddress"
                    ],
                    "vendorPAN": [
                        "vendorPAN"
                    ],
                    "vendorGSTIN": [
                        "vendorGSTIN"
                    ],
                    "vendorEmail": [
                        "vendorEmail"
                    ],
                    "vendorBankName": [
                        "vendorBankName"
                    ],
                    "vendorBankSwiftCode": [
                        "vendorBankSwiftCode"
                    ],
                    "vendorBankAccountNo": [
                        "vendorBankAccountNo"
                    ],
                    "totalAmount": [
                        "totalAmount"
                    ],
                    "billingAddress": [
                        "billingAddress"
                    ],
                    "shippingAddress": [
                        "shippingAddress"
                    ],
                    "currency": [
                        "currency"
                    ],
                    "subTotal": [
                        "subTotal"
                    ],
                    "fxRate": [
                        "fxRate"
                    ],
                    "itemCode": [
                        "itemCode"
                    ],
                    "itemDescription": [
                        "itemDescription"
                    ],
                    "itemQuantity": [
                        "itemQuantity"
                    ],
                    "taxes": [
                        "taxes"
                    ],
                    "unitPrice": [
                        "unitPrice"
                    ],
                    "itemValue": [
                        "itemValue"
                    ],
                    "taxValue": [
                        "taxValue"
                    ],
                    "freightAmount": [
                        "freightAmount"
                    ],
                    "discountAmount": [
                        "discountAmount"
                    ],
                    "serviceStartDate": [
                        "serviceStartDate"
                    ],
                    "serviceEndDate": [
                        "serviceEndDate"
                    ],
                    "invoiceType": [
                        "invoiceType"
                    ],
                    "invoiceLanguage": [
                        "invoiceLanguage"
                    ],
                    "customerId": [
                        "customerId"
                    ],
                    "customerName": [
                        "customerName"
                    ],
                    "customerAddress": [
                        "customerAddress"
                    ],
                    "sortCode": [
                        "sortCode"
                    ],
                    "constantSymbol": [
                        "constantSymbol"
                    ],
                    "IBAN": [
                        "IBAN"
                    ],
                    "dueDate": [
                        "dueDate"
                    ],
                    "paymentTerms": [
                        "paymentTerms"
                    ],
                    "amountRoundoff": [
                        "amountRoundoff"
                    ],
                    "amountPaid": [
                        "amountPaid"
                    ],
                    "VATRate": [
                        "VATRate"
                    ],
                    "VATBase": [
                        "VATBase"
                    ],
                    "VATAmount": [
                        "VATAmount"
                    ],
                    "VATTotal": [
                        "VATTotal"
                    ],
                    "UOM": [
                        "UOM"
                    ],
                    "baseAmount": [
                        "baseAmount"
                    ],
                    "taxRate": [
                        "taxRate"
                    ],
                    "taxAmount": [
                        "taxAmount"
                    ],
                    "totalBase": [
                        "totalBase"
                    ],
                    "other": [
                        "other"
                    ]
                },
                upsert: true
            }
        }
    ], {
        upsert: true
    }, function (err, results) {
        assert.equal(null, err);
        cb(err, results);
    });
}
