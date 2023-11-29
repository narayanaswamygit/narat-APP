const dotenv = require('dotenv');
const result = dotenv.config({ path: '../.env' })

if (result.error) {
    console.log(result.error)
}

const client = require('../util/mongoClient');
const assert = require('assert');
const async = require('async');
const util = require('../util/util');
const config = require('../config');
const crypto = require('crypto-js');
const sharedService = require("../services/sharedService");
const moment = require('moment');
const uuid = require('uuid');
const dbName = config.mongoDBName;

client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    createMockData();
});

let adminId = 'admin';

const createMockData = () => {

    async.parallel([
        // function (callback) {
        //     createMockDocuments(callback);
        // },
        // function (callback) {
        //     createMockVendors(callback);
        // },
        // function (callback) {
        //     createMockTemplates(callback);
        // },
        // function (callback) {
        //     createMockDocumentResult(callback);
        // },
        function (callback) {
            createMockUser(callback);
        },
        // function (callback) {
        //     createMockToken(callback);
        // },
        function (callback) {
            createRolesData(callback);
        },
        function (callback) {
            createMockGraphData(callback);
        }
    ],
        function (err, results) {
            if (results) {
                let filter = { role: 'admin' }
                const db = client.db(dbName);
                db.collection('users').findOneAndUpdate(
                    filter, {
                    $set: { role: adminId.toString() }
                }, {
                    upsert: false,
                    returnOriginal: false
                },
                    function (err, doc) {
                        if (err) {
                            console.log("Could not updated the admin user's role");
                            console.log(err);
                        }
                        if (!doc) {
                            console.log("Could not updated the admin user's role");
                            console.log(doc);
                        }
                        console.log("Updated admin user's role sucessfully.");
                    }
                );
                console.log("Inserted mock data successfully.");
            }
            else {
                console.error("Unable to insert the mock data.." + err);
            }
            client.close();
        });
}

// const createMockDocuments = (cb) => {
//     const db = client.db(dbName);
//     db.collection('document_metadata').bulkWrite([{
//         replaceOne: {
//             filter: {
//                 documentId: "doc123"
//             },
//             replacement: {
//                 documentId: "doc123",
//                 templateId: "1",
//                 vendorId: "1",
//                 name: "Invoice 1",
//                 fileName: "inv_1.pdf",
//                 documentType: "Invoice",
//                 pages: [{
//                     id: 1,
//                     url: "/doc123/1.jpg"
//                 }, {
//                     id: 2,
//                     url: "/doc123/2.jpg"
//                 }],
//                 status: "NEW",
//                 submittedOn: util.generateTimestamp(),
//                 submittedBy: "user1",
//                 recordType: "mock"
//             },
//             upsert: true
//         }
//     },
//     {
//         replaceOne: {
//             filter: {
//                 documentId: "doc124"
//             },
//             replacement: {
//                 documentId: "doc124",
//                 templateId: "2",
//                 vendorId: "2",
//                 name: "Invoice 2",
//                 fileName: "inv_2.pdf",
//                 documentType: "Invoice",
//                 pages: [{
//                     id: 1,
//                     url: "/doc124/1.jpg"
//                 }, {
//                     id: 2,
//                     url: "/doc124/2.jpg"
//                 }],
//                 status: "PROCESSING",
//                 submittedOn: util.generateTimestamp(),
//                 submittedBy: "user1",
//                 recordType: "mock"
//             },
//             upsert: true
//         }
//     }
//     ], {
//         upsert: true
//     }, function (err, r) {
//         assert.equal(null, err);
//         cb();
//     });
// }

// const createMockVendors = (cb) => {
//     const db = client.db(dbName);
//     db.collection('vendor').bulkWrite([{
//         replaceOne: {
//             filter: {
//                 vendorId: "1"
//             },
//             replacement: {
//                 vendorId: "1",
//                 name: faker.company.companyName(),
//                 address: faker.fake("{{address.streetAddress}}, {{address.streetName}}, {{address.city}}, {{address.state}}, {{address.country}}"),
//                 logo: faker.image.business(),
//                 currency: faker.fake("{{finance.currencyCode}} ({{finance.currencySymbol}})"),
//                 recordType: "mock"
//             },
//             upsert: true
//         }
//     },
//     {
//         replaceOne: {
//             filter: {
//                 vendorId: "2"
//             },
//             replacement: {
//                 vendorId: "2",
//                 name: faker.company.companyName(),
//                 address: faker.fake("{{address.streetAddress}}, {{address.streetName}}, {{address.city}}, {{address.state}}, {{address.country}}"),
//                 logo: faker.image.business(),
//                 currency: faker.fake("{{finance.currencyCode}} ({{finance.currencySymbol}})"),
//                 recordType: "mock"
//             },
//             upsert: true
//         }
//     }
//     ], function (err, r) {
//         assert.equal(null, err);
//         cb();
//     });
// }

