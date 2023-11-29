const client = require('../util/mongoClient');
const assert = require('assert');
const async = require('async');
const faker = require('faker');
const util = require('../util/util');

// const md5 = require('md5.js');
const crypto = require('crypto-js');
const moment = require('moment');
const uuid = require('uuid');
const path  = require('path');
const config = require('../config');
const dbName = config.mongoDBName;

client.connect(function (err) {
    assert.equal(null, err);
    createMockData();
});

const createMockData = () => {

    async.parallel([
        function (callback) {
            createMockVendors(callback);
        },
    ],
        function (err, results) {
            console.log("Inserted the vendor mock data...");
            client.close();
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
                    "name": "R & E Fasteners, Inc",
                    "address": "P.O. BOX 5120 SPARKS, NEVADA 89432-5120",
                    "logo":  "r-e-fasteners.png",
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
                    vendorId: "2"
                },
                replacement: {
                    vendorId: "2",
                    "name": "SG Gaming",
                    "address": "Shuffle Master GmbH & Co KG, Wipplingerstraße 25, 1010 Vienna, Austria",
                    "logo":  "s-g-gaming.png",
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
                    vendorId: "3"
                },
                replacement: {
                    vendorId: "3",
                    "name": "TOVIS Co., LTD.",
                    "address": "7-10,Songdo-Dong, Yeonsu-Gu, Incheon, KOREA",
                    "logo":  "tovis.png",
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
                    vendorId: "4"
                },
                replacement: {
                    vendorId: "4",
                    "name": "Catapult Global",
                    "address": "1000 LEE STREET ELK GROVE VILLAGE, IL 60007",
                    "logo":  "catapult-global.png",
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
                    vendorId: "5"
                },
                replacement: {
                    vendorId: "5",
                    "name": "Sternschnuppe LLC.",
                    "address": "3855 W Harmon Ave, Las Vegas, NV 89103",
                    "logo":  "sternschnuppe.png",
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
                    vendorId: "6"
                },
                replacement: {
                    vendorId: "6",
                    "name": "EYE-FI",
                    "address": "7900 W. Sunset Rd. #200, Las Vegas, NV 89113, United States",
                    "logo":  "eye-fi.png",
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
                    "name": "China TradeRite Company Limited",
                    "address": "RM 2307 A&B 23/F, CABLE TV TOWER 9 HOI SHING ROAD, TSUEN WANN,N.T. HONG KONG",
                    "logo":  "china-traderite-company.png",
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
                    vendorId: "8"
                },
                replacement: {
                    vendorId: "8",
                    "name": "B K Controls,Inc.",
                    "address": "801 Hilltop Drive, Itasca, IL 60143-1322",
                    "logo":  "bk-controls.jpg",
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
                    vendorId: "9"
                },
                replacement: {
                    vendorId: "9",
                    "name": "Yellowfish Graphics",
                    "address": "7900 W Sunset Rd., Ste 200 Las Vegas,NV 89113",
                    "logo":  "yellowfish.png",
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
                    "name": "MicroFirst GAMING",
                    "address": "445 Godwin Ave. Midland Park, NJ 07432",
                    "logo":  "micro-first-gaming.png",
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
                    "name": "Circular Technologies",
                    "address": "3275 Prairie Ave, Boulder, CO 80301, United States",
                    "logo":  "circular-technologies.png",
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
                    "name": "ASPINA",
                    "address": "Global Corporate Brand of Shinano Kenshi Corporation 6065 Bristol Parkway, Culver City,CA 90230",
                    "logo": "aspina.png",
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
                    vendorId: "13"
                },
                replacement: {
                    vendorId: "13",
                    "name": "SIGMATRON International, Inc.",
                    "address": "2201 Landmeier Road Elk Grove Village, IL 60007, USA",
                    "logo":  "sigmatron.jpg",
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
                    "name": "Conductive Technolgies Inc",
                    "address": "935 Borom Rd, York, PA 17404",
                    "logo":  "conductive-technologies.png",
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
                    "name": "Precision Metals Inc",
                    "address": "1315 Greg Street,Suite 106 Sparks, NV 89431",
                    "logo":  "precision-metals.png",
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
                    "name": "Las Cruces Machine, Mfg. & Engineering, Inc.",
                    "address": "6000 S Main St suite b, Mesilla Park, NM 88047",
                    "logo":  "las-cruces-machine.png",
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
                    "name": "R.L. Tool, Inc.",
                    "address": "10525 Florida Avenue South Suite 111 Bloomington, MN  55438 United States of America",
                    "logo":  "r-l-tool.png",
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
                    "name": "IGM Solutions Inc",
                    "address": "1900 Enterprise Ct, Libertyville, IL 60048, United States",
                    "logo":  "igm-solutions.png",
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
                    "name": "Creative Electronics & Software",
                    "address": "751 E Pilot Rd # A, Las Vegas, NV 89119, USA",
                    "logo":  "creative-electronics.jpg",
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
                    "name": "C. Keller Manufacturing, Inc.",
                    "address": "925 N, Ellsworth Ave Villa Park IL 60181",
                    "logo":  "c-keller.png",
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
                    vendorId: "21"
                },
                replacement: {
                    vendorId: "21",
                    "name": "Modern Manufacturing & Engineering Inc.",
                    "address": "9380 Winnetka Ave N, Brooklyn Park, MN 55445",
                    "logo":  "modern-manufacturing-engineering.png",
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
                    vendorId: "22"
                },
                replacement: {
                    vendorId: "22",
                    "name": "Interblock Gaming ",
                    "address": "Gorenjska cesta 23, 1234 Mengeš",
                    "logo":   "interblock.png",
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
                    vendorId: "23"
                },
                replacement: {
                    vendorId: "23",
                    "name": "Shinano Kenshi",
                    "address": "6065 Bristol Parkway, Culver City, CA",
                    "logo":   "shinano-kenshi.jpg",
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
                    vendorId: "24"
                },
                replacement: {
                    vendorId: "24",
                    "name": "REACH Technology",
                    "address": "Novanta Corporation 4600 Campus Place Mukilteo WA 98275 , United States",
                    "logo":  "reach-technology.png",
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
                    vendorId: "25"
                },
                replacement: {
                    vendorId: "25",
                    "name": "L-com",
                    "address": "Infinite Electronics International, Inc, 17792 Fitch, Irvine, CA 92614, United States",
                    "logo":   "l-com.png",
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
                    vendorId: "26"
                },
                replacement: {
                    vendorId: "26",
                    "name": "GLM Cabinets, Inc.",
                    "address": "5325 S. Valley View, #3, Las Vegas, Nevada 89118",
                    "logo":   "glm-cabinets.png",
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
                    vendorId: "27"
                },
                replacement: {
                    vendorId: "27",
                    "name": "CDW Direct",
                    "address": "PO Box 75723 Chicago, IL 60675-5723",
                    "logo":   "cdw.jpg",
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
                    vendorId: "28"
                },
                replacement: {
                    vendorId: "28",
                    "name": "Super Color Digital, LLC",
                    "address": "3451 W Martin Ave Las Vegas, NV 89118",
                    "logo":   "supercolor.png",
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
                    vendorId: "29"
                },
                replacement: {
                    vendorId: "29",
                    "name": "GARY PLATT MANUFACTURING",
                    "address": "4643 AIRCENTER CIRCLE RENO NV 89502-5948",
                    "logo":   "gary-platt.png",
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
                    vendorId: "30"
                },
                replacement: {
                    vendorId: "30",
                    "name": "BCM Advanced Research",
                    "address": "11 Chrysler Irvine, CA 92618 (949) 470-1888",
                    "logo":   "bcm-advance-research.png",
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
                    vendorId: "31"
                },
                replacement: {
                    vendorId: "31",
                    "name": "ESAC",
                    "address": "ELECTRONIC SUB-ASSEMBLIES & CABLES , 2700 E PATRICK LANE,STE. 7 LAS VEGAS, NV 89120 USA",
                    "logo":   "esac.png",
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
                    vendorId: "32"
                },
                replacement: {
                    vendorId: "32",
                    "name": "Tatung Company of America, Inc.",
                    "address": "2850 E El Presidio St, Long Beach, CA 90810-1178, United States",
                    "logo":   "tatung-company.png",
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
                    vendorId: "33"
                },
                replacement: {
                    vendorId: "33",
                    "name": "Gill's PRINTING AND COLOR GRAPHICS",
                    "address": "P.O. BOX 400188 , LAS VEGAS, NV 89140",
                    "logo":   "gills.jpg",
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
                    vendorId: "34"
                },
                replacement: {
                    vendorId: "34",
                    "name": "SUN STAR INDUSTRIES, INC.",
                    "address": "7721-E,GRAY ROAD SUITE # 203 SCOTTSDALE,AZ 85260",
                    "logo":   "sun-star-industries.png",
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
                    vendorId: "35"
                },
                replacement: {
                    vendorId: "35",
                    "name": "EFFINET SYSTEMS,INC",
                    "address": "# 705,Byucksan Digital Valley V 244 Beotkkot-ro Gasan-dong Geumcheon-gu Seoul, South Korea 153-788",
                    "logo":   "effinet.png",
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
                    vendorId: "36"
                },
                replacement: {
                    vendorId: "36",
                    "name": "Gamesman Limited",
                    "address": "Crompton Fields, Crompton Way, Crawley RH10 9QB, United Kingdom",
                    "logo":   "gamesman.png",
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
                    vendorId: "37"
                },
                replacement: {
                    vendorId: "37",
                    "name": "IBASE GAMING INC.",
                    "address": "2F, No. 542-17, Zhong -Zheng Rd. Xin Zhuang Dist. , New Taipei City 24255, Taiwan",
                    "logo":   "ibase-gaming.png",
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
                    vendorId: "38"
                },
                replacement: {
                    vendorId: "38",
                    "name": "AXIOMTEK",
                    "address": "18138 ROWLAND STREET CITY OF INDUSTRY,CA 91748,USA",
                    "logo":   "axiomtek.png",
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
                    vendorId: "39"
                },
                replacement: {
                    vendorId: "39",
                    "name": "Custom Plastic Cards",
                    "address": "2780 South Jones Blvd #3467 Las Vegas, NV 89146",
                    "logo":   "custom-plastic-cards.png",
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
                    vendorId: "40"
                },
                replacement: {
                    vendorId: "40",
                    "name": "Arrow Electronics Inc",
                    "address": "Suite 6020 75 Remittance Drive Chicago, IL 60675",
                    "logo":   "arrow.png",
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
                    vendorId: "41"
                },
                replacement: {
                    vendorId: "41",
                    "name": "McMASTER-CARR",
                    "address": "PO Box 7690 Chicago IL 60680-7690",
                    "logo":   "mcmaster-carr.png",
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
                    vendorId: "42"
                },
                replacement: {
                    vendorId: "42",
                    "name": "C 2 G",
                    "address": "ORTRONICS INC. Data Communications Division of Legrand C2G|Ortronics|Quiktron|Electrorack|AFCO  PO Box 3520 Carol Stream,IL 60132-3520",
                    "logo":   "c-2-g.png",
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
                    vendorId: "43"
                },
                replacement: {
                    vendorId: "43",
                    "name": "JCM GLOBAL",
                    "address": "JCM American Corporation 925 Pilot Rd. 89119 Las Vegas, NV",
                    "logo":   "jcm-global.png",
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
                    vendorId: "44"
                },
                replacement: {
                    vendorId: "44",
                    "name": "The Bright Group LLC",
                    "address": "1660 Helm Drive Suite 100, Las Vegas, NV 89119, USA",
                    "logo":   "the_bright_group.png",
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
                    vendorId: "45"
                },
                replacement: {
                    vendorId: "45",
                    "name": "SMS INDUSTRIES, LLC",
                    "address": "6340 S. Sandhill Rd,Suite 3 Las Vegas, NV 89120",
                    "logo":   "sms-industries.png",
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
                    vendorId: "46"
                },
                replacement: {
                    vendorId: "46",
                    "name": "SUZOHAPP AMERICAS LLC",
                    "address": "7331 SOLUTIONS CENTER CHICAGO, IL. 60677-7003",
                    "logo":   "suzohapp.png",
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
                    vendorId: "47"
                },
                replacement: {
                    vendorId: "47",
                    "name": "BOB, Inc.",
                    "address": "8740 49th. Avenue North Minneapolis,MN 55428",
                    "logo":   "bob-inc.jpg",
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
                    vendorId: "48"
                },
                replacement: {
                    vendorId: "48",
                    "name": "Crane Payment Innovations, Inc.",
                    "address": "3222 Phoenixville Pike, Suite 200 Malvern PA 19355",
                    "logo":   "crane-payment-innovations.png",
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
                    vendorId: "49"
                },
                replacement: {
                    vendorId: "49",
                    "name": "XS Technology, Inc.",
                    "address": "28364 S.Western Avenue #486 Rancho Palos Verdes, CA 90275",
                    "logo":   "xs-technology.png",
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
                    vendorId: "50"
                },
                replacement: {
                    vendorId: "50",
                    "name": "LMS Bearings Inc.",
                    "address": "1751 Panorama Point # A, Lafayette, CO 80026, United State",
                    "logo":   "lms-bearings.png",
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
                    vendorId: "51"
                },
                replacement: {
                    vendorId: "51",
                    "name": "KEY TRONIC CORPORATION",
                    "address": "WELLS FARGO BANK P.O. BOX 201473 DALLAS, TX  75320-1473",
                    "logo":   "keytronics.png",
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
                    vendorId: "52"
                },
                replacement: {
                    vendorId: "52",
                    "name": "JCS Technologies",
                    "address": "Las Vegas, NV 89120",
                    "logo":   "jcs-technologies.jpg",
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