// const createMockTemplates = (cb) => {
//     const db = client.db("Tao");
//     db.collection('template').bulkWrite([{
//         replaceOne: {
//             filter: {
//                 templateId: "template1"
//             },
//             replacement: {
//                 templateId: "template1",
//                 documentInfoFields: [{
//                     id: "Info1",
//                     label: "",
//                     index: 1
//                 }],
//                 documentLineItems: [{
//                     id: "Item1",
//                     label: "",
//                     index: 1
//                 }],
//                 createdOn: "",
//                 "lastUpdatedOn": ""
//             },
//             upsert: true
//         }
//     },
//     {
//         replaceOne: {
//             filter: {
//                 templateId: "template2"
//             },
//             replacement: {
//                 templateId: "template2",
//                 documentInfoFields: [{
//                     id: "Info1",
//                     label: "",
//                     index: 1
//                 }],
//                 documentLineItems: [{
//                     id: "Item1",
//                     label: "",
//                     index: 1
//                 }],
//                 createdOn: "",
//                 "lastUpdatedOn": ""
//             },
//             upsert: true
//         }
//     }
//     ], {
//         upsert: true
//     }, function (err, r) {
//         assert.equal(null, err);
//         cb();
//     });
// }

// const createMockDocumentResult = (cb) => {
//     const db = client.db("Tao");
//     db.collection('document_result').bulkWrite([
//         { replaceOne: { filter: { documentId: "result1" }, replacement: { documentId: "result1", documentId: "doc123", templateId: "template1", resultFile: "", rawResultData: "", processingEngine: "ABBYY", documentInfo: { fieldId: "DocInfo1", fieldValue: "", confidence: "double", boundingBox: "", pageNumber: 1, correctedValue: "", correctedOn: new Date(), correctedBy: "user1" }, documentLineItems: { pageNumber: 1, rowNumber: 1, fieldset: [{ fieldId: "Field1", fieldValue: "", confidence: "double", boundingBox: "", correctedValue: "", correctedOn: new Date(), correctedBy: "user1" }] } }, upsert: true } },
//         { replaceOne: { filter: { documentId: "result2" }, replacement: { documentId: "result2", documentId: "doc124", templateId: "template2", resultFile: "", rawResultData: "", processingEngine: "ABBYY", documentInfo: { fieldId: "DocInfo1", fieldValue: "", confidence: "double", boundingBox: "", pageNumber: 1, correctedValue: "", correctedOn: new Date(), correctedBy: "user1" }, documentLineItems: { pageNumber: 1, rowNumber: 1, fieldset: [{ fieldId: "Field1", fieldValue: "", confidence: "double", boundingBox: "", correctedValue: "", correctedOn: new Date(), correctedBy: "user1" }] } }, upsert: true } }
//     ], { upsert: true }, function (err, r) {
//         assert.equal(null, err);
//         cb();
//     });
// }

const createMockTemplates = (cb) => {
    const db = client.db(dbName);
    db.collection('template').bulkWrite([{
        replaceOne: {
            filter: {
                templateId: "1"
            },
            replacement: {
                templateId: "1",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                },
                {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }
                ]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "2"
            },
            replacement: {
                templateId: "2",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                }, {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "3"
            },
            replacement: {
                templateId: "3",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                }, {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "4"
            },
            replacement: {
                templateId: "4",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                }, {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "5"
            },
            replacement: {
                templateId: "5",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                }, {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "-1"
            },
            replacement: {
                templateId: "-1",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                }, {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "6"
            },
            replacement: {
                templateId: "6",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                }, {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "7"
            },
            replacement: {
                templateId: "7",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                },
                {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }
                ]
            },
            upsert: true
        }
    },
    {
        replaceOne: {
            filter: {
                templateId: "8"
            },
            replacement: {
                templateId: "8",
                "documentInfoFields": [{
                    "id": "poNumber",
                    "label": "PO Number",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "poNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceNumber",
                    "label": "Invoice Number",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceNumber",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceDate",
                    "label": "Invoice Date",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorName",
                    "label": "Vendor Name",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorAddress",
                    "label": "Vendor Address",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorPAN",
                    "label": "Vendor Pan",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorPAN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorGSTIN",
                    "label": "Vendor GSTIN",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorGSTIN",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorEmail",
                    "label": "Vendor Email Address",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendoremailAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankName",
                    "label": "Vendor Bank Name",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankSwiftCode",
                    "label": "Vendor bank SWIFT code",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendorBankSwiftCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "vendorBankAccountNo",
                    "label": "Vendor bank ac No",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vendor bank ac No",
                    "format": {},
                    "group": ""
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "billingAddress",
                    "label": "Bill to Address",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "billToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "shippingAddress",
                    "label": "Ship To Address",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "shipToAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "currency",
                    "label": "Currency",
                    "index": 15,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "currency",
                    "format": {},
                    "group": ""
                }, {
                    "id": "subTotal",
                    "label": "Subtotal ",
                    "index": 16,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "subtotal",
                    "format": {},
                    "group": ""
                }, {
                    "id": "fxRate",
                    "label": "Fx Rate ",
                    "index": 17,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "fxRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 18,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "itemquantity",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxes",
                    "label": "Taxes (CGST,IGST,SGST)",
                    "index": 19,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxes",
                    "format": {},
                    "group": ""
                }, {
                    "id": "taxValue",
                    "label": "Tax Value",
                    "index": 20,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "taxValue",
                    "format": {},
                    "group": ""
                }, {
                    "id": "freightAmount",
                    "label": "Freight Amount",
                    "index": 21,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "freightAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "discountAmount",
                    "label": "Discount Amount",
                    "index": 22,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "discountAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceType",
                    "label": "Invoice Type",
                    "index": 23,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceType",
                    "format": {},
                    "group": ""
                }, {
                    "id": "invoiceLanguage",
                    "label": "Invoice Language",
                    "index": 24,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "invoiceLanguage",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerId",
                    "label": "Customer ID",
                    "index": 25,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerID",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerName",
                    "label": "Customer Name",
                    "index": 26,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerName",
                    "format": {},
                    "group": ""
                }, {
                    "id": "customerAddress",
                    "label": "Customer Address",
                    "index": 27,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "customerAddress",
                    "format": {},
                    "group": ""
                }, {
                    "id": "sortCode",
                    "label": "Sort Code",
                    "index": 28,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "sortCode",
                    "format": {},
                    "group": ""
                }, {
                    "id": "constantSymbol",
                    "label": "Constant Symbol",
                    "index": 29,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "constantSymbol",
                    "format": {},
                    "group": ""
                }, {
                    "id": "IBAN",
                    "label": "IBAN",
                    "index": 30,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "iban",
                    "format": {},
                    "group": ""
                }, {
                    "id": "dueDate",
                    "label": "Due Date",
                    "index": 31,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "dueDate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "paymentTerms",
                    "label": "Payment Terms",
                    "index": 32,
                    "type": "String",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "paymentTerms",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountRoundoff",
                    "label": "Amount Rounding",
                    "index": 33,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountRounding",
                    "format": {},
                    "group": ""
                }, {
                    "id": "amountPaid",
                    "label": "Amount Paid",
                    "index": 34,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "amountPaid",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATRate",
                    "label": "VAT Rate",
                    "index": 35,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatRate",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATBase",
                    "label": "VAT Base",
                    "index": 36,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatBase",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 37,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatAmount",
                    "format": {},
                    "group": ""
                }, {
                    "id": "VATTotal",
                    "label": "VAT Total",
                    "index": 38,
                    "type": "Number",
                    "className": "",
                    "displaySpan": 4,
                    "display": true,
                    "mappingId": "vatTotal",
                    "format": {},
                    "group": ""
                }],
                "documentLineItems": [{
                    "id": "itemCode",
                    "label": "Item Code",
                    "index": 1,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemCode",
                    "format": {}
                }, {
                    "id": "itemDescription",
                    "label": "Item Description",
                    "index": 2,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemDescription",
                    "format": {}
                }, {
                    "id": "itemQuantity",
                    "label": "Item Quantity",
                    "index": 3,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "itemQuantity",
                    "format": {}
                }, {
                    "id": "unitPrice",
                    "label": "Item Price",
                    "index": 4,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "unitPrice",
                    "format": {}
                }, {
                    "id": "itemValue",
                    "label": "Value Of Service or a Product",
                    "index": 5,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "valueOfaServiceOraProduct",
                    "format": {}
                }, {
                    "id": "serviceStartDate",
                    "label": "Service Start Date",
                    "index": 6,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "serviceStartDate",
                    "format": {}
                }, {
                    "id": "UOM",
                    "label": "UOM",
                    "index": 7,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "uom",
                    "format": {}
                }, {
                    "id": "baseAmount",
                    "label": "Amount Base",
                    "index": 8,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "baseAmount",
                    "format": {}
                }, {
                    "id": "taxRate",
                    "label": "Line Item Tax Rate",
                    "index": 9,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxRate",
                    "format": {}
                }, {
                    "id": "taxAmount",
                    "label": "Line Item Tax Amount",
                    "index": 10,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "taxAmount",
                    "format": {}
                }, {
                    "id": "totalBase",
                    "label": "Total BAse",
                    "index": 11,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalBase",
                    "format": {}
                }, {
                    "id": "VATAmount",
                    "label": "VAT Amount",
                    "index": 12,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "VATAmount",
                    "format": {}
                }, {
                    "id": "totalAmount",
                    "label": "Total Amount",
                    "index": 13,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "totalAmount",
                    "format": {}
                },
                {
                    "id": "other",
                    "label": "Other",
                    "index": 14,
                    "type": "String",
                    "className": "",
                    "numericFormat": {
                        "culture": "en-US"
                    },
                    "display": true,
                    "mappingId": "other",
                    "format": {}
                }
                ]
            },
            upsert: true
        }
    },
    ], {
        upsert: true
    }, function (err, r) {
        assert.equal(null, err);
        cb();
    });
}

const createMockVendors = (cb) => {
    const db = client.db(dbName);
    db.collection('vendor').bulkWrite([
        {
            replaceOne: {
                filter: {
                    vendorId: "1"
                },
                replacement: {
                    vendorId: "1",
                    "name": "Nexus",
                    "address": "Nexus Vehicle Management Limited, Nexus House, 2 Owlcotes Court, 141 Richardshaw Lane, Leeds, LS28 6AAishna Reddy Industrial Area, Garebhavipalya, Singasandra, Bengaluru, Karnataka 560068",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/nexus.jpg",
                    "currency": "GBP",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "VendorAddress": "vendorAddress",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "InvoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "VAT": "VATBase",
                        "Net": "baseAmount",
                        "Desc": "itemDescription",
                        "TotalVATInc": "VATAmount"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "2"
                },
                replacement: {
                    vendorId: "2",
                    "name": "Alphabet",
                    "address": "Alphabet (GB) Limited, Alphabet House, Summit Avenue, Farnborough, Hampshire, GU14 0FB",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/alphabet.jpg",
                    "currency": "GBP",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "InvoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "VAT": "VATBase",
                        "Net": "baseAmount",
                        "Desc": "itemDescription",
                        "TotalVATInc": "VATAmount"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "3"
                },
                replacement: {
                    vendorId: "3",
                    "name": "Krones UK Ltd",
                    "address": "Westregen House, Great Bank Road, Wingates Industrial Park, Westhoughton, Bolton BL5 3XB",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/krones.jpg",
                    "currency": "GBP",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "VendorAddress": "vendorAddress",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "InvoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "Desc": "itemDescription",
                        "TotalVATInc": "VATAmount",
                        "Units": "itemQuantity"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "4"
                },
                replacement: {
                    vendorId: "4",
                    "name": "Guidant Group Inc",
                    "address": "800, the Boulevard, Capability Green, Luton, LU1 3BA",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/guidant-group.png",
                    "currency": "GBP",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "VendorAddress": "vendorAddress",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "InvoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "VAT": "VATBase",
                        "Net": "baseAmount",
                        "Desc": "itemDescription",
                        "TotalVATInc": "VATAmount",
                        "TotalCharge": "subTotal",
                        "Department": "other",
                        "PONumber": "poNumber",
                        "CandidateName": "customerName",
                        "WeekEnding": "other",
                        "refID": "other",
                        "Units": "itemQuantity",
                        "unitprice": "unitPrice"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "5"
                },
                replacement: {
                    vendorId: "5",
                    "name": "Robert Guy Services Limited",
                    "address": "Robert Guy Services Limited, 54-62 Raymouth Road, London, SE16 2DB",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/robertguy.png",
                    "currency": "GBP",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "VendorAddress": "vendorAddress",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "InvoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "PONumber": "poNumber",
                        "Desc": "itemDescription",
                        "TotalVATInc": "VATAmount",
                        "PONumber": "poNumber",
                        "CandidateName": "customerName",
                        "QTY": "itemQuantity"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "6"
                },
                replacement: {
                    vendorId: "6",
                    "name": "John Grant Haulage Ltd.",
                    "address": "2111 Lakeshrore Rd. W. Mississauga, ON L5J 1J9",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/john-grant-haulage.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "7"
                },
                replacement: {
                    vendorId: "7",
                    "name": "Aramco Chemicals Company",
                    "address": "North Park 3, building no. 3302, Ground Floor, Wing A, P.O.Box 5000 Dhahran 31311, Kingdom of Saudi Arabia",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/aramco.jpg",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "VendorAddress": "vendorAddress",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "invoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "PONumber": "poNumber",
                        "TaxValue": "taxValue",
                        "Netamount": "baseAmount",
                        "Description": "itemDescription",
                        "Quantity": "itemQuantity",
                        "UnitPrice": "unitPrice",
                        "BillName": "customerName",
                        "NetAmount": "itemValue"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "8"
                },
                replacement: {
                    vendorId: "8",
                    "name": "LyondellBasell",
                    "address": "EQUISTAR CHEMICALS, L.P., JPMORGAN CHASE, ELECTRONIC FUNDS ONLY,NEW YORK, NY  10017-2014,ABA #021000021,SWIFT: CHASUS33,ACCT # 964256713",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/lyondell-basell.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {
                        "VendorName": "vendorName",
                        "VendorAddress": "vendorAddress",
                        "BillToAddress": "billingAddress",
                        "InvoiceNumber": "invoiceNumber",
                        "InvoiceDate": "invoiceDate",
                        "Total": "totalAmount",
                        "PONumber": "poNumber",
                        "TaxValue": "taxValue",
                        "Netamount": "baseAmount",
                        "Description": "itemDescription",
                        "Quantity": "itemQuantity",
                        "UnitPrice": "unitPrice",
                        "ItemID": "itemCode",
                        "BillName": "customerName",
                        "NetAmount": "itemValue"
                    },
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "9"
                },
                replacement: {
                    vendorId: "9",
                    "name": "KEY TRONIC CORPORATION",
                    "address": "WELLS FARGO BANK P.O. BOX 201473 DALLAS, TX  75320-1473",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/keytronics.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "10"
                },
                replacement: {
                    vendorId: "10",
                    "name": "BCM Advanced Research",
                    "address": "11 Chrysler Irvine, CA 92618 (949) 470-1888",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/bcm-advance-research.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "11"
                },
                replacement: {
                    vendorId: "11",
                    "name": "CDW Direct",
                    "address": "PO Box 75723 Chicago, IL 60675-5723",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/cdw.jpg",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "12"
                },
                replacement: {
                    vendorId: "12",
                    "name": "China Traderite Company Limited",
                    "address": "Room A, 8/F, Success Commercial Building, 245-251 Hennessy Road Wanchai, Hong Kong",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/china-traderite-company.png",
                    "currency": "HKD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "13"
                },
                replacement: {
                    vendorId: "13",
                    "name": "GARY PLATT MANUFACTURING",
                    "address": "4643 AIRCENTER CIRCLE RENO NV 89502-5948",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/gary-platt.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "14"
                },
                replacement: {
                    vendorId: "14",
                    "name": "GLM Cabinets, Inc.",
                    "address": "5325 S. Valley View, #3, Las Vegas, Nevada 89118",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/glm-cabinets.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "15"
                },
                replacement: {
                    vendorId: "15",
                    "name": "JCS Technologies",
                    "address": "6255 South Sandhill Road, Suite 1100 Las Vegas, NV 89120",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/jcs-technologies.jpg",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "16"
                },
                replacement: {
                    vendorId: "16",
                    "name": "R.L. Tool, Inc.",
                    "address": "10525 Florida Avenue South Suite 111 Bloomington, MN  55438 United States of America",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/r-l-tool.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "17"
                },
                replacement: {
                    vendorId: "17",
                    "name": "SIGMATRON International, Inc.",
                    "address": "2201 Landmeier Road Elk Grove Village, IL 60007, USA",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/sigmatron.jpg",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "18"
                },
                replacement: {
                    vendorId: "18",
                    "name": "SMS INDUSTRIES, LLC",
                    "address": "Las Vegas, NV 89120 6340 S. Sandhill Road",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/sms-industries.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "19"
                },
                replacement: {
                    vendorId: "19",
                    "name": "Super Color Digital, LLC",
                    "address": "3451 W Martin Ave Las Vegas, NV 89118",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/supercolor.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    vendorId: "20"
                },
                replacement: {
                    vendorId: "20",
                    "name": "Yellowfish Graphics",
                    "address": "5075 W Diablo Dr Las Vegas, NV 89118",
                    "logo": "https://tapp2data.blob.core.windows.net/assets/yellowfish.png",
                    "currency": "USD",
                    "firstInvoiceDate": "",
                    "lastInvoiceDate": "",
                    "lastInvoiceSubmittedOn": "",
                    "lastInvoiceProcessedOn": "",
                    "avgValuePerQuarter": "",
                    "avgInvoicesPerQuarter": "",
                    "xmlMapping": {},
                    createdOn: util.generateTimestamp(),
                    lastUpdatedOn: util.generateTimestamp(),
                    updatedBy: "system"
                },
                upsert: true
            }
        },
    ], {
        upsert: true
    }, function (err, results) {
        assert.equal(null, err);
        cb(err, results);
    });
}

const createMockUser = (cb) => {
    const db = client.db(dbName);
    db.collection('users').bulkWrite([{
        replaceOne: {
            filter: {
                userId: 1
            },
            replacement: {
                userId: uuid.v4(),
                role: "admin",
                userName: sharedService.encrypt("admin"),
                emailId: sharedService.encrypt("admin@anything.com"),
                userdomain: sharedService.encrypt("anything.com"),
                password: crypto.SHA256('Admin@1234').toString(),
                verificationToken: uuid.v4(),
                emailVerified: true,
                isActive: true,
                createdOn: util.generateTimestamp(),
                lastLogin: util.generateTimestamp()
            },
            upsert: true
        }
    }
    ], {
        upsert: true
    }, function (err, r) {
        assert.equal(null, err);
        cb();
    })
}

const createMockToken = (cb) => {
    const db = client.db(dbName);
    db.collection('tokens').bulkWrite([{
        replaceOne: {
            filter: {
                tokenId: '100b1fdb7b9d4198a28c89c441cb7e80'
            },
            replacement: {
                tokenId: '100b1fdb7b9d4198a28c89c441cb7e80',
                token: uuid.v4(),
                userId: '100b1fdb7b9d4198a28c89c441cb7e80',
                role: 'admin',
                createdOn: util.generateTimestamp(),
                expiryDueOn: util.generateTimestamp(moment(util.generateTimestamp()).add(2, 'hours').toDate()),
                disabled: false
            },
            upsert: true
        }
    }], {
        upsert: true
    }, function (err, r) {
        assert.equal(null, err);
        cb();
    })
}

const createRolesData = (cb) => {
    const db = client.db(dbName);
    db.collection('roles').bulkWrite([
        {
            replaceOne: {
                filter: {
                    role: "admin"
                },
                replacement: {
                    role: "admin",
                    RoutesAccess: [
                        "dashboard",
                        "processing",
                        "profile",
                        "users",
                        "settings",
                        "ready-for-review",
                        "faq",
                        "login",
                        "signup",
                        "forgot-password",
                        "extraction-assist",
                        "extraction-assitance"
                    ],
                    createdOn: util.generateTimestamp(),
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    role: "clientadmin"
                },
                replacement: {
                    role: "clientadmin",
                    RoutesAccess: [
                        "processing",
                        "profile",
                        "users",
                        "settings",
                        "ready-for-review",
                        "login",
                        "forgot-password",
                        "extraction-assist",
                        "extraction-assitance"
                    ],
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    role: "viewer"
                },
                replacement: {
                    role: "viewer",
                    RoutesAccess: [
                        "processing",
                        "profile",
                        "ready-for-review",
                        "invoice-form",
                        "signup",
                        "accuracy-invoice-process",
                        "vendor-name"
                    ],
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    role: "reviewer"
                },
                replacement: {
                    role: "reviewer",
                    RoutesAccess: [
                        "processing",
                        "profile",
                        "ready-for-review",
                        "login",
                        "forgot-password",
                        "invoice-form",
                        "accuracy-invoice-process",
                        "vendor-name"
                    ],
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    role: "approver"
                },
                replacement: {
                    role: "approver",
                    RoutesAccess: [
                        "processing",
                        "profile",
                        "ready-for-review",
                        "login",
                        "forgot-password",
                        "invoice-form",
                        "accuracy-invoice-process",
                        "vendor-name"
                    ],
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    role: "bot"
                },
                replacement: {
                    role: "bot",
                    RoutesAccess: [
                        "processing",
                        "profile",
                        "ready-for-review",
                        "login",
                        "forgot-password",
                        "invoice-form",
                        "accuracy-invoice-process",
                        "vendor-name"
                    ],
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        }
    ], {
        upsert: true
    }, function (err, r) {
        assert.equal(null, err);
        if (r != undefined && r.upsertedIds && Object.keys(r.upsertedIds).length > 0) {
            console.log(r.upsertedIds);
            adminId = r.upsertedIds['0'];
            console.log("Admin Role Id is :- " + adminId);
        }
        cb();
    });
}

const createMockGraphData = (cb) => {
    const db = client.db(dbName);
    db.collection('dashboard_graphs').bulkWrite([
        {
            replaceOne: {
                filter: {
                    chartId: "document_count_by_exception"
                },
                replacement: {
                    "index": 2,
                    "chartId": "document_count_by_exception",
                    "type": "doughnut",
                    "name": "Document Count by Exception",
                    "colSpan": 1,
                    "enabled": true,
                    "defaultData": {
                        "labels": ["MANDATORY FIELD MISSING", "ERROR IN INVOICE", "OTHERS"],
                        "datasets": [
                            {
                                "label": "Document Count by Exception",
                                "data": [300, 50, 100],
                                "backgroundColor": ["rgb(255, 99, 132,0.6)", "rgb(54, 162, 235,0.6)", "rgb(255, 205, 86,0.6)"]
                            }
                        ]
                    },
                    "chartTab": "POSTING",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp(),
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "document_count_by_date_posting_status"
                },
                replacement: {
                    "index": 1,
                    "chartId": "document_count_by_date_posting_status",
                    "xAxisLabel": "Date",
                    "yAxisLabel": "Document Count",
                    "type": "bar",
                    "name": "Document Count by Date",
                    "colSpan": 2,
                    "enabled": true,
                    "defaultData": {
                        "labels": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        "datasets": [
                            {
                                "label": "Total Document Count",
                                "data": [220, 160, 120, 200, 300, 125, 323, 345, 190, 155],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(232, 218, 239, 0.8)",
                                "borderColor": "#7D3C98"
                            },
                            {
                                "label": "Review Completed Documents",
                                "data": [120, 120, 80, 190, 110, 100, 200, 231, 150, 120],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(236, 112, 99,0.8)",
                                "borderColor": "#D4AC0D"
                            }
                        ]
                    },
                    "chartTab": "POSTING",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "scatterChart"
                },
                replacement: {
                    "index": 6,
                    "chartId": "scatterChart",
                    "type": "scatter",
                    "xAxisLabel": "Month",
                    "yAxisLabel": "Accuracy",
                    "name": "Accuracy By Month",
                    "colSpan": 1,
                    "enabled": false,
                    "defaultData": {
                        "datasets": [
                            {
                                "label": "Accuracy",
                                "data": [
                                    { "x": 1, "y": 85 },
                                    { "x": 2, "y": 92.5 },
                                    { "x": 3, "y": 87 },
                                    { "x": 4, "y": 78.9 }
                                ],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(218, 247, 166, 0.8)",
                                "borderColor": "#7D3C98"
                            }
                        ]
                    },
                    "chartTab": "POSTING",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "PolarChart"
                },
                replacement: {
                    "index": 5,
                    "chartId": "PolarChart",
                    "type": "polarArea",
                    "name": "Status wise Distribution",
                    "colSpan": 1,
                    "enabled": false,
                    "defaultData": {
                        "labels": ["Review", "Deleted", "Review Completed"],
                        "datasets": [
                            {
                                "label": "My First Dataset",
                                "data": [300, 50, 100],
                                "backgroundColor": ["rgb(255, 99, 132,0.6)", "rgb(54, 162, 235,0.6)", "rgb(255, 205, 86,0.6)"]
                            }
                        ]
                    },
                    "chartTab": "POSTING",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "document_count_by_billing_unit"
                },
                replacement: {
                    "index": 4,
                    "chartId": "document_count_by_billing_unit",
                    "type": "doughnut",
                    "name": "Document Count by Billing unit",
                    "colSpan": 1,
                    "enabled": true,
                    "defaultData": {
                        "labels": ["Review", "Deleted", "Review Completed"],
                        "datasets": [
                            {
                                "label": "My First Dataset",
                                "data": [300, 50, 100],
                                "backgroundColor": ["rgb(255, 99, 132,0.6)", "rgb(54, 162, 235,0.6)", "rgb(255, 205, 86,0.6)"]
                            }
                        ]
                    },
                    "chartTab": "EXTRACTION",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "document_ace_count_by_date"
                },
                replacement: {
                    "index": 3,
                    "chartId": "document_ace_count_by_date",
                    "xAxisLabel": "Date",
                    "yAxisLabel": "Document Uploaded/ACE Count",
                    "type": "line",
                    "name": "Document Uploaded/ACE Count by Date",
                    "colSpan": 2,
                    "enabled": true,
                    "defaultData": {
                        "labels": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        "datasets": [
                            {
                                "label": "Total Document Count",
                                "data": [220, 160, 120, 200, 300, 125, 323, 345, 190, 155],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(232, 218, 239, 0.8)",
                                "borderColor": "#7D3C98"
                            },
                            {
                                "label": "Review Completed Documents",
                                "data": [120, 120, 80, 190, 110, 100, 200, 231, 150, 120],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(236, 112, 99,0.8)",
                                "borderColor": "#D4AC0D"
                            }
                        ]
                    },
                    "chartTab": "EXTRACTION",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "cum_ace_percentage_by_date"
                },
                replacement: {
                    "index": 2,
                    "chartId": "cum_ace_percentage_by_date",
                    "xAxisLabel": "Date",
                    "yAxisLabel": "Cum ACE %",
                    "type": "line",
                    "name": "Cummulative ACE Percentage by Date",
                    "colSpan": 2,
                    "enabled": true,
                    "defaultData": {
                        "labels": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        "datasets": [
                            {
                                "label": "Total Document Count",
                                "data": [220, 160, 120, 200, 300, 125, 323, 345, 190, 155],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(232, 218, 239, 0.8)",
                                "borderColor": "#7D3C98"
                            },
                            {
                                "label": "Review Completed Documents",
                                "data": [120, 120, 80, 190, 110, 100, 200, 231, 150, 120],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(236, 112, 99,0.8)",
                                "borderColor": "#D4AC0D"
                            }
                        ]
                    },
                    "chartTab": "EXTRACTION",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "document_count_by_hour"
                },
                replacement: {
                    "index": 1,
                    "chartId": "document_count_by_hour",
                    "xAxisLabel": "Hour of Day",
                    "yAxisLabel": "Average Document Count",
                    "type": "bar",
                    "name": "Average Documents Uploaded",
                    "colSpan": 1,
                    "enabled": true,
                    "defaultData": {
                        "labels": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        "datasets": [
                            {
                                "label": "Document Count by Hour",
                                "data": [22, 16, 12, 2, 0, 8, 3, 3, 2, 6, 25, 29, 47, 44, 32, 23, 14, 22, 21, 25, 14, 8, 6, 6],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(232, 218, 239, 0.8)",
                                "borderColor": "#7D3C98"
                            },
                            {
                                "label": "Months Set 2",
                                "data": [2, 1, 10, 12, 10, 18, 13, 13, 12, 16, 5, 9, 7, 4, 2, 3, 4, 12, 1, 5, 4, 18, 16, 16],
                                "borderWidth": 1,
                                "backgroundColor": "rgba(232, 218, 239,0.8)",
                                "borderColor": "#D4AC0D"
                            }
                        ]
                    },
                    "chartTab": "EXTRACTION",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        },
        {
            replaceOne: {
                filter: {
                    chartId: "status_wise_document_count"
                },
                replacement: {
                    "index": 0,
                    "chartId": "status_wise_document_count",
                    "type": "pie",
                    "name": "Status wise Document Count",
                    "colSpan": 1,
                    "enabled": true,
                    "defaultData": {
                        "labels": ["Review", "Deleted", "Review Completed"],
                        "datasets": [
                            {
                                "label": "My First Dataset",
                                "data": [300, 50, 100],
                                "backgroundColor": ["rgb(255, 99, 132,0.6)", "rgb(54, 162, 235,0.6)", "rgb(255, 205, 86,0.6)"]
                            }
                        ]
                    },
                    "chartTab": "EXTRACTION",
                    "viewType":"graph",
                    createdOn: util.generateTimestamp()
                },
                upsert: true
            }
        }
    ], {
        upsert: true
    }, function (err, r) {
        assert.equal(null, err);
        cb();
    });
}